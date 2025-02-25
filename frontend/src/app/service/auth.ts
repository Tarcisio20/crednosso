import axios from "axios";
import { userType } from "@/types/userType";
import jwt from "jsonwebtoken"

// Definindo o tipo de resposta esperado
interface LoginResponse {
  success: boolean;
  token?: string; // 'token' é opcional pois pode não existir em um erro
  message: string;
  data?: any; // Dados adicionais que podem ser retornados
}

export const register = async (data: userType) => {
  await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/register`, data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
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
    });
};
export const login = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return {
      success: true,
      data: response.data,
      message: "Login bem-scedido",
    };
  } catch (error: any) {
    if (error.response) {
      // Erro retornado pela API (status 400, 500, etc.)
      const { message } = error.response.data;
      return {
        success: false,
        message: message, // Captura a mensagem de erro
      };
    } else if (error.request) {
      // Erro de conexão (não houve resposta do servidor)
      return {
        success: false,
        message: "Erro de conexão: sem resposta do servidor",
      };
    } else {
      // Erro genérico (erro ao configurar a requisição)
      return {
        success: false,
        message: error.message,
      };
    }
  }
};


