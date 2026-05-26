import axios from 'axios'
import Cookies from "js-cookie"

const normalizeDateOnly = (value?: string | null) => {
  if (!value) return "";

  const decoded = decodeURIComponent(String(value));

  if (/^\d{4}-\d{2}-\d{2}$/.test(decoded)) {
    return decoded;
  }

  if (decoded.includes("T")) {
    return decoded.split("T")[0];
  }

  const parsed = new Date(decoded);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return "";
};

export const getSuppliesOssOpenForDay = async (day: string) => {
  const token = Cookies.get("tokenSystemCredNosso");

  try {
    const dateOnly = normalizeDateOnly(day);

    if (!dateOnly) {
      return {
        error: "Data inválida para buscar OS.",
        status: 400,
        data: undefined,
      } as any;
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/open-os/full/day/${encodeURIComponent(
        dateOnly
      )}`,
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
      const { message, error: responseError } = error.response.data;

      return {
        error: message ?? responseError ?? "Erro ao buscar OS.",
        status: error.response.status ?? 400,
        data: undefined,
      } as any;
    } else if (error.request) {
      return {
        error: error.request,
        status: 500,
        data: undefined,
      } as any;
    } else {
      return {
        error: error.message,
        status: 300,
        data: undefined,
      } as any;
    }
  }
};
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

export const atenderOsForIds = async (data : { socketId: string; ids: number[];} ) => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/open-os/atender-os-for-ids`, data,
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

export const atenderOsForDate = async (data: { socketId: string; date: string; }) => {
  const token = Cookies.get("tokenSystemCredNosso");
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/open-os/atender-os-for-date`, data,
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