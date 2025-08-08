import { typeOrderType } from '@/types/typeOrderType'
import axios from 'axios'
import Cookies from "js-cookie"

type TypeOrderPaginationResponse = {
  typeOrder: {
    data: typeOrderType[];
    totalItems: number;
    totalPages: number;
  };
};

export const getAll = async () => {
  const token = Cookies.get('tokenSystemCredNosso')
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/type-order`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

export const getAllPagination = async (page: number, pageSize: number) => {
  const token = Cookies.get('tokenSystemCredNosso')
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/type-order-pagination`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      params: {
        page: page,
        pageSize: pageSize
      }
    });

    const responseData = response.data as TypeOrderPaginationResponse;

    return {
      data: responseData.typeOrder.data,
      meta: {
        totalItems: responseData.typeOrder.totalItems,
        totalPages: responseData.typeOrder.totalPages
      }
    }
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

export const getTypeOrderForId = async (id: string) => {
  const token = Cookies.get('tokenSystemCredNosso')
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/type-order/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

export const add = async (data: typeOrderType) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/type-order/add`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    })
    return response
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

export const update = async (id: number, data: typeOrderType) => {
  try {
    const token = Cookies.get('tokenSystemCredNosso')
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/type-order/update/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    })
    return response
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}
