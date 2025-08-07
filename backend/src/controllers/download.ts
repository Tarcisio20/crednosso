import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

// Função auxiliar para extrair data de nomes no formato dados-DD-MM-YYYY.xlsx
function extrairDataDoNome(nomeArquivo: string): Date | null {
  const regex = /dados-(\d{2})-(\d{2})-(\d{4})\.xlsx$/i;
  const match = nomeArquivo.match(regex);
  if (!match) return null;

  const [_, dia, mes, ano] = match;
  return new Date(`${ano}-${mes}-${dia}`);
}

export const getAllPagination: RequestHandler = async (req, res) => {
  try {

    manterUltimos10Arquivos()

    const pastaPlanilhas = path.join(__dirname, "..", "..", "planilhas");

    const arquivos = fs
      .readdirSync(pastaPlanilhas)
      .filter((file) => {
        const filePath = path.join(pastaPlanilhas, file);
        return (
          fs.statSync(filePath).isFile() &&
          /^dados-\d{2}-\d{2}-\d{4}\.xlsx$/i.test(file) // nome deve seguir padrão exato
        );
      })
      .sort((a, b) => {
        const dataA = extrairDataDoNome(a);
        const dataB = extrairDataDoNome(b);
        if (!dataA || !dataB) return 0;
        return dataB.getTime() - dataA.getTime(); // mais novo primeiro
      });

    const page = parseInt(req.params.page || "1");
    const limit = parseInt(req.params.pageSize || "10");

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginated = arquivos.slice(start, end);

    res.json({
      page,
      limit,
      total: arquivos.length,
      totalPages: Math.ceil(arquivos.length / limit),
      data: paginated,
    });
  } catch (error) {
    console.error("Erro ao ler arquivos:", error);
    res.status(500).json({ message: "Erro ao processar os arquivos." });
  }
};


export const donwloadArchiveForName: RequestHandler = async (req, res) => {
  const { name } = req.params;
  console.log("📥 Requisição de download recebida:", name);

  try {
    const filePath = path.join(__dirname, "..", "..", "planilhas", name);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: "Arquivo não encontrado." });
      return;
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`);

    // ✅ Envia o arquivo (sem usar return!)
    // Cria um stream e envia o arquivo
    const stream = fs.createReadStream(filePath);
    stream.on("error", (err) => {
      console.error("❌ Erro ao ler o arquivo:", err);
      res.status(500).json({ message: "Erro ao ler o arquivo." });
    });

    stream.pipe(res);

  } catch (error) {
    console.error("Erro inesperado:", error);
    res.status(500).json({ message: "Erro ao processar o download." });
  }
};

export const manterUltimos10Arquivos = () => {
  const pastaPlanilhas = path.join(__dirname, "..", "..", "planilhas");

  const arquivos = fs
    .readdirSync(pastaPlanilhas)
    .filter((file) => {
      const filePath = path.join(pastaPlanilhas, file);
      return (
        fs.statSync(filePath).isFile() &&
        /^dados-\d{2}-\d{2}-\d{4}\.xlsx$/i.test(file)
      );
    })
    .sort((a, b) => {
      const dataA = extrairDataDoNome(a);
      const dataB = extrairDataDoNome(b);
      if (!dataA || !dataB) return 0;
      return dataB.getTime() - dataA.getTime(); // mais novos primeiro
    });

  const arquivosParaExcluir = arquivos.slice(10); // mantém os 10 primeiros

  arquivosParaExcluir.forEach((arquivo) => {
    const caminho = path.join(pastaPlanilhas, arquivo);
    try {
      fs.unlinkSync(caminho);
      console.log(`Arquivo excluído: ${arquivo}`);
    } catch (err) {
      console.error(`Erro ao excluir ${arquivo}:`, err);
    }
  });
};


