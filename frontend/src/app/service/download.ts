import axios from 'axios'
import Cookies from "js-cookie"

export const getAllPagination = async (page: number, pageSize: number) => {
  const token = Cookies.get('tokenSystemCredNosso')
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/download/${page}/${pageSize}`, {
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
      //console.error("Erro de conexão:", error.request);
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      // Erro genérico (ex: erro ao configurar a requisição)
      //console.error("Erro:", error.message);
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

export const downloadArchive = async (name : string) => {
   const token = Cookies.get("tokenSystemCredNosso");

  try {
    const response = await axios.get<Blob>(
      `${process.env.NEXT_PUBLIC_API_URL}/download/archive/${name}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // ❗ Importante para lidar com arquivos binários
      }
    );
    console.log("response", response)
    // Cria URL temporária
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Cria elemento de download
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();;

    // Libera URL temporária
    window.URL.revokeObjectURL(url);
    return response
  } catch (error) {
     return { error: "Erro ao baixar arquivo:"+error, status: 300, data: undefined } as any;
  }
}