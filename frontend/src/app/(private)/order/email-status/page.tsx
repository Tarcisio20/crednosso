"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { Loading } from "@/app/components/ux/Loading";
import { faEnvelope, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getEmailStatusForDate } from "@/app/service/email";
import { toast } from "sonner";
import { socket } from "@/lib/socket";
import { ButtonScreenOrder } from "@/app/components/ui/ButtonScreenOrder";

type EmailStatusItem = {
  id_treasury: number;
  treasury_name: string;
  status: "PENDENTE" | "ENVIADO" | "ERROR";
};

export default function EmailStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateFromUrl = searchParams.get("date");
  const jobId = searchParams.get("jobId");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<EmailStatusItem[]>([]);
  const [lastEvent, setLastEvent] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>(dateFromUrl ?? "");
  const [currentDate, setCurrentDate] = useState<string>(dateFromUrl ?? "");

  useEffect(() => {
    setSearchDate(dateFromUrl ?? "");
    setCurrentDate(dateFromUrl ?? "");
  }, [dateFromUrl]);

  const fetchStatus = useCallback(
    async (dateToFetch?: string) => {
      const targetDate = dateToFetch ?? currentDate;
      if (!targetDate) return;

      setLoading(true);

      try {
        const selectedIds =
          jobId && typeof window !== "undefined"
            ? JSON.parse(sessionStorage.getItem(`email-job:${jobId}`) ?? "[]")
            : [];

        const response = await getEmailStatusForDate(targetDate, selectedIds);
        console.log("Response", response)
        if (response.status !== 200) {
          toast.error("Erro ao buscar status dos e-mails.");
          setItems([]);
          return;
        }

        setItems(response.data.status ?? []);
      } catch (error) {
        setItems([]);
        toast.error("Erro ao buscar status dos e-mails.");
      } finally {
        setLoading(false);
      }
    },
    [currentDate, jobId]
  );

  useEffect(() => {
    fetchStatus(currentDate);
  }, [currentDate, fetchStatus]);

  useEffect(() => {
    if (!socket || !jobId || !currentDate) return;

    const handleStarted = (payload: any) => {
      if (payload?.jobId !== jobId) return;
      setLastEvent("Processamento iniciado");
      fetchStatus(currentDate);
    };

    const handleProgress = (payload: any) => {
      if (payload?.jobId !== jobId) return;
      setLastEvent(
        `${payload?.treasuryName ?? ""} - ${payload?.status ?? payload?.step ?? "Atualizando"}`
      );
      fetchStatus(currentDate);
    };

    const handleDone = (payload: any) => {
      if (payload?.jobId !== jobId) return;
      setLastEvent("Processamento concluído");
      fetchStatus(currentDate);
    };

    const handleError = (payload: any) => {
      if (payload?.jobId !== jobId) return;
      setLastEvent(`Erro: ${payload?.error ?? "Falha no processamento"}`);
      fetchStatus(currentDate);
    };

    socket.on("order-email:started", handleStarted);
    socket.on("order-email:progress", handleProgress);
    socket.on("order-email:done", handleDone);
    socket.on("order-email:error", handleError);

    return () => {
      socket.off("order-email:started", handleStarted);
      socket.off("order-email:progress", handleProgress);
      socket.off("order-email:done", handleDone);
      socket.off("order-email:error", handleError);
    };
  }, [jobId, currentDate, fetchStatus]);

  const handleSearch = async () => {
    if (!searchDate) {
      toast.error("Selecione uma data para pesquisar.");
      return;
    }

    setLastEvent("");
    setCurrentDate(searchDate);

    router.push(`/order/email-status?date=${searchDate}`);
  };

  const formattedDate = currentDate
    ? new Date(`${currentDate}T00:00:00`).toLocaleDateString("pt-BR")
    : "Não informada";

  const statusStyle = (status: EmailStatusItem["status"]) => {
    if (status === "ENVIADO") {
      return "bg-green-600/20 text-green-400 border border-green-500/30";
    }
    if (status === "ERROR") {
      return "bg-red-600/20 text-red-400 border border-red-500/30";
    }
    return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30";
  };

  return (
    <Page>
      <TitlePages linkBack="/order/search" icon={faEnvelope}>
        Status dos E-mails
      </TitlePages>

      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-3">
          <label className="uppercase font-bold text-lg">Pesquisar por data</label>

          <div className="flex gap-3 items-center flex-wrap">
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-72 h-10 outline-none rounded-md text-black text-center uppercase"
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

        <div className="h-1 bg-zinc-500 w-full"></div>

        <div className="w-full rounded-md border border-zinc-700 bg-[#07152b] p-4 flex flex-col gap-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 rounded-md bg-white/5 p-3">
              <span className="text-zinc-400 font-medium">Data</span>
              <span className="text-white font-semibold break-words">
                {formattedDate}
              </span>
            </div>

            <div className="flex flex-col gap-1 rounded-md bg-white/5 p-3">
              <span className="text-zinc-400 font-medium">Job ID</span>
              <span
                className="text-white text-xs break-all"
                title={jobId ?? ""}
              >
                {jobId ?? "Não informado"}
              </span>
            </div>

            <div className="flex flex-col gap-1 rounded-md bg-white/5 p-3">
              <span className="text-zinc-400 font-medium">Último evento</span>
              <span className="text-white text-xs break-words">
                {lastEvent || "Aguardando atualização"}
              </span>
            </div>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="flex flex-wrap gap-3 items-start">
            {items.map((item) => (
              <div
                key={item.id_treasury}
                className="rounded-md border border-zinc-700 bg-[#07152b] p-2 flex flex-col gap-1 min-h-[60px] w-[150px]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-zinc-400 uppercase">ID</span>
                  <span className="text-[11px] font-semibold text-white">
                    {item.id_treasury}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                  <span
                    className="text-[11px] text-white leading-3 truncate block w-full"
                    title={item.treasury_name}
                  >
                    {item.treasury_name}
                  </span>
                </div>

                <div className="mt-1">
                  <span
                    className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="rounded-lg border border-zinc-700 bg-[#07152b] p-4 text-sm text-center">
              Nenhum status encontrado.
            </div>
          )
        )}

        {loading && <Loading />}
      </div>
    </Page>
  );
}