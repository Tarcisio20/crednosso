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
        to: email+',tarcisio.silva@crednosso.com.br,dillan.sousa@crednosso.com.br,luis.lopes@crednosso.com.br,joao.rocha@crednosso.com.br',
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
  } catch (error) {
    return error
  }
}