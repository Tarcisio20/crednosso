import { orderType } from '@/types/orderType'
import axios from 'axios'
import Cookies from "js-cookie"

export const getConfirmationByIdOrder = async (id: number) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/money-split/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      })
    return response
  } catch (error: any) {
    if (error.response) {
      // Erro retornado pela API (ex: status 400, 500, etc.)
      const { message } = error.response.data; // Captura a mensagem de erro
      //  console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
      //  console.error("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
      //  console.error("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

type addRattedsOrderType = {
    id_order: number;
    id_treasury_origin: number;
    id_treasury_rating: number;
    value: number;
}

export const addRattedsOrder = async (data: addRattedsOrderType[]) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/money-split/add-ratteds`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      })
    return response
  } catch (error: any) {
    if (error.response) {
      // Erro retornado pela API (ex: status 400, 500, etc.)
      const { message } = error.response.data; // Captura a mensagem de erro
      //  console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
      //  console.error("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
      //  console.error("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

export const getRattedOrderById = async (id : number) => {
   try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/money-split/get-ratted/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      })
    return response
  } catch (error: any) {
    if (error.response) {
      // Erro retornado pela API (ex: status 400, 500, etc.)
      const { message } = error.response.data; // Captura a mensagem de erro
      //  console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
      //  console.error("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
      //  console.error("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

export const getRattedOrderByIdAjusted = async (id : number) => {
   try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/money-split/get-ratted-ajusted/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      })
    return response
  } catch (error: any) {
    if (error.response) {
      // Erro retornado pela API (ex: status 400, 500, etc.)
      const { message } = error.response.data; // Captura a mensagem de erro
      //  console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
      //  console.error("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
      //  console.error("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}