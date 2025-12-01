export const generateTableOS = (data: any[]): string => {
  if (!data || data.length === 0) return "";

  const main = data[0];

  // ----- tipo de OS -----
  const isExchange = main.exchange === true;
  const tipoOsTexto = isExchange ? "TROCA TOTAL" : "ABASTECIMENTO COMPLEMENTAR";

  // ----- data (somente parte de data, sem fuso) -----
  const dateSrc = main.date_on_supply ?? main.date;
  let formattedDate = "";

  if (dateSrc) {
    const d = new Date(dateSrc);
    const iso = d.toISOString().slice(0, 10); // "2025-12-02"
    const [year, month, day] = iso.split("-");
    formattedDate = `${day}/${month}/${year}`; // "02/12/2025"
  }

  // ----- cartão (nome + 4 últimos dígitos) -----
  const operatorName: string | undefined = main.operatorName;
  const rawCard: string | undefined = main.operatorCardNumber;

  let last4 = "";
  if (rawCard) {
    const digits = String(rawCard).replace(/\D/g, "");
    if (digits.length >= 4) {
      last4 = digits.slice(-4);
    }
  }

  const cardTitle = last4 ? `CARTAO AVULSO ${last4}` : operatorName ?? "";

  // ========================
  //  TABELAS POR ATM
  // ========================
  const groupedByAtm: Record<string, any[]> = {};

  data.forEach((item) => {
    const key = String(item.id_atm ?? "SEM_ATM");
    if (!groupedByAtm[key]) groupedByAtm[key] = [];
    groupedByAtm[key].push(item);
  });

  const cassetteConfig = [
    { key: "cassete_A", cedul: 10 },
    { key: "cassete_B", cedul: 20 },
    { key: "cassete_C", cedul: 50 },
    { key: "cassete_D", cedul: 100 },
  ] as const;

  let tablesHtml = "";

  for (const atmId of Object.keys(groupedByAtm)) {
    const atmRows = groupedByAtm[atmId];
    const first = atmRows[0] ?? {};

    const atmName =
      first.atmName ??
      first.name_atm ??
      first.atm_name ??
      first.description_atm ??
      `ATM ${atmId}`;

    const osNumber = first.id_order ?? first.os_number ?? "";

    const cassetteTotals: Record<string, number> = {
      cassete_A: 0,
      cassete_B: 0,
      cassete_C: 0,
      cassete_D: 0,
    };

    atmRows.forEach((row) => {
      cassetteTotals.cassete_A += Number(row.cassete_A ?? 0);
      cassetteTotals.cassete_B += Number(row.cassete_B ?? 0);
      cassetteTotals.cassete_C += Number(row.cassete_C ?? 0);
      cassetteTotals.cassete_D += Number(row.cassete_D ?? 0);
    });

    // 👇 ENVOLVI A TABELA EM UM <div> COM margin-bottom MAIOR
    tablesHtml += `
      <div
        style="
          width: 420px;
          max-width: 100%;
          margin: 0 auto 18px auto;
        "
      >
        <table
          style="
            border-collapse: collapse;
            width: 100%;
            font-family: Arial, sans-serif;
            font-size: 11px;
          "
        >
          <!-- Cabeçalho: ATM + nome + data -->
          <tr>
            <td
              colspan="3"
              style="
                border: 1px solid #000;
                background-color: #fff000;
                font-weight: bold;
                text-align: center;
                padding: 3px;
              "
            >
              ${atmId} - ${atmName}${
      formattedDate ? " - " + formattedDate : ""
    }
            </td>
          </tr>

          <!-- Linha OS -->
          <tr>
            <td
              colspan="3"
              style="
                border: 1px solid #000;
                background-color: #fff000;
                font-weight: bold;
                text-align: center;
                padding: 3px;
              "
            >
              OS - ${osNumber} - ${tipoOsTexto}
            </td>
          </tr>

          <!-- Cabeçalho das colunas -->
          <tr>
            <th
              style="
                border: 1px solid #000;
                background-color: #fff000;
                font-weight: bold;
                padding: 3px;
                text-align: center;
                width: 70px;
              "
            >
              CEDUL
            </th>
            <th
              style="
                border: 1px solid #000;
                background-color: #fff000;
                font-weight: bold;
                padding: 3px;
                text-align: center;
                width: 70px;
              "
            >
              QTD
            </th>
            <th
              style="
                border: 1px solid #000;
                background-color: #fff000;
                font-weight: bold;
                padding: 3px;
                text-align: center;
              "
            >
              valor
            </th>
          </tr>
    `;

    let totalGeral = 0;

    cassetteConfig.forEach((cfg) => {
      const qtd = cassetteTotals[cfg.key] ?? 0;
      const valor = qtd * cfg.cedul;
      totalGeral += valor;

      const valorFmt = valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      tablesHtml += `
          <tr>
            <td
              style="
                border: 1px solid #000;
                padding: 3px;
                text-align: center;
              "
            >
              ${cfg.cedul}
            </td>
            <td
              style="
                border: 1px solid #000;
                padding: 3px;
                text-align: center;
              "
            >
              ${qtd}
            </td>
            <td
              style="
                border: 1px solid #000;
                padding: 3px;
                text-align: right;
              "
            >
              R$ ${valorFmt}
            </td>
          </tr>
      `;
    });

    const totalFmt = totalGeral.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    tablesHtml += `
          <tr>
            <td
              style="
                border: 1px solid #000;
                padding: 3px;
                font-weight: bold;
              "
            >
              TOTAL
            </td>
            <td
              style="
                border: 1px solid #000;
                padding: 3px;
              "
            ></td>
            <td
              style="
                border: 1px solid #000;
                padding: 3px;
                font-weight: bold;
                text-align: right;
              "
            >
              R$ ${totalFmt}
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  // ===== bloco de instruções (apenas TROCA TOTAL) =====
  const instructionsHtml = isExchange
    ? `
      <div style="margin: 6px auto 8px auto; width: 420px; max-width: 100%;">
        <p style="background-color:#fff000; font-weight:bold; padding:3px 6px; margin:0;">
          ATENÇÃO: O PROCEDIMENTO DE TROCA TOTAL É FEITO SEGUINDO OS SEGUINTES PASSOS:
        </p>
        <p style="background-color:#fff000; font-weight:bold; padding:3px 6px; margin:0;">
          1º - RECOLHER TODO NUMERÁRIO DOS CASSETES INCLUSIVE A REJEIÇÃO
        </p>
        <p style="background-color:#fff000; font-weight:bold; padding:3px 6px; margin:0;">
          2º - ABASTECER COM O VALOR SOLICITADO
        </p>
        <p style="background-color:#fff000; font-weight:bold; padding:3px 6px; margin:0;">
          3º - LEVAR O VALOR RECOLHIDO PARA TESOURARIA E CONFERIR
        </p>
        <p style="background-color:#fff000; font-weight:bold; padding:3px 6px; margin:0 0 4px 0;">
          4º - INFORMAR A COMPOSIÇÃO E VALOR APURADO VIA EMAIL.
        </p>
        <p style="background-color:#fff000; font-weight:bold; padding:3px 6px; margin:0 0 4px 0;">
          QUALQUER DÚVIDA ENTRAR EM CONTATO VIA WHATSAPP PARA QUE O PROCESSO NÃO SEJA REALIZADO DE FORMA ERRADA
        </p>
      </div>
    `
    : "";

  // linha do cartão
  const cardLineHtml = cardTitle
    ? `
      <p
        style="
          margin: 6px auto 4px auto;
          width: 420px;
          max-width: 100%;
          font-weight: bold;
        "
      >
        ${cardTitle}
      </p>
    `
    : "";

  // ===== HTML final do e-mail =====
  const html = `
    <div
      style="
        font-family: Arial, sans-serif;
        font-size: 11px;
        color:#000;
        line-height: 1.3;
      "
    >
      <div style="width: 420px; max-width: 100%; margin: 0 auto;">
        <p style="margin: 0 0 4px 0;">Prezados,</p>

        <p style="margin: 0 0 6px 0;">
          Segue OS de - <strong>${tipoOsTexto}</strong> para serem atendidas em
          <strong>${formattedDate}</strong>.
        </p>

        ${instructionsHtml}

        ${cardLineHtml}

        ${tablesHtml}

        <p style="margin-top: 8px;">Atenciosamente,</p>
        <p style="margin: 2px 0 0 0;">CredNosso</p>
      </div>
    </div>
  `;

  return html;
};