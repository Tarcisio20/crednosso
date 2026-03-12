import axios from 'axios'
import Cookies from "js-cookie"


export const getSuppliesOssOpenForDayPagination = async (
  day: string,
  page: number = 1,
  limit: number = 15
) => {
  const token = Cookies.get("tokenSystemCredNosso");

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/open-os/day/${day}`,
      {
        params: {
          page,
          limit,
        },
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
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
};

export const getOSById = async (id: string) => {
  const token = Cookies.get("tokenSystemCredNosso");

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/open-os/get-os-id/${id}`,
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
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}

export type OpenOSEditPayload = {
  id_os?: number;
  id_supply: number;
  id_order: number;
  id_atm: number;
  id_treasury: number;
  os?: string;
  cassete_A: number;
  cassete_B: number;
  cassete_C: number;
  cassete_D: number;
};

export const AlterSupply = async (data: OpenOSEditPayload) => {
  const token = Cookies.get("tokenSystemCredNosso");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/open-os/alter-os`, data,
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
      return { error: message, status: 400, data: undefined } as any;
    } else if (error.request) {
      return { error: error.request, status: 500, data: undefined } as any;
    } else {
      return { error: error.message, status: 300, data: undefined } as any;
    }
  }
}