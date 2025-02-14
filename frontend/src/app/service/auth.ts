import axios , {  } from 'axios'
import { userType } from "@/types/userType";

export const register = async ( data : userType ) => {

    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, data, { headers: { "Content-Type": "application/json" }}  )
    .then((response) => {
        return response.data
    })
    .catch((error) => {
        if (error.response) {
            // Erro retornado pela API (ex: status 400, 500, etc.)
            const { message } = error.response.data; // Captura a mensagem de erro
            console.error("Erro na requisição:", message); // Exibe a mensagem de erro
            return message
          } else if (error.request) {
            // Erro de conexão (não houve resposta do servidor)
            console.error("Erro de conexão:", error.request);
            return error.request
          } else {
            // Erro genérico (ex: erro ao configurar a requisição)
            console.error("Erro:", error.message);
            return error.message
          }
    })
    
}