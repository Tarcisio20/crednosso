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