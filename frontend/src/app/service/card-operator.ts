import { cardOperatorType } from "@/types/cardOperatorType";
import axios from "axios";
import Cookies from "js-cookie";

export const getAll = async () => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/card-operator`,
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
      // Erro retornado pela API (ex: status 400, 500, etc.)
      const { message } = error.response.data; // Captura a mensagem de erro
     // console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return {error : message, status : 400, data : undefined} as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
    //  console.error("Erro de conexão:", error.request);
      return {error : error.request, status : 500, data :undefined} as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
    //  console.error("Erro:", error.message);
      return {error : error.message, status : 300, data : undefined} as any;
    }
  }
};

export const getByIdTreasury = async (id: number) => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/card-operator/treasury/${id}`,
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
      // Erro retornado pela API (ex: status 400, 500, etc.)
      const { message } = error.response.data; // Captura a mensagem de erro
     // console.error("Erro na requisição:", message); // Exibe a mensagem de erro
      return {error : message, status : 400, data : undefined} as any;
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
    //  console.error("Erro de conexão:", error.request);
      return {error : error.request, status : 500, data :undefined} as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
    //  console.error("Erro:", error.message);
      return {error : error.message, status : 300, data : undefined} as any;
    }
  }
};

export const getCardOperatorById = async (id: string) => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/card-operator/${id}`,
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
};

export const add = async (data: cardOperatorType) => {
  try {
    const token = Cookies.get("tokenSystemCredNosso");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/card-operator/add`,
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
};

export const update = async (id: number, data: cardOperatorType) => {
  try {
    const token = Cookies.get("tokenSystemCredNosso");
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/card-operator/update/${id}`,
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
};

export const del = async (id: number) => {
  try {
    const token = Cookies.get("tokenSystemCredNosso");
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/card-operator/update/${id}`,

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
};

