import { atmType } from '@/types/atmType'
import axios from 'axios'
import Cookies from "js-cookie"


export const getAll = async () => {
  const token  =  Cookies.get('tokenSystemCredNosso')
  try{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/atm`, {
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch(error : any){  
    if (error.response) {
        // Erro retornado pela API (ex: status 400, 500, etc.)
        const { message } = error.response.data; // Captura a mensagem de erro
        console.error("Erro na requisição:", message); // Exibe a mensagem de erro
        return message;
      } else if (error.request) {
        // Erro de conexão (não houve resposta do servidor)
        console.error("Erro de conexão:", error.request);
        return error.request;
      } else {
        // Erro genérico (ex: erro ao configurar a requisição)
        console.error("Erro:", error.message);
        return error.message;
      }
  }
}

export const add = async (data : atmType) => {
    try{
      const token  =  Cookies.get('tokenSystemCredNosso')
      const response = await  axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/atm/add`, data, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      },
      })
      return response
    }catch(error : any){
      if (error.response) {
        // Erro retornado pela API (ex: status 400, 500, etc.)
        const { message } = error.response.data; // Captura a mensagem de erro
        console.error("Erro na requisição:", message); // Exibe a mensagem de erro
        return message;
      } else if (error.request) {
        // Erro de conexão (não houve resposta do servidor)
        console.error("Erro de conexão:", error.request);
        return error.request;
      } else {
        // Erro genérico (ex: erro ao configurar a requisição)
        console.error("Erro:", error.message);
        return error.message;
      }
    }
  }