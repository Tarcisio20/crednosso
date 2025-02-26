import axios from 'axios'
import { treasuryType } from "@/types/treasuryType";
import Cookies from "js-cookie"


export const getAll = async () => {
  const token  =  Cookies.get('tokenSystemCredNosso')
  try{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/treasury`, {
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

export const getByIdSystem = async (id : string) => {
  const token  =  Cookies.get('tokenSystemCredNosso')
  try{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/treasury/${id}`, {
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

export const add = async (data : treasuryType) => {
  try{
    const token  =  Cookies.get('tokenSystemCredNosso')
    const response = await  axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/treasury/add`, data, {
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


export const addSaldoTreasury = async (data : { id_system : number, bills_10 : number, bills_20 : number, bills_50 : number, bills_100 : number }) => {
  try{
    const token  =  Cookies.get('tokenSystemCredNosso')
    const response = await  axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/treasury/add_saldo`, data, {
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