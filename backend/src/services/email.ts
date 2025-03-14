import transporter from "../utils/emailConfig";

// Função para enviar e-mail automático
export const sendEmailOfOrder = async (emails : string) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'tarcisio101093@gmail.com;dillan.sousa@crednosso.com.br' , //emails,
      subject: "Bem-vindo!",
      html: `
        <h1>Olá!</h1>
        <p>Sua conta foi criada com sucesso.</p>
      `,
    });
    return true
   //  console.log("E-mail de boas-vindas enviado!");
  } catch (error) {
    return error
    // console.error("Falha ao enviar e-mail:", error);
  }
}