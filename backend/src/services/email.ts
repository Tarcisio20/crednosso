import transporter from "../utils/emailConfig";
import { generateEmailTableHTML } from "../utils/generateHtml";
import { returnDateInPtBr } from "../utils/returnDateInPtBr";

// Função para enviar e-mail automático
export const sendEmailOfOrder = async (emails: string, orders: any) => {
  const html = generateEmailTableHTML(orders)
  const dt = new Date(orders[0].date).toLocaleDateString("pt-BR", { timeZone: "UTC" })
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'tarcisio.silva@crednosso.com.br', //emails,
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
    return true
    //  console.log("E-mail de boas-vindas enviado!");
  } catch (error) {
    return error
    // console.error("Falha ao enviar e-mail:", error);
  }
}