"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  faEnvelope,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { Loading } from "@/app/components/ux/Loading";
import { ButtonScreenOrder } from "@/app/components/ui/ButtonScreenOrder";
import { socket } from "@/lib/socket";
import { getSuppliesOssOpenForDay } from "@/app/service/os";

type SupplyStatusItem = {
  id: number;
  id_supply: number;
  id_atm: string | number;
  atm_name: string;
  os: string;
  situacao: string;
  send_email: boolean;
  status: boolean;
  valor?: string;
  terminal?: string;
  date_os?: string;
};

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

const parseResponseItems = (response: any): SupplyStatusItem[] => {
  const data =
    response?.data?.openos?.data ??
    response?.data?.data ??
    response?.data?.openos ??
    response?.data?.status ??
    [];

  return Array.isArray(data) ? data : [];
};

export default function SupplyStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawDateFromUrl = searchParams.get("date");
  const dateFromUrl = useMemo(
    () => normalizeDateOnly(rawDateFromUrl),
    [rawDateFromUrl]
  );

  const jobId = searchParams.get("jobId");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SupplyStatusItem[]>([]);
  const [searchDate, setSearchDate] = useState(dateFromUrl);
  const [currentDate, setCurrentDate] = useState(dateFromUrl);
  const [lastEvent, setLastEvent] = useState("");

  useEffect(() => {
    setSearchDate(dateFromUrl);
    setCurrentDate(dateFromUrl);
  }, [dateFromUrl]);

  const fetchStatus = useCallback(
    async (dateToFetch?: string) => {
      const targetDate = normalizeDateOnly(dateToFetch || currentDate);

      if (!targetDate) {
        setItems([]);
        return;
      }

      setLoading(true);

      try {
        const response = await getSuppliesOssOpenForDay(targetDate);

        if (response?.status !== 200) {
          setItems([]);
          toast.error("Erro ao buscar status das OS.");
          return;
        }

        const parsedItems = parseResponseItems(response);
        setItems(parsedItems);
      } catch (error) {
        setItems([]);
        toast.error("Erro ao buscar status das OS.");
      } finally {
        setLoading(false);
      }
    },
    [currentDate]
  );

  useEffect(() => {
    if (!currentDate) return;

    fetchStatus(currentDate);
  }, [currentDate, fetchStatus]);

  useEffect(() => {
    if (!jobId || !currentDate) return;

    if (!socket.connected) {
      socket.connect();
    }

    const handleStarted = (payload: any) => {
      if (String(payload?.jobId) !== String(jobId)) return;

      setLastEvent("Processamento iniciado");
      fetchStatus(currentDate);
    };

    const handleProgress = (payload: any) => {
      if (String(payload?.jobId) !== String(jobId)) return;

      setLastEvent(payload?.message ?? payload?.step ?? "Processando...");
    };

    const handleItemSaved = (payload: any) => {
      if (String(payload?.jobId) !== String(jobId)) return;

      setLastEvent("OS salva. Atualizando status...");
      fetchStatus(currentDate);
    };

    const handleItemError = (payload: any) => {
      if (String(payload?.jobId) !== String(jobId)) return;

      setLastEvent(payload?.error ?? "Erro em uma OS.");
      fetchStatus(currentDate);
    };

    const handleDone = (payload: any) => {
      if (String(payload?.jobId) !== String(jobId)) return;

      setLastEvent("Processamento concluído");
      fetchStatus(currentDate);
    };

    const handleError = (payload: any) => {
      if (String(payload?.jobId) !== String(jobId)) return;

      setLastEvent(
        `Erro: ${
          payload?.details ?? payload?.error ?? "Falha no processamento"
        }`
      );

      fetchStatus(currentDate);
    };

    socket.on("openos:started", handleStarted);
    socket.on("openos:progress", handleProgress);
    socket.on("openos:item-saved", handleItemSaved);
    socket.on("openos:item-error", handleItemError);
    socket.on("openos:done", handleDone);
    socket.on("openos:error", handleError);

    return () => {
      socket.off("openos:started", handleStarted);
      socket.off("openos:progress", handleProgress);
      socket.off("openos:item-saved", handleItemSaved);
      socket.off("openos:item-error", handleItemError);
      socket.off("openos:done", handleDone);
      socket.off("openos:error", handleError);
    };
  }, [jobId, currentDate, fetchStatus]);

  const handleSearch = async () => {
    if (!searchDate) {
      toast.error("Selecione uma data para pesquisar.");
      return;
    }

    const dateOnly = normalizeDateOnly(searchDate);

    if (!dateOnly) {
      toast.error("Data inválida.");
      return;
    }

    setLastEvent("");
    setCurrentDate(dateOnly);

    const params = new URLSearchParams({
      date: dateOnly,
    });

    router.push(`/supply/status-supply?${params.toString()}`);
  };

  const formattedDate = useMemo(() => {
    const dateOnly = normalizeDateOnly(currentDate);

    if (!dateOnly) return "Não informada";

    const [year, month, day] = dateOnly.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
  }, [currentDate]);

  const situationStyle = (situacao?: string) => {
    const value = situacao?.toLowerCase?.() ?? "";

    if (value.includes("atendimento")) {
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-400/30";
    }

    if (value.includes("conclu")) {
      return "bg-green-600/15 text-green-400 border border-green-500/30";
    }

    if (value.includes("erro") || value.includes("falha")) {
      return "bg-red-600/15 text-red-400 border border-red-500/30";
    }

    return "bg-blue-600/15 text-blue-300 border border-blue-500/30";
  };

  const emailStyle = (sendEmail: boolean) => {
    return sendEmail
      ? "bg-green-600/15 text-green-400 border border-green-500/30"
      : "bg-zinc-500/15 text-zinc-300 border border-zinc-500/30";
  };

  return (
    <Page>
      <TitlePages linkBack="/supply/add" icon={faEnvelope}>
        Status da Abertura de OS
      </TitlePages>

      <div className="flex w-full flex-col gap-4 p-5">
        <div className="flex flex-col gap-3">
          <label className="text-lg font-bold uppercase">
            Pesquisar por data
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="h-10 w-72 rounded-md text-center text-black outline-none uppercase"
            />

            <ButtonScreenOrder
              color="#32c015"
              onClick={handleSearch}
              size="btn-icon"
              textColor="white"
              icon={faMagnifyingGlass}
              secondaryColor="#318c1e"
            />
          </div>
        </div>

        <div className="h-px w-full bg-zinc-700" />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-700 bg-[#07152b] p-4 shadow-sm">
            <span className="block text-xs uppercase text-zinc-400">Data</span>
            <strong className="mt-1 block text-white">{formattedDate}</strong>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-[#07152b] p-4 shadow-sm">
            <span className="block text-xs uppercase text-zinc-400">
              Job ID
            </span>
            <strong className="mt-1 block break-all text-xs text-white">
              {jobId ?? "Consulta manual"}
            </strong>
          </div>

          <div className="rounded-xl border border-zinc-700 bg-[#07152b] p-4 shadow-sm">
            <span className="block text-xs uppercase text-zinc-400">
              Acompanhamento
            </span>

            <strong className="mt-1 block text-white">
              {jobId ? "Automático" : "Manual"}
            </strong>

            <span className="mt-2 block text-xs text-zinc-300">
              {lastEvent ||
                (jobId
                  ? "Aguardando eventos do processo..."
                  : "Pesquisa por data")}
            </span>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-zinc-700 bg-[#07152b] p-6 text-center text-sm text-zinc-300">
            Nenhum status encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-zinc-700 bg-[#07152b] p-4 shadow-sm transition-colors hover:border-zinc-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="block text-xs uppercase tracking-wide text-zinc-400">
                      ATM
                    </span>

                    <strong
                      className="block truncate text-sm text-white"
                      title={item.atm_name}
                    >
                      {item.atm_name || "Sem nome"}
                    </strong>
                  </div>

                  <span className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-300">
                    ID {item.id_atm}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-white/5 p-3">
                    <span className="mb-1 block text-xs uppercase text-zinc-400">
                      OS
                    </span>
                    <strong className="text-white">{item.os || "-"}</strong>
                  </div>

                  <div className="rounded-lg bg-white/5 p-3">
                    <span className="mb-1 block text-xs uppercase text-zinc-400">
                      E-mail
                    </span>

                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${emailStyle(
                        item.send_email
                      )}`}
                    >
                      {item.send_email ? "Enviado" : "Não enviado"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-wide text-zinc-400">
                    Situação
                  </span>

                  <span
                    className={`inline-flex w-fit rounded-md px-2.5 py-1 text-xs font-semibold ${situationStyle(
                      item.situacao
                    )}`}
                  >
                    {item.situacao || "Não informado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}