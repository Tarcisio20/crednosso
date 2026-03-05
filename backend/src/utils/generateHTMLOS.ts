import type { SendEmailPayload, SendEmailAtmItem } from "services/email";

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

function renderAtmBlock(a: SendEmailAtmItem) {
  const anyCass = hasAnyCassete(a);
  const isRecolhimentoTotal = a.total_exchange === true && !anyCass;

  const tipoTexto = isRecolhimentoTotal
    ? "RECOLHIMENTO TOTAL"
    : a.total_exchange
      ? "TROCA TOTAL"
      : "ABASTECIMENTO COMPLEMENTAR";

  return `
    <div style="margin-top: 14px;">
      <!-- Linha ATM (SEM DATA) -->
      <div style="background: #FFFF00; display:inline-block; padding:6px 10px; font-family: Arial, sans-serif; font-weight: bold;">
        ${a.id_atm} - ${a.atm_name}
      </div>

      <!-- Linha OS com id_supply -->
      <div style="margin-top: 8px; background:#FFFF00; display:inline-block; padding:6px 10px; font-family: Arial, sans-serif; font-weight: bold;">
        OS ${a.os} - ${tipoTexto}
      </div>

      <!-- Linha Cartão Operador (sempre) -->
      <div style="margin-top: 8px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold;">
        CARTAO OPERADOR: ${a.operator_card ? a.operator_card : "-"}
      </div>

      <!-- Tabela só quando tiver valores -->
      ${anyCass ? `<div style="margin-top: 8px;">${renderCasseteTable(a)}</div>` : ""}
    </div>
  `;
}

export const generateHTMLOS = (payload: SendEmailPayload): string => {
  const dateBR = formatDateBR(payload.date_on_supply);

  // Texto inicial (não usa "Tesouraria {id}", usa o treasury_name se quiser mostrar)
  const hasTroca = (payload.atms ?? []).some((a) => a.total_exchange === true && hasAnyCassete(a));
  const hasRecolh = (payload.atms ?? []).some((a) => a.total_exchange === true && !hasAnyCassete(a));
  const hasCompl = (payload.atms ?? []).some((a) => a.total_exchange === false);

  const title =
    hasTroca && (hasRecolh || hasCompl)
      ? `Segue OS para serem atendidas em ${dateBR}.`
      : hasTroca
        ? `Segue OS de - TROCA TOTAL para serem atendidas em ${dateBR}.`
        : hasRecolh
          ? `Segue OS de - RECOLHIMENTO TOTAL para serem atendidas em ${dateBR}.`
          : `Segue OS de - ABASTECIMENTO COMPLEMENTAR para serem atendidas em ${dateBR}.`;

  // Bloco de passos (mantém sua regra: só mostra se existir troca total COM valores)
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
      return spacer + renderAtmBlock(a);
    })
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; color: #000;">
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