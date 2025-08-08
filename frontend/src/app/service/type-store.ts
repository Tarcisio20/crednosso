import { typeStoreType } from "@/types/typeStoreType";
import axios from "axios";
import Cookies from "js-cookie";

// Tipagem da resposta padrão
export type GetAllTypeStoreResponse = {
  typeStore: typeStoreType[];
};

// Tipagem para resposta paginada
interface TypeStorePaginationResponse {
  typeStore: {
    data: typeStoreType[];
    totalItems: number;
    totalPages: number;
  };
}

// Tipagem para buscar por ID
export type GetTypeStoreForIdResponse = {
  typeStore: typeStoreType;
};

// Função auxiliar para tratar erros
const handleError = (error: any) => {
  if (error.response) {
    const { message } = error.response.data;
    return { error: message, status: error.response.status };
  } else if (error.request) {
    return { error: error.request, status: 500 };
  } else {
    return { error: error.message, status: 300 };
  }
};

// Buscar todos os tipos de loja
export const getAll = async (): Promise<GetAllTypeStoreResponse> => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.get<GetAllTypeStoreResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/type-store`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return { typeStore: [] }; // fallback seguro
  }
};

// Buscar com paginação
export const getAllTypeStorePagination = async (page: number, pageSize: number) => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/type-store-pagination`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { page, pageSize },
    });

    const typedResponse = response.data as TypeStorePaginationResponse;

    return {
      data: typedResponse.typeStore.data,
      meta: {
        totalItems: typedResponse.typeStore.totalItems,
        totalPages: typedResponse.typeStore.totalPages,
      },
    };
  } catch (error: any) {
    return handleError(error);
  }
};

// Buscar por ID
export const getTypeStoreForId = async (
  id: string
): Promise<{ data: GetTypeStoreForIdResponse; status: number } | { error: any; status: number }> => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.get<GetTypeStoreForIdResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/type-store/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return handleError(error);
  }
};

// Criar novo tipo de loja
export const add = async (data: typeStoreType) => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/type-store/add`,
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
    return handleError(error);
  }
};

// Atualizar tipo de loja
export const update = async (id: number, data: typeStoreType) => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/type-store/update/${id}`,
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
    return handleError(error);
  }
};

// Deletar tipo de loja
export const del = async (id: number) => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/type-store/delete/${id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    return handleError(error);
  }
};
