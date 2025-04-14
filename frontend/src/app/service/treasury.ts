import axios from 'axios'
import { treasuryType } from "@/types/treasuryType";
import Cookies from "js-cookie"

type TreasuryResponse = {
  treasury: {
    data: any[], // ou o tipo específico que você espera
    totalItems: number,
    totalPages: number
  }
}

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
       // console.error("Erro na requisição:", message); // Exibe a mensagem de erro
        return {error :message, status : 400, data : undefined} as any;
      } else if (error.request) {
        // Erro de conexão (não houve resposta do servidor)
        //console.error("Erro de conexão:", error.request);
        return {error : error.request, status : 500, data : undefined}as any;
      } else {
        // Erro genérico (ex: erro ao configurar a requisição)
        //console.error("Erro:", error.message);
        return {error : error.message, status : 300, data : undefined} as any;
      }
  }
}

export const getTreasuriesForIds = async (data : number[]) => {
  try{
    const token  =  Cookies.get('tokenSystemCredNosso')
    const response = await  axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/treasury/ids`, data, {
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
     // console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return {error : message, status : 400, data : undefined} as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
      // console.error("Erro de conexão:", error.request);
      return {error : error.request, status : 500, data : undefined} as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
     // console.error("Erro:", error.message);
      return {error : error.message, status : 300, data : undefined} as any;
    }
  }
}


export const getAllTreasuryPagination = async (page: number, pageSize: number) => {
  const token  =  Cookies.get('tokenSystemCredNosso')
  try{
    const response = await axios.get<TreasuryResponse>(`${process.env.NEXT_PUBLIC_API_URL}/treasury-pagination`, {
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: page,
        pageSize: pageSize
      }
    })
    return {
      data : response.data.treasury.data,
      meta: {
        totalItems :  response.data.treasury.totalItems,
        totalPages : response.data.treasury.totalPages
      }
    };

  } catch(error : any){  
    if (error.response) {
        // Erro retornado pela API (ex: status 400, 500, etc.)
        const { message } = error.response.data; // Captura a mensagem de erro
       // console.error("Erro na requisição:", message); // Exibe a mensagem de erro
        return {error :message, status : 400, data : undefined} as any;
      } else if (error.request) {
        // Erro de conexão (não houve resposta do servidor)
        //console.error("Erro de conexão:", error.request);
        return {error : error.request, status : 500, data : undefined}as any;
      } else {
        // Erro genérico (ex: erro ao configurar a requisição)
        //console.error("Erro:", error.message);
        return {error : error.message, status : 300, data : undefined} as any;
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
       // console.error("Erro na requisição:", message); // Exibe a mensagem de erro
        return {error : message, status : 400, data :undefined} as any;
      } else if (error.request) {
        // Erro de conexão (não houve resposta do servidor)
        //console.error("Erro de conexão:", error.request);
        return {error : error.request, status : 500, data : undefined} as any;
      } else {
        // Erro genérico (ex: erro ao configurar a requisição)
        //console.error("Erro:", error.message);
        return {error : error.message, status : 300, data : undefined} as any;
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
      //console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return {error : message, status : 400, data : undefined} as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
     // console.error("Erro de conexão:", error.request);
      return {error : error.request, status : 500, data : undefined} as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
     // console.error("Erro:", error.message);
      return {error : error.message, status : 300, data : undefined} as any;
    }
  }
}

export const update = async (id : number , data : treasuryType) => {
  try{
    const token  =  Cookies.get('tokenSystemCredNosso')
    const response = await  axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/treasury/update/${id}`, data, {
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
     // console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return {error : message, status : 400, data : undefined} as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
      // console.error("Erro de conexão:", error.request);
      return {error : error.request, status : 500, data : undefined} as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
     // console.error("Erro:", error.message);
      return {error : error.message, status : 300, data : undefined} as any;
    }
  }
}

export const addSaldoTreasury = async (id : number, data : { bills_10 : number, bills_20 : number, bills_50 : number, bills_100 : number }) => {
  try{
    const token  =  Cookies.get('tokenSystemCredNosso')
    const response = await  axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/treasury/add_saldo/${id}`, data, {
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
     // console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return {error : message, status : 400, data : undefined} as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
     // console.error("Erro de conexão:", error.request);
      return {error : error.request, status : 500, data : undefined} as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
      //console.error("Erro:", error.message);
      return {error : error.message, status : 300, data : undefined} as any;
    }
  }
}

export const minusSaldoTreasury = async (id : number, data : { bills_10 : number, bills_20 : number, bills_50 : number, bills_100 : number }) => {
  try{
    const token  =  Cookies.get('tokenSystemCredNosso')
    const response = await  axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/treasury/minus_saldo/${id}`, data, {
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
     // console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return {error : message, status : 400, data : undefined} as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
     // console.error("Erro de conexão:", error.request);
      return {error : error.request, status : 500, data : undefined} as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
      //console.error("Erro:", error.message);
      return {error : error.message, status : 300, data : undefined} as any;
    }
  }
}