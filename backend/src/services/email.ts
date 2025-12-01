import { generateTableOS } from "utils/generateTableOS";
import transporter from "../utils/emailConfig";
import { generateEmailTableHTML } from "../utils/generateHtml";

export const sendEmailOfOrder = async (emails: string, orders: any) => {
  const html = generateEmailTableHTML(orders)
  const dt = new Date(orders[0].date).toLocaleDateString("pt-BR", { timeZone: "UTC" })
  const emailList = emails.split(',').map(email => email.trim());

  try {
    for (const email of emailList) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email + ',tarcisio.silva@crednosso.com.br,dillan.sousa@crednosso.com.br,luis.lopes@crednosso.com.br,joao.rocha@crednosso.com.br,kalebe.marques@crednosso.com.br',
        subject: `Solicitação de numerario para abastecimento dos terminais Crednosso - ${new Date(orders[0].date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}`,
        html: `
      Prezados, <br><br><br>

      Segue valores solicitados para abastecimentos dos terminais Crednosso.
      <br><br><br>
      Os valore devem ser provisionados até a data ${new Date(orders[0].date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}.
      <br><br><br>
      Acusar recebimento deste Email.
      <br><br>
      ${html} 
      <br><br><br>
      Atenciosamente,
      `,
      });
    }
    return true
  } catch (err) {
    console.log("SERVICE => [EMAIL] *** FUNCTION => [SEND_EMAIL_OF_ORDER] *** ERROR =>", err)
    return err
  }
}

export async function sendOsEmail(params: {
  date: string;
  treasuryId: number | string;
  treasuryName?: string;
  to: string;
  records: any[];
}) {
  const { date, treasuryId, treasuryName, to, records } = params;

  const main = records[0] ?? {};

  // agora só olhamos para `exchange`, que foi setado no controller
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