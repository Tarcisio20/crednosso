import { generateTableOS } from "utils/generateTableOS";
import transporter from "../utils/emailConfig";
import { generateEmailTableHTML } from "../utils/generateHtml";
import { generateHTMLOS } from "utils/generateHTMLOS";
import { alterRequestsOrderForID } from "./order";
import { OrderLevel } from "@prisma/client";

export const sendEmailOfOrder = async (emails: string, orders: any[]) => {
  if (!orders || orders.length === 0) {
    return { ok: false, error: "Sem pedidos para enviar." };
  }

  const html = generateEmailTableHTML(orders);

  const ccFixed = [
    "tarcisio.silva@crednosso.com.br",
    "dillan.sousa@crednosso.com.br",
    "luis.lopes@crednosso.com.br",
    "joao.rocha@crednosso.com.br",
    "kalebe.marques@crednosso.com.br",
  ];

  const toList = [
    ...new Set(
      emails
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean)
    ),
  ];

  const ccList = [...new Set(ccFixed)];

  if (toList.length === 0) {
    return { ok: false, error: "Sem e-mails de destino." };
  }

  const dateBR = new Date(orders[0].date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toList.join(","),
      cc: ccList.join(","),
      subject: `Solicitação de numerario para abastecimento dos terminais Crednosso - ${dateBR}`,
      html: `
        Prezados, <br><br><br>
        Segue valores solicitados para abastecimentos dos terminais Crednosso.
        <br><br><br>
        Os valores devem ser provisionados até a data ${dateBR}.
        <br><br><br>
        Acusar recebimento deste Email.
        <br><br>
        ${html}
        <br><br><br>
        Atenciosamente,
      `,
    });

    return { ok: true };
  } catch (err) {
    console.log(
      "SERVICE => [EMAIL] *** FUNCTION => [SEND_EMAIL_OF_ORDER] *** ERROR =>",
      err
    );
    return { ok: false, error: err };
  }
};

export async function sendOsEmail(params: {
  date: string;
  treasuryId: number | string;
  treasuryName?: string;
  to: string;
  records: any[];
}) {
  const { date, treasuryId, treasuryName, to, records } = params;

  const main = records[0] ?? {};
  const isExchange = main.exchange === true;

  const tipoOs = isExchange
    ? "CREDNOSSO - TROCA TOTAL"
    : "CREDNOSSO - ABASTECIMENTO COMPLEMENTAR";

  const dateSrc = main.date_on_supply ?? main.date ?? date;
  let subjectDate = "";

  if (dateSrc) {
    const d = new Date(dateSrc);
    const iso = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const [year, month, day] = iso.split("-");
    subjectDate = `${day}/${month}/${year}`;
  }

  const treasuryLabel = treasuryName ? ` - ${treasuryName}` : "";
  const dateLabel = subjectDate ? ` - ${subjectDate}` : "";
  const subject = `${tipoOs}${treasuryLabel}${dateLabel}`;

  const html = generateTableOS(records);

  console.log("=== ENVIANDO E-MAIL OS ===");
  console.log("Tesouraria...:", treasuryId, "-", treasuryName);
  console.log("Para.........:", to);
  console.log("Assunto......:", subject);
  console.log(
    "isExchange...:",
    isExchange,
    "exchange field:",
    main.exchange,
    "total_exchange:",
    main.total_exchange
  );
  console.log("Registros....:", records.length);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.log(
      "SERVICE => [EMAIL] *** FUNCTION => [SEND_EMAIL_OF_ORDER] *** ERROR =>",
      err
    );
    return err;
  }
}

export const sendEmailOdCreateUser = async (name: string, email: string, password: string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Senha do sistema CredNosso Generate`,
      html: `
      Olá ${name}, <br><br><br>

      Segue senha sua senha de acesso ao sistema Crednosso Generate.
      <br><br><br>
     A sua senha é  ### ${password} ###.
      <br><br><br>
      Acusar recebimento deste Email.
      <br><br> 
      <br><br><br>
      Atenciosamente,
      `,
    });

    return true
  } catch (err) {
    console.log("SERVICE => [EMAIL] *** FUNCTION => [SEND_EMAIL_OF_ORDER] *** ERROR =>", err)
    return err
  }
}

export type SendEmailAtmItem = {
  os_open_id?: number;
  id_supply: number;
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


function hasAnyCassete(a: SendEmailAtmItem) {
  return (
    Number(a.cassete_a || 0) > 0 ||
    Number(a.cassete_b || 0) > 0 ||
    Number(a.cassete_c || 0) > 0 ||
    Number(a.cassete_d || 0) > 0
  );
}

export const sendEmailOnOS = async (payload: SendEmailPayload) => {
  if (!payload?.email?.length) return { ok: false, error: "Sem emails." };
  if (!payload?.atms?.length) return { ok: false, error: "Sem ATMs." };

  const dateBR = formatDateBR(payload.date_on_supply);

  const hasTroca = payload.atms.some((a) => a.total_exchange === true && hasAnyCassete(a));
  const hasRecolh = payload.atms.some((a) => a.total_exchange === true && !hasAnyCassete(a));

  const tipoOs = hasTroca
    ? "CREDNOSSO - TROCA TOTAL"
    : hasRecolh
      ? "CREDNOSSO - RECOLHIMENTO TOTAL"
      : "CREDNOSSO - ABASTECIMENTO COMPLEMENTAR";


  const subject = `${tipoOs} - ${payload.treasury_name} - ${dateBR}`;

  const html = generateHTMLOS(payload);

  const ccFixed =
    "tarcisio.silva@crednosso.com.br,dillan.sousa@crednosso.com.br,luis.lopes@crednosso.com.br,joao.rocha@crednosso.com.br,kalebe.marques@crednosso.com.br";

  try {
    const toList = payload.email.map((e) => e.trim()).filter(Boolean).join(",");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: `${toList},${ccFixed}`,
      subject,
      html,
    });

    return { ok: true };
  } catch (err: any) {
    console.log("SERVICE => [EMAIL] *** FUNCTION => [SEND_EMAIL_ON_OS] *** ERROR =>", err);
    return { ok: false, error: err?.message ?? String(err) };
  }
};

