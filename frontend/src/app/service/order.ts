import { orderType } from '@/types/orderType'
import axios from 'axios'
import Cookies from "js-cookie"

type OrderResponse = {
  order: {
    data: any[], // ou o tipo exato do seu dado
    totalItems: number,
    totalPages: number
  }
};

export const getAll = async () => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
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

export const add = async (data: orderType) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/order/add`, data, {
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
       console.log("Erro na requisição:", message); // Exibe a mensagem de erro
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
        console.log("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
        console.log("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

type alterValueOrderType = {
  requested_value_A : number;
  requested_value_B : number;
  requested_value_C : number;
  requested_value_D : number;
}
export const alterValueOrder = async (id : number, data: alterValueOrderType) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/order/alter-order-requests/${id}`, data, {
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

export const searchOrdersForDate = async (data : { date_initial : string, date_final : string }) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/order/search-by-date`, data, {
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

export const searchOrdersForDatePagination = async (data : { date_initial : string, date_final : string} , page: number, pageSize: number) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post<OrderResponse>(`${process.env.NEXT_PUBLIC_API_URL}/order/search-by-date-pagination`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        params: {
          page: page,
          pageSize: pageSize
        }
      })

      return {
        data : response.data.order.data,
        meta: {
          totalItems :  response.data.order.totalItems,
          totalPages : response.data.order.totalPages
        }
      }
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

export const getOrderById = async (id : number) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/order/${id}`, {
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

export const getTreasuriesInOrder = async (date : string) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/order/treasury/${date}`, {
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

export const getAllOrdersForDate = async (date : string) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/order/get-for-date/${date}`, {
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

export const getOrderByIdForReport = async (data : number[]) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/order/order-for-report`, data, {
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

export const delOrderById = async (id : number) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/order/del/${id}`, {
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

export const ConfirmOrderById = async (ids : number[]) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/order/confirm-total`, ids, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

export const getInfosOrder = async (id : number) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/order/infos-order/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

type confirmPartialType = {
  confirmed_value_A : number;
  confirmed_value_B : number;
  confirmed_value_C : number;
  confirmed_value_D : number;
}
export const confirmPartialOrderById = async (id : number, data : confirmPartialType) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/order/confirm-partial/${id}`, data,  {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

export const alterDateInOrder = async (id : number, data : { date_order : string }) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/order/alter-date-order/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

export const genrerateRelaseById = async (data : number[],) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/order/generate-release`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

export const genreratePaymmentById = async (data : number[],) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/order/generate-payment`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

type UpdateOrderType = Partial<orderType>

export const alterOrderById = async (id :number, data : UpdateOrderType) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/order/edit-order-for-id/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

export const getAuxOrderById = async (id : number) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/order/generate-payment/aux/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

export const getMediasYears = async () => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/order/medias`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("response medias", response)
    return response
  } catch (error: any) {
    console.log("error medias", error)
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