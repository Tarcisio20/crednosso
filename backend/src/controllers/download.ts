import { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import { createLog } from "services/logService";
import { sanitizeDownloadName, sanitizeDownloadPaginationMeta } from "utils/audit/audit-download";

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
    await createLog({
      level: 'INFO',
      action: 'GET_ALL_DOWNLOAD_PAGINATION',
      message: 'Sucesso ao carregar arquivos',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      resource: 'download',
      statusCode: 201,
      meta: sanitizeDownloadPaginationMeta({
        page,
        limit,
        total: arquivos.length,
        totalPages: Math.ceil(arquivos.length / limit),
        pageCount: paginated.length,
      }),
    })
    res.status(201).json({
      page,
      limit,
      total: arquivos.length,
      totalPages: Math.ceil(arquivos.length / limit),
      data: paginated,
    });
    return
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'GET_ALL_DOWNLOAD_PAGINATION',
      message: 'Erro ao carregar arquivos',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: "download",
      meta: { error: String(error) },
    })
    res.status(500).json({ message: "Erro ao processar os arquivos." });
    return
  }
};

export const donwloadArchiveForName: RequestHandler = async (req, res) => {
  const { name } = req.params;
  if (!name) {
    await createLog({
      level: 'ERROR',
      action: 'DOWNLOAD_ARCHIVE',
      message: 'Informar o nome do arquivo para continuar!',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 400,
      resource: "download",
    })
  }
  console.log("📥 Requisição de download recebida:", name);
  try {
    const filePath = path.join(__dirname, "..", "..", "planilhas", name);
    if (!fs.existsSync(filePath)) {
      await createLog({
        level: "ERROR",
        action: "DOWNLOAD_ARCHIVE",
        message: "Arquivo não encontrado",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 404,
        resource: "download",
        resourceId: name,
        meta: { file: sanitizeDownloadName(name) },
      });
      res.status(404).json({ message: "Arquivo não encontrado." });
      return;
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
    // log de sucesso ANTES de fazer o pipe (para não perder o log)
    await createLog({
      level: "INFO",
      action: "DOWNLOAD_ARCHIVE",
      message: "Iniciando download do arquivo",
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200,
      resource: "download",
      resourceId: name,
      meta: { file: sanitizeDownloadName(name) },
    });
    // ✅ Envia o arquivo (sem usar return!)
    // Cria um stream e envia o arquivo
    const stream = fs.createReadStream(filePath);
    stream.on("error", async (err) => {
      await createLog({
        level: "ERROR",
        action: "DOWNLOAD_ARCHIVE",
        message: "Erro ao ler o arquivo",
        userSlug: req.userSlug ?? null,
        route: req.route?.path ?? null,
        method: req.method ?? null,
        statusCode: 500,
        resource: "download",
        resourceId: name,
        meta: { file: sanitizeDownloadName(name), error: String(err) },
      });
      console.error("❌ Erro ao ler o arquivo:", err);
      res.status(500).json({ message: "Erro ao ler o arquivo." });
      return
    });
    await createLog({
      level: 'INFO',
      action: 'DOWNLOAD_ARCHIVE',
      message: 'Sucesso ao carregar o arquivo',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 200
    })
    if (!res.headersSent) {
      res.status(500).json({ message: "Erro ao ler o arquivo." });
      return
    } else {
      res.end();
    }
    stream.pipe(res);
  } catch (error) {
    await createLog({
      level: 'ERROR',
      action: 'DOWNLOAD_ARCHIVE',
      message: 'Erro ao carregar o arquivo',
      userSlug: req.userSlug ?? null,
      route: req.route?.path ?? null,
      method: req.method ?? null,
      statusCode: 500,
      resource: "download",
      resourceId: name,
      meta: { file: sanitizeDownloadName(name), error: String(error) },
    })
    res.status(500).json({ message: "Erro ao processar o download." });
    return
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