import { chromium, type Locator, type Page } from "playwright";
import { addAtmServiceOrder } from "../services/atm-service-order";

const TABLE_ID = "formularioOrdemServicoAtmConsultar:tabelaDataTable";

export type AtmOsSearchInput = {
  id_atm: number | string;
};

export type AtmServiceOrderData = {
  num_os: number;
  id_atm: number;
  name_atm: string;
  tipo_os: string;
  datas_geracao: string;
  situacao_os: string;
  data_atendimento: string;
  data_conclusao: string;
  transportadora_id: number;
  transportadora_nome: string;
  operador: string;
  suprimento: string;
  recolhimento: string;
};

export type GetOsOpenProgressPayload = {
  etapa: string;
  message: string;
  totalAtms?: number;
  atual?: number;
  totalColetado?: number;
  totalSalvo?: number;
  totalErro?: number;
  atmId?: string;
};

export type RunGetOsOpenOptions = {
  onProgress?: (payload: GetOsOpenProgressPayload) => void;
};

function emitirProgresso(
  options: RunGetOsOpenOptions | undefined,
  payload: GetOsOpenProgressPayload
) {
  options?.onProgress?.(payload);
}

function normalizarTexto(value: unknown) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function limparTexto(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function parseNumero(value: unknown) {
  const raw = String(value ?? "").trim();

  const apenasDigitos = raw.replace(/\D/g, "");

  const numero = Number(apenasDigitos);

  return Number.isFinite(numero) ? numero : 0;
}

function separarIdNome(value: string) {
  const partes = String(value ?? "").split(" - ");

  return {
    id: parseNumero(partes[0] ?? ""),
    nome: limparTexto(partes.slice(1).join(" - ")),
  };
}

async function clicarAcessoNegadoSeAparecer(page: Page) {
  const acessoNegado = page.getByText("Acesso negado.", { exact: true }).first();

  const apareceu = await acessoNegado
    .waitFor({
      state: "visible",
      timeout: 3000,
    })
    .then(() => true)
    .catch(() => false);

  if (apareceu) {
    console.log("[GET OS OPEN] Acesso negado detectado.");
    await acessoNegado.click().catch(() => null);
  }
}

async function preencherCampoPorId(page: Page, id: string, valor: string) {
  const campo = page.locator(`[id="${id}"]`).first();

  await campo.waitFor({
    state: "visible",
    timeout: 10000,
  });

  await campo.fill(valor);
}

async function preencherCampoPorNome(
  page: Page,
  nomeCampo: string,
  valor: string
) {
  const campo = page.getByRole("textbox", { name: nomeCampo }).first();

  await campo.waitFor({
    state: "visible",
    timeout: 10000,
  });

  await campo.click();
  await campo.fill("");
  await campo.fill(valor);
}

async function clicarPorRole(
  page: Page,
  component: Parameters<Page["getByRole"]>[0],
  name: string,
  exact = true
) {
  const elemento = page
    .getByRole(component, {
      name,
      exact,
    })
    .first();

  await elemento.waitFor({
    state: "visible",
    timeout: 10000,
  });

  await elemento.click();
}

async function passarMouseNoMenu(page: Page, nomeMenu: string) {
  const menu = page
    .locator("li[role='menuitem']")
    .filter({
      has: page.locator(".ui-menuitem-text", {
        hasText: nomeMenu,
      }),
    })
    .first();

  await menu.waitFor({
    state: "visible",
    timeout: 10000,
  });

  await menu.hover();
}

export async function percorrerTabelaPorId(page: Page, tableId: string) {
  const tabela = page.locator(`[id="${tableId}"]`);

  await tabela.waitFor({
    state: "visible",
    timeout: 30000,
  });

  const linhas = tabela.locator("tbody > tr");

  const primeiraLinhaExiste = await linhas
    .first()
    .waitFor({
      state: "visible",
      timeout: 10000,
    })
    .then(() => true)
    .catch(() => false);

  if (!primeiraLinhaExiste) {
    return [];
  }

  const totalLinhas = await linhas.count();

  const dados: string[][] = [];

  for (let i = 0; i < totalLinhas; i++) {
    const linha = linhas.nth(i);

    const textoLinha = await linha.innerText().catch(() => "");

    const textoNormalizado = normalizarTexto(textoLinha);

    if (
      textoNormalizado.includes("nenhum registro") ||
      textoNormalizado.includes("no records")
    ) {
      continue;
    }

    const colunas = linha.locator("td");
    const totalColunas = await colunas.count();

    const valoresLinha: string[] = [];

    for (let j = 0; j < totalColunas; j++) {
      const texto = await colunas.nth(j).innerText();

      valoresLinha.push(limparTexto(texto));
    }

    if (valoresLinha.some((valor) => valor !== "")) {
      dados.push(valoresLinha);
    }
  }

  return dados;
}

function montarOsDaLinha(linha: string[]): AtmServiceOrderData | null {
  const os = linha[3] ?? "";
  const atm = linha[4] ?? "";
  const tipoOs = linha[7] ?? "";
  const dataAbertura = linha[8] ?? "";
  const status = linha[9] ?? "";
  const dataAtendimento = linha[10] ?? "";
  const dataFechamento = linha[11] ?? "";
  const transportadora = linha[12] ?? "";
  const operador = linha[13] ?? "";
  const suprimento = linha[14] ?? "";
  const recolhimento = linha[15] ?? "";

  const statusNormalizado = normalizarTexto(status);

  const deveSalvar =
    statusNormalizado.includes("em atendimento") ||
    statusNormalizado.includes("pendente");

  if (!deveSalvar) {
    return null;
  }

  const atmInfo = separarIdNome(atm);
  const transportadoraInfo = separarIdNome(transportadora);

  const numOs = parseNumero(os);

  if (!numOs || !atmInfo.id) {
    return null;
  }

  return {
    num_os: numOs,
    id_atm: atmInfo.id,
    name_atm: atmInfo.nome,
    tipo_os: limparTexto(tipoOs),
    datas_geracao: limparTexto(dataAbertura),
    situacao_os: limparTexto(status),
    data_atendimento: limparTexto(dataAtendimento),
    data_conclusao: limparTexto(dataFechamento),
    transportadora_id: transportadoraInfo.id,
    transportadora_nome: transportadoraInfo.nome,
    operador: limparTexto(operador),
    suprimento: limparTexto(suprimento),
    recolhimento: limparTexto(recolhimento),
  };
}

async function loginEIrParaOrdemServico(page: Page) {
  const user = process.env.BACKOFFICE_USER;
  const pass = process.env.BACKOFFICE_PASS;

  if (!user || !pass) {
    throw new Error(
      "BACKOFFICE_USER e BACKOFFICE_PASS precisam estar configurados no .env"
    );
  }

  await page.goto(process.env.BACKOFFICE_URL as string, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  page.setDefaultTimeout(60000);

  await clicarAcessoNegadoSeAparecer(page);

  await preencherCampoPorId(page, "formulario:txLoginInput", user);
  await preencherCampoPorId(page, "formulario:txSenhaInput", pass);

  await clicarPorRole(page, "button", "Entrar");

  await passarMouseNoMenu(page, "REDE DE ATM");

  await clicarPorRole(page, "link", "Ordem de serviços");
}

export async function getOsOpenForAtms(
  page: Page,
  atms: AtmOsSearchInput[],
  options?: RunGetOsOpenOptions
): Promise<AtmServiceOrderData[]> {
  const filtrado: AtmServiceOrderData[] = [];

  emitirProgresso(options, {
    etapa: "coleta-iniciada",
    message: "Iniciando coleta de OSs abertas.",
    totalAtms: atms.length,
    totalColetado: 0,
  });

  await loginEIrParaOrdemServico(page);

  for (const [index, item] of atms.entries()) {
    const idAtm = String(item.id_atm ?? "").trim();

    if (!idAtm) {
      emitirProgresso(options, {
        etapa: "erro-coleta",
        message: "ATM inválido recebido para pesquisa.",
        atual: index + 1,
        totalAtms: atms.length,
        totalColetado: filtrado.length,
      });

      continue;
    }

    try {
      console.log(`[GET OS OPEN] Pesquisando ATM ${idAtm}`);

      emitirProgresso(options, {
        etapa: "pesquisando",
        message: `Pesquisando OSs do ATM ${idAtm}.`,
        atual: index + 1,
        totalAtms: atms.length,
        totalColetado: filtrado.length,
        atmId: idAtm,
      });

      await preencherCampoPorNome(page, "ATM", idAtm);

      await clicarPorRole(page, "button", "Pesquisar");

      await page
        .locator(`[id="${TABLE_ID}"]`)
        .waitFor({
          state: "visible",
          timeout: 30000,
        });

      await page.waitForTimeout(1500);

      const dadosTabela = await percorrerTabelaPorId(page, TABLE_ID);

      console.log(
        `[GET OS OPEN] ATM ${idAtm} - linhas encontradas:`,
        dadosTabela.length
      );

      for (const linha of dadosTabela) {
        const os = montarOsDaLinha(linha);

        if (os) {
          filtrado.push(os);
        }
      }

      emitirProgresso(options, {
        etapa: "coletado",
        message: `ATM ${idAtm} processado.`,
        atual: index + 1,
        totalAtms: atms.length,
        totalColetado: filtrado.length,
        atmId: idAtm,
      });
    } catch (error) {
      console.error(`[GET OS OPEN] Erro ao pesquisar ATM ${idAtm}:`, error);

      emitirProgresso(options, {
        etapa: "erro-coleta",
        message: `Erro ao pesquisar ATM ${idAtm}.`,
        atual: index + 1,
        totalAtms: atms.length,
        totalColetado: filtrado.length,
        atmId: idAtm,
      });

      continue;
    }
  }

  emitirProgresso(options, {
    etapa: "coleta-finalizada",
    message: "Coleta de OSs abertas finalizada.",
    totalAtms: atms.length,
    totalColetado: filtrado.length,
  });

  return filtrado;
}

async function salvarAtmServiceOrders(
  data: AtmServiceOrderData[],
  options?: RunGetOsOpenOptions
) {
  let salvos = 0;

  const erros: {
    num_os: number;
    id_atm: number;
  }[] = [];

  emitirProgresso(options, {
    etapa: "salvando",
    message: "Iniciando salvamento das OSs abertas no banco.",
    totalColetado: data.length,
    totalSalvo: salvos,
    totalErro: erros.length,
  });

  for (const [index, item] of data.entries()) {
    const result = await addAtmServiceOrder(item);

    if (result) {
      salvos++;
    } else {
      erros.push({
        num_os: item.num_os,
        id_atm: item.id_atm,
      });
    }

    emitirProgresso(options, {
      etapa: result ? "salvo" : "erro-salvar",
      message: result
        ? `OS salva/atualizada: ${item.num_os}.`
        : `Erro ao salvar OS: ${item.num_os}.`,
      atual: index + 1,
      totalColetado: data.length,
      totalSalvo: salvos,
      totalErro: erros.length,
      atmId: String(item.id_atm),
    });
  }

  emitirProgresso(options, {
    etapa: "salvamento-finalizado",
    message: "Salvamento das OSs abertas finalizado.",
    totalColetado: data.length,
    totalSalvo: salvos,
    totalErro: erros.length,
  });

  return {
    totalRecebido: data.length,
    totalSalvo: salvos,
    totalErro: erros.length,
    erros,
  };
}

export async function runGetOsOpenAtmsCron(
  atms: AtmOsSearchInput[],
  options?: RunGetOsOpenOptions
) {
  const headless = process.env.PLAYWRIGHT_HEADLESS === "true";

  const browser = await chromium.launch({
    headless,
    channel: "chrome",
  });

  const page = await browser.newPage({
    viewport: {
      width: 1366,
      height: 768,
    },
  });

  try {
    console.log("[GET OS OPEN] Iniciando rotina automática.");

    emitirProgresso(options, {
      etapa: "inicio",
      message: "Iniciando rotina automática de OSs abertas.",
    });

    const data = await getOsOpenForAtms(page, atms, options);

    console.log("[GET OS OPEN] Resultado final:");
    console.table(data);

    const resultSave = await salvarAtmServiceOrders(data, options);

    console.log("[GET OS OPEN] Resultado ao salvar no banco:");
    console.log(resultSave);

    const result = {
      success: true,
      totalColetado: data.length,
      save: resultSave,
    };

    emitirProgresso(options, {
      etapa: "finalizado",
      message: "Rotina automática de OSs abertas finalizada.",
      totalColetado: data.length,
      totalSalvo: resultSave.totalSalvo,
      totalErro: resultSave.totalErro,
    });

    return result;
  } catch (error) {
    console.error("[GET OS OPEN] Erro geral na rotina:", error);

    emitirProgresso(options, {
      etapa: "erro",
      message: "Erro geral na rotina de OSs abertas.",
      totalColetado: 0,
    });

    return {
      success: false,
      totalColetado: 0,
      error,
    };
  } finally {
    await browser.close().catch(() => null);
  }
}