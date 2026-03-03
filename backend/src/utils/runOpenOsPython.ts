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
  timeoutMs?: number;
  debug?: boolean;
  scriptPathOverride?: string;
};

export function runOpenOsPython(rows: PythonInputRow[], opts: RunOpts = {}) {
  const { timeoutMs = 180000, debug = true, scriptPathOverride } = opts;

  console.log("[PY] runOpenOsPython called. rows=", rows?.length);

  return new Promise<any>((resolve, reject) => {
    try {
      const rawPath =
        scriptPathOverride ||
        process.env.OPEN_OS_PY_PATH ||
        "src/script/bot-os.py";

      console.log("[PY] rawPath =", rawPath);
      console.log("[PY] cwd =", process.cwd());

      const scriptPath = path.isAbsolute(rawPath)
        ? rawPath
        : path.resolve(process.cwd(), rawPath);

      console.log("[PY] resolved scriptPath =", scriptPath);

      const exists = fs.existsSync(scriptPath);
      console.log("[PY] existsSync =", exists);

      if (!exists) {
        return reject(new Error(`Script python não encontrado: ${scriptPath} (raw: ${rawPath})`));
      }

      const cmd = process.env.PYTHON_CMD || "python";
      const args = [scriptPath];

      console.log("[PY] cmd =", cmd);
      console.log("[PY] spawn =", cmd, args.join(" "));
      console.log("[PY] starting process...");

      const py = spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"], env: process.env });

      let out = "";
      let err = "";

      const timer = setTimeout(() => {
        console.log("[PY] timeout, matando processo...");
        try { py.kill("SIGKILL"); } catch {}
        reject(new Error(`Python timeout após ${timeoutMs}ms.\nSTDERR:\n${err}\nSTDOUT:\n${out}`));
      }, timeoutMs);

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
        clearTimeout(timer);
        reject(new Error(`[PY] erro ao iniciar: ${e.message}`));
      });

      py.on("close", (code) => {
        clearTimeout(timer);
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