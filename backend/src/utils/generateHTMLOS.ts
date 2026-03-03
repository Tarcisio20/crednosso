export type SendEmailAtmItem = {
  id_supply: number; // ✅ por ATM

  total_exchange: boolean;

  cassete_a: number;
  cassete_b: number;
  cassete_c: number;
  cassete_d: number;

  id_atm: number;
  atm_name: string;

  os?: string;
  situacao?: string;
  valor?: string;
  operator_card?: string | null;
};

export type SendEmailPayload = {
  email: string[];
  date_on_supply: string;

  id_treasury: number;
  treasury_name: string;

  atms: SendEmailAtmItem[];
};

function formatDateBR(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function toMoneyBR(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function hasAnyCassete(a: SendEmailAtmItem) {
  return (
    Number(a.cassete_a || 0) > 0 ||
    Number(a.cassete_b || 0) > 0 ||
    Number(a.cassete_c || 0) > 0 ||
    Number(a.cassete_d || 0) > 0
  );
}

function renderCasseteTable(a: SendEmailAtmItem) {
  const rows = [
    { label: "A", ced: "10", qtd: Number(a.cassete_a || 0), val: Number(a.cassete_a || 0) * 10 },
    { label: "B", ced: "20", qtd: Number(a.cassete_b || 0), val: Number(a.cassete_b || 0) * 20 },
    { label: "C", ced: "50", qtd: Number(a.cassete_c || 0), val: Number(a.cassete_c || 0) * 50 },
    { label: "D", ced: "100", qtd: Number(a.cassete_d || 0), val: Number(a.cassete_d || 0) * 100 },
  ];

  const total = rows.reduce((acc, r) => acc + r.val, 0);

  return `
    <table style="border-collapse:collapse; width: 420px; font-family: Arial, sans-serif; font-size: 12px;">
      <tr>
        <th style="border:1px solid #000; padding:6px; text-align:center;"> </th>
        <th style="border:1px solid #000; padding:6px; text-align:center;">CEDUL</th>
        <th style="border:1px solid #000; padding:6px; text-align:center;">QTD</th>
        <th style="border:1px solid #000; padding:6px; text-align:center;">valor</th>
      </tr>
      ${rows
        .map(
          (r) => `
          <tr>
            <td style="border:1px solid #000; padding:6px; text-align:center;">${r.label}</td>
            <td style="border:1px solid #000; padding:6px; text-align:center;">${r.ced}</td>
            <td style="border:1px solid #000; padding:6px; text-align:center;">${r.qtd}</td>
            <td style="border:1px solid #000; padding:6px; text-align:right;">${toMoneyBR(r.val)}</td>
          </tr>
        `
        )
        .join("")}
      <tr>
        <td style="border:1px solid #000; padding:6px; font-weight:bold; text-align:center;" colspan="3">TOTAL</td>
        <td style="border:1px solid #000; padding:6px; font-weight:bold; text-align:right;">${toMoneyBR(total)}</td>
      </tr>
    </table>
  `;
}

function renderAtmBlock(a: SendEmailAtmItem, dateBR: string) {
  const anyCass = hasAnyCassete(a);

  // Caso 2: total_exchange true e tudo zero => RECOLHIMENTO TOTAL (imagem 2)
  if (a.total_exchange === true && !anyCass) {
    return `
      <div style="margin-top: 14px;">
        <div style="font-family: Arial, sans-serif; font-size: 14px;">
          <b>OS:</b><br/>
          ${a.os ? `${a.os} - ${a.id_atm} - ${a.atm_name}` : `${a.id_atm} - ${a.atm_name}`}
        </div>

        ${
          a.operator_card
            ? `<div style="margin-top: 12px; font-family: Arial, sans-serif; font-size: 14px;"><b>OPERADOR:</b> ${a.operator_card}</div>`
            : ""
        }
      </div>
    `;
  }

  // Caso 1: troca total com valores (imagem 1)
  if (a.total_exchange === true && anyCass) {
    return `
      <div style="margin-top: 14px;">
        <div style="background: #FFFF00; display:inline-block; padding:6px 10px; font-family: Arial, sans-serif; font-weight: bold;">
          ${a.id_atm} - ${a.atm_name} - ${dateBR}
        </div>

        <div style="margin-top: 8px; background:#FFFF00; display:inline-block; padding:6px 10px; font-family: Arial, sans-serif; font-weight: bold;">
          OS - ${a.os ?? "-"} - TROCA TOTAL
        </div>

        <div style="margin-top: 8px;">
          ${renderCasseteTable(a)}
        </div>

        ${
          a.operator_card
            ? `<div style="margin-top: 10px; background:#FFFF00; display:inline-block; padding:6px 10px; font-family: Arial, sans-serif; font-weight: bold;">
                ${a.operator_card}
              </div>`
            : ""
        }
      </div>
    `;
  }

  // Caso 3: abastecimento complementar (imagem 3)
  return `
    <div style="margin-top: 14px;">
      ${
        a.operator_card
          ? `<div style="background:#FFFF00; display:inline-block; padding:6px 10px; font-family: Arial, sans-serif; font-weight: bold;">
              ${a.operator_card}
            </div>`
          : ""
      }

      <div style="margin-top: 10px; background: #FFFF00; display:inline-block; padding:6px 10px; font-family: Arial, sans-serif; font-weight: bold;">
        ${a.id_atm} - ${a.atm_name} - ${dateBR}
      </div>

      <div style="margin-top: 8px; background:#FFFF00; display:inline-block; padding:6px 10px; font-family: Arial, sans-serif; font-weight: bold;">
        OS - ${a.os ?? "-"} - ABASTECIMENTO COMPLEMENTAR
      </div>

      <div style="margin-top: 8px;">
        ${renderCasseteTable(a)}
      </div>
    </div>
  `;
}

export const generateHTMLOS = (payload: SendEmailPayload): string => {
  const dateBR = formatDateBR(payload.date_on_supply);

  const treasuryName = String(payload.treasury_name ?? "TESOURARIA").trim() || "TESOURARIA";

  const isTrocaTotal = (payload.atms ?? []).some((a) => a.total_exchange === true);

  const title = isTrocaTotal
    ? `Segue OS de - TROCA TOTAL para serem atendidas em ${dateBR}.`
    : `Segue OS de - ABASTECIMENTO COMPLEMENTAR para serem atendidas em ${dateBR}.`;

  // bloco de passos (imagem 1) — só mostra se existir pelo menos 1 troca total com valores
  const showSteps = (payload.atms ?? []).some((a) => a.total_exchange === true && hasAnyCassete(a));

  const stepsHTML = showSteps
    ? `
      <div style="margin-top: 14px; font-family: Arial, sans-serif; font-size: 13px;">
        <div style="background:#FFFF00; display:inline-block; padding:6px 10px; font-weight:bold;">
          ATENÇÃO: O PROCEDIMENTO DE TROCA TOTAL É FEITO SEGUINDO OS SEGUINTE PASSOS:
        </div>
        <div style="margin-top: 10px; background:#FFFF00; display:inline-block; padding:6px 10px; font-weight:bold;">
          1º - RECOLHER TODO NUMERÁRIO DOS CASSETES INCLUSIVE A REJEIÇÃO
        </div><br/>
        <div style="margin-top: 10px; background:#FFFF00; display:inline-block; padding:6px 10px; font-weight:bold;">
          2º - ABASTECER COM O VALOR SOLICITADO
        </div><br/>
        <div style="margin-top: 10px; background:#FFFF00; display:inline-block; padding:6px 10px; font-weight:bold;">
          3º - LEVAR O VALOR RECOLHIDO PARA TESOURARIA E CONFERIR
        </div><br/>
        <div style="margin-top: 10px; background:#FFFF00; display:inline-block; padding:6px 10px; font-weight:bold;">
          4º - INFORMAR A COMPOSIÇÃO E VALOR APURADO VIA EMAIL!
        </div><br/>
        <div style="margin-top: 10px; background:#FFFF00; display:inline-block; padding:6px 10px; font-weight:bold;">
          QUALQUER DÚVIDA ENTRAR EM CONTATO VIA WHATSAPP PARA QUE O PROCESSO NÃO SEJA REALIZADO DE FORMA ERRADA
        </div>
      </div>
    `
    : "";

  const atmsHTML = (payload.atms ?? [])
    .map((a, idx) => {
      const spacer = idx === 0 ? "" : `<div style="height: 28px;"></div>`;
      return spacer + renderAtmBlock(a, dateBR);
    })
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #000;">
      <div style="font-size: 15px; font-weight: bold;">
        ${treasuryName} - ${dateBR}
      </div>

      <div style="margin-top: 18px; font-size: 14px;">
        Prezados,<br/><br/>
        ${title}
      </div>

      ${stepsHTML}

      <div style="margin-top: 18px;">
        ${atmsHTML}
      </div>

      <div style="margin-top: 26px; font-size: 14px;">
        Atenciosamente,
      </div>
    </div>
  `;
};