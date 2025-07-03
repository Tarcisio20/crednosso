import { userSaveType } from '@/types/userSaveType'
import axios from 'axios'
import Cookies from "js-cookie"

export const getAllPagination = async (page: number, pageSize: number) => {
  const token = Cookies.get('tokenSystemCredNosso')
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user-pagination`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      params: {
        page: page,
        pageSize: pageSize
      }
    })
    return response
  } catch (error: any) {
    if (error.response) {
      // Erro retornado pela API (ex: status 400, 500, etc.)
      const { message } = error.response.data; // Captura a mensagem de erro
      //console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      //console.error("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
      //console.error("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

export const getUserFromId = async (id: string) => {
  const token = Cookies.get('tokenSystemCredNosso')
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error: any) {
    if (error.response) {
      // Erro retornado pela API (ex: status 400, 500, etc.)
      const { message } = error.response.data; // Captura a mensagem de erro
      //console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
      //console.error("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
      //console.error("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

export const add = async (data: userSaveType) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/user/add`, data, {
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
      //console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
      //console.error("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
      //console.error("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}


export const update = async (id: number, data: userSaveType) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/user/update/${id}`, data, {
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
      //console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
      //console.error("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
      //console.error("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

export const changePassword = async (id: number, data : {   password: string }) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/user/change-password/${id}`, data, {
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
      //console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
      //console.error("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
      //console.error("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}
