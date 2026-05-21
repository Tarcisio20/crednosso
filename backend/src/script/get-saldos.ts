import { Prisma } from "@prisma/client";
import { chromium, type Locator, type Page } from "playwright";
import { addAtmMonitoring } from "../services/atm-mapping";

const ATM_SELECTOR = 'div.divATM[onclick*="linkVisualizar"]';
const LOGIN_URL = "http://10.85.0.88/backoffice/login.jsf?erro=2";

export type AtmSaldoData = {
  id: string;
  name: string;
  ativo: string;
  saldoLogico: string;
  saldoRejeicao: string;
  totalLogico: string;
  saldoConta: string;

  cassete_A: string;
  cassete_A_rejeicao: string;
  cassete_A_cedula: string;
  cassete_A_ativo: string;
  cassete_A_habilitado: string;

  cassete_B: string;
  cassete_B_rejeicao: string;
  cassete_B_cedula: string;
  cassete_B_ativo: string;
  cassete_B_habilitado: string;

  cassete_C: string;
  cassete_C_rejeicao: string;
  cassete_C_cedula: string;
  cassete_C_ativo: string;
  cassete_C_habilitado: string;

  cassete_D: string;
  cassete_D_rejeicao: string;
  cassete_D_cedula: string;
  cassete_D_ativo: string;
  cassete_D_habilitado: string;
};

function toAtmMonitoringCreateInput(
  item: AtmSaldoData
): Prisma.AtmMonitoringCreateInput {
  return {
    name_atm: item.name,
    ativo_atm: item.ativo,
    saldo_logico: item.saldoLogico,
    saldo_rejeicao: item.saldoRejeicao,
    total_logico: item.totalLogico,
    saldo_conta: item.saldoConta,

    cassete_a: item.cassete_A,
    cassete_a_rejeicao: item.cassete_A_rejeicao,
    cassete_a_cedula: item.cassete_A_cedula,
    cassete_a_ativo: item.cassete_A_ativo,
    cassete_a_habilitado: item.cassete_A_habilitado,

    cassete_b: item.cassete_B,
    cassete_b_rejeicao: item.cassete_B_rejeicao,
    cassete_b_cedula: item.cassete_B_cedula,
    cassete_b_ativo: item.cassete_B_ativo,
    cassete_b_habilitado: item.cassete_B_habilitado,

    cassete_c: item.cassete_C,
    cassete_c_rejeicao: item.cassete_C_rejeicao,
    cassete_c_cedula: item.cassete_C_cedula,
    cassete_c_ativo: item.cassete_C_ativo,
    cassete_c_habilitado: item.cassete_C_habilitado,

    cassete_d: item.cassete_D,
    cassete_d_rejeicao: item.cassete_D_rejeicao,
    cassete_d_cedula: item.cassete_D_cedula,
    cassete_d_ativo: item.cassete_D_ativo,
    cassete_d_habilitado: item.cassete_D_habilitado,

    atm: {
      connect: {
        id_system: Number(item.id),
      },
    },
  };
}

async function salvarAtmMonitoring(data: AtmSaldoData[]) {
  let salvos = 0;

  const erros: {
    id: string;
    name: string;
  }[] = [];

  for (const item of data) {
    const idAtm = Number(item.id);

    if (!Number.isFinite(idAtm)) {
      console.log(`[ATM MONITORING] ID inválido: ${item.id}`);

      erros.push({
        id: item.id,
        name: item.name,
      });

      continue;
    }

    const payload = toAtmMonitoringCreateInput(item);

    const result = await addAtmMonitoring(payload);

    if (result) {
      salvos++;
    } else {
      erros.push({
        id: item.id,
        name: item.name,
      });
    }
  }

  return {
    totalRecebido: data.length,
    totalSalvo: salvos,
    totalErro: erros.length,
    erros,
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
    console.log("[GET SALDOS] Acesso negado detectado.");
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

async function clicarPorRole(
  page: Page,
  component: Parameters<Page["getByRole"]>[0],
  name: string,
  exact = true
) {
  const elemento = page.getByRole(component, {
    name,
    exact,
  }).first();

  await elemento.waitFor({
    state: "visible",
    timeout: 10000,
  });

  await elemento.click();
}

async function clicarPorLocator(
  page: Page,
  locator: string,
  timeout = 10000
) {
  const elemento = page.locator(locator).first();

  await elemento.waitFor({
    state: "visible",
    timeout,
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

async function carregarTodosAtms(page: Page) {
  await page.waitForSelector(ATM_SELECTOR, {
    timeout: 15000,
  });

  let totalAnterior = -1;
  let totalAtual = await page.locator(ATM_SELECTOR).count();
  let tentativasSemMudanca = 0;

  while (tentativasSemMudanca < 3) {
    totalAnterior = totalAtual;

    const ultimo = page.locator(ATM_SELECTOR).nth(totalAtual - 1);

    await ultimo.scrollIntoViewIfNeeded().catch(() => null);

    await page.mouse.wheel(0, 4000);

    await page.waitForTimeout(1000);

    totalAtual = await page.locator(ATM_SELECTOR).count();

    console.log("[GET SALDOS] Total carregado até agora:", totalAtual);

    if (totalAtual === totalAnterior) {
      tentativasSemMudanca++;
    } else {
      tentativasSemMudanca = 0;
    }
  }

  return totalAtual;
}

async function pegarTextoPorId(
  container: Page | Locator,
  id: string,
  timeout = 10000
) {
  const elemento = container.locator(`[id="${id}"]`).first();

  await elemento.waitFor({
    state: "visible",
    timeout,
  });

  const texto = await elemento.innerText();

  return texto.replace(/\s+/g, " ").trim();
}

async function pegarTextoPorIdSeguro(
  container: Page | Locator,
  id: string,
  fallback = "",
  timeout = 5000
) {
  try {
    return await pegarTextoPorId(container, id, timeout);
  } catch {
    console.log(`[GET SALDOS] Campo não encontrado: ${id}`);
    return fallback;
  }
}

export async function getSaldosAtms(page: Page): Promise<AtmSaldoData[]> {
  const data: AtmSaldoData[] = [];

  const user = process.env.BACKOFFICE_USER;
  const pass = process.env.BACKOFFICE_PASS;

  if (!user || !pass) {
    throw new Error(
      "BACKOFFICE_USER e BACKOFFICE_PASS precisam estar configurados no .env"
    );
  }

  await page.goto(LOGIN_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  page.setDefaultTimeout(60000);

  await clicarAcessoNegadoSeAparecer(page);

  await preencherCampoPorId(page, "formulario:txLoginInput", user);
  await preencherCampoPorId(page, "formulario:txSenhaInput", pass);

  await clicarPorRole(page, "button", "Entrar");

  await passarMouseNoMenu(page, "REDE DE ATM");

  await clicarPorRole(page, "link", "Monitor dos ATMs");

  await clicarPorLocator(
    page,
    '[id="formularioAtmMonitorConsultar:tpAtmInput_label"] + div.ui-selectonemenu-trigger > span.ui-icon'
  );

  await clicarPorRole(page, "listitem", "CAIXA_ELETRONICO");

  await clicarPorRole(page, "button", "Pesquisar");

  const total = await carregarTodosAtms(page);

  console.log(`[GET SALDOS] Total de ATMs encontrados: ${total}`);

  for (let i = 0; i < total; i++) {
    try {
      const elemento = page.locator(ATM_SELECTOR).nth(i);

      await elemento.scrollIntoViewIfNeeded();

      await page.waitForTimeout(300);

      console.log(`[GET SALDOS] Clicando no ATM ${i + 1}/${total}`);

      await elemento.click();

      const modal = page.locator(".ui-dialog:visible").last();

      await modal.waitFor({
        state: "visible",
        timeout: 10000,
      });

      const idAtm = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:idAtmText"
      );

      const nomeReduzido = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:txNomeReduzidoText"
      );

      const ativoAtm = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:fgAtivoText"
      );

      const saldoLogico = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:vlSaldoDisponivelText"
      );

      const saldoLogicoRejeicao = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:vlTotalRejeitadoText"
      );

      const totalLogico = await pegarTextoPorIdSeguro(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:vlTotalLogicoText",
        saldoLogico
      );

      const saldoConta = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:vlSaldoText"
      );

      const cassete_A_Cedula = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:0:panelTabelatpCedulaText"
      );

      const cassete_A_Qtd = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:0:panelTabelaqtCedulasText"
      );

      const cassete_A_Qtd_Rejeicao = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:0:panelTabelaqtCedulasRejeitadasText"
      );

      const cassete_A_Ativo = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:0:panelTabelafgAtivoText"
      );

      const cassete_A_Habilitado = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:0:panelTabelafgHabilitadoFisicoText"
      );

      const cassete_B_Cedula = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:1:panelTabelatpCedulaText"
      );

      const cassete_B_Qtd = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:1:panelTabelaqtCedulasText"
      );

      const cassete_B_Qtd_Rejeicao = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:1:panelTabelaqtCedulasRejeitadasText"
      );

      const cassete_B_Ativo = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:1:panelTabelafgAtivoText"
      );

      const cassete_B_Habilitado = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:1:panelTabelafgHabilitadoFisicoText"
      );

      const cassete_C_Cedula = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:2:panelTabelatpCedulaText"
      );

      const cassete_C_Qtd = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:2:panelTabelaqtCedulasText"
      );

      const cassete_C_Qtd_Rejeicao = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:2:panelTabelaqtCedulasRejeitadasText"
      );

      const cassete_C_Ativo = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:2:panelTabelafgAtivoText"
      );

      const cassete_C_Habilitado = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:2:panelTabelafgHabilitadoFisicoText"
      );

      const cassete_D_Cedula = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:3:panelTabelatpCedulaText"
      );

      const cassete_D_Qtd = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:3:panelTabelaqtCedulasText"
      );

      const cassete_D_Qtd_Rejeicao = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:3:panelTabelaqtCedulasRejeitadasText"
      );

      const cassete_D_Ativo = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:3:panelTabelafgAtivoText"
      );

      const cassete_D_Habilitado = await pegarTextoPorId(
        modal,
        "formularioAtmJanelaVisualizar:tabATM:tabela:3:panelTabelafgHabilitadoFisicoText"
      );

      data.push({
        id: idAtm,
        name: nomeReduzido,
        ativo: ativoAtm,
        saldoLogico,
        saldoRejeicao: saldoLogicoRejeicao,
        totalLogico,
        saldoConta,

        cassete_A: cassete_A_Qtd,
        cassete_A_rejeicao: cassete_A_Qtd_Rejeicao,
        cassete_A_cedula: cassete_A_Cedula,
        cassete_A_ativo: cassete_A_Ativo,
        cassete_A_habilitado: cassete_A_Habilitado,

        cassete_B: cassete_B_Qtd,
        cassete_B_rejeicao: cassete_B_Qtd_Rejeicao,
        cassete_B_cedula: cassete_B_Cedula,
        cassete_B_ativo: cassete_B_Ativo,
        cassete_B_habilitado: cassete_B_Habilitado,

        cassete_C: cassete_C_Qtd,
        cassete_C_rejeicao: cassete_C_Qtd_Rejeicao,
        cassete_C_cedula: cassete_C_Cedula,
        cassete_C_ativo: cassete_C_Ativo,
        cassete_C_habilitado: cassete_C_Habilitado,

        cassete_D: cassete_D_Qtd,
        cassete_D_rejeicao: cassete_D_Qtd_Rejeicao,
        cassete_D_cedula: cassete_D_Cedula,
        cassete_D_ativo: cassete_D_Ativo,
        cassete_D_habilitado: cassete_D_Habilitado,
      });

      console.log(`[GET SALDOS] ATM ${idAtm} - ${nomeReduzido}`);

      await modal.locator(".ui-dialog-titlebar-close").click().catch(() => null);
    } catch (error) {
      console.error(
        `[GET SALDOS] Erro ao processar ATM ${i + 1}/${total}:`,
        error
      );

      const modalAberto = page.locator(".ui-dialog:visible").last();

      if (await modalAberto.isVisible().catch(() => false)) {
        await modalAberto
          .locator(".ui-dialog-titlebar-close")
          .click()
          .catch(() => null);
      }

      await page.waitForTimeout(500);

      continue;
    }
  }

  console.log("[GET SALDOS] Coleta finalizada. Total coletado:", data.length);

  return data;
}

export async function runGetSaldosAtmsCron() {
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
    console.log("[GET SALDOS] Iniciando rotina automática.");

    const data = await getSaldosAtms(page);

    console.log("[GET SALDOS] Resultado final:");
    console.table(data);

    const resultSave = await salvarAtmMonitoring(data);

    console.log("[GET SALDOS] Resultado ao salvar no banco:");
    console.log(resultSave);

    return {
      success: true,
      totalColetado: data.length,
      save: resultSave,
    };
  } catch (error) {
    console.error("[GET SALDOS] Erro geral na rotina:", error);

    return {
      success: false,
      totalColetado: 0,
      error,
    };
  } finally {
    await browser.close().catch(() => null);
  }
}