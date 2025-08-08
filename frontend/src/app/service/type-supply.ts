import { typeSupplyType } from "@/types/typeSupplyType";
import axios from "axios";
import Cookies from "js-cookie";

interface TypeSupplyPaginationResponse {
  typeSupply: {
    data: typeSupplyType[];
    totalItems: number;
    totalPages: number;
  };
}

export const getAll = async () => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/type-supply`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      console.error("Erro na requisição:", message);
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      console.error("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      console.error("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
};

export const getAllPagination = async (page: number, pageSize: number) => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/type-supply-pagination`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          pageSize: pageSize,
        },
      }
    );

    const typedResponse = response.data as TypeSupplyPaginationResponse;

    return {
      data: typedResponse.typeSupply.data,
      meta: {
        totalItems: typedResponse.typeSupply.totalItems,
        totalPages: typedResponse.typeSupply.totalPages,
      },
    };
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      console.error("Erro na requisição:", message);
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      console.error("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      console.error("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
};

export const getTypeSupplyForId = async (id: string) => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/type-supply/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      console.error("Erro na requisição:", message);
      return message;
    } else if (error.request) {
      console.error("Erro de conexão:", error.request);
      return error.request;
    } else {
      console.error("Erro:", error.message);
      return error.message;
    }
  }
};

export const add = async (data: typeSupplyType) => {
  try {
    const token = Cookies.get("tokenSystemCredNosso");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/type-supply/add`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      console.error("Erro na requisição:", message);
      return message;
    } else if (error.request) {
      console.error("Erro de conexão:", error.request);
      return error.request;
    } else {
      console.error("Erro:", error.message);
      return error.message;
    }
  }
};

export const update = async (id: number, data: typeSupplyType) => {
  try {
    const token = Cookies.get("tokenSystemCredNosso");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/type-supply/update/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      const { message } = error.response.data;
      console.error("Erro na requisição:", message);
      return message;
    } else if (error.request) {
      console.error("Erro de conexão:", error.request);
      return error.request;
    } else {
      console.error("Erro:", error.message);
      return error.message;
    }
  }
};
