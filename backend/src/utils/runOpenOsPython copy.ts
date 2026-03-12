import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export type PythonInputRow = {
  terminal: number;
  troca_total: "S" | "N";
  data_atendimento: string;
  cassete_A: number;
  cassete_B: number;
  cassete_C: number;
  cassete_D: number;
};

type RunOpts = {
  timeoutMs?: number;          // 0 ou undefined = sem timeout
  debug?: boolean;
  scriptPathOverride?: string;
};

export function runOpenOsPython(rows: PythonInputRow[], opts: RunOpts = {}) {
  const { timeoutMs = 0, debug = true, scriptPathOverride } = opts;

  console.log("[PY] runOpenOsPython called. rows=", rows?.length);

  return new Promise<any>((resolve, reject) => {
    try {
      const rawPath =
        scriptPathOverride ||
        process.env.OPEN_OS_PY_PATH ||
        "src/script/bot-os.py";

      const scriptPath = path.isAbsolute(rawPath)
        ? rawPath
        : path.resolve(process.cwd(), rawPath);

      if (!fs.existsSync(scriptPath)) {
        return reject(
          new Error(`Script python não encontrado: ${scriptPath} (raw: ${rawPath})`)
        );
      }

      const cmd = process.env.PYTHON_CMD || "python";
      const args = [scriptPath];

      const py = spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"], env: process.env });

      let out = "";
      let err = "";

      let timer: NodeJS.Timeout | null = null;
      const clearTimer = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      };

      if (timeoutMs && timeoutMs > 0) {
        timer = setTimeout(() => {
          console.log("[PY] timeout, matando processo...");
          try { py.kill("SIGKILL"); } catch {}
          reject(
            new Error(`Python timeout após ${timeoutMs}ms.\nSTDERR:\n${err}\nSTDOUT:\n${out}`)
          );
        }, timeoutMs);
      }

      py.on("spawn", () => console.log("[PY] processo iniciado pid:", py.pid));

      py.stdout.on("data", (d) => {
        const s = d.toString("utf-8");
        out += s;
        if (debug) console.log("[PY][stdout]", s.slice(0, 500));
      });

      py.stderr.on("data", (d) => {
        const s = d.toString("utf-8");
        err += s;
        console.log("[PY][stderr]", s);
      });

      py.on("error", (e) => {
        clearTimer();
        reject(new Error(`[PY] erro ao iniciar: ${e.message}`));
      });

      py.on("close", (code) => {
        clearTimer();
        console.log("[PY] finalizou code:", code);

        if (code !== 0) {
          return reject(new Error(`Python saiu com code=${code}\nSTDERR:\n${err}\nSTDOUT:\n${out}`));
        }

        try {
          resolve(JSON.parse(out));
        } catch {
          reject(new Error(`Falha ao parsear JSON do Python.\nSTDERR:\n${err}\nSTDOUT:\n${out}`));
        }
      });

      py.stdin.write(JSON.stringify(rows));
      py.stdin.end();
    } catch (e: any) {
      reject(new Error("[PY] exceção interna: " + (e?.message ?? String(e))));
    }
  });
}

