"use client";

import { supplyProps } from "@/app/(private)/supply/add/page";
import { openOS, openOSProps } from "@/app/service/supply";
import { formatDateToString } from "@/app/utils/formatDateToString";
import { generateExcelOs } from "@/app/utils/generateExcelOs";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Loading } from "../../ux/Loading";
import { socket } from "@/lib/socket";

type ModalOSProps = {
  close: () => void;
  data: Partial<supplyProps>[];
  atmMap: Map<number, string>;
  treasuryMap: Map<number, string>;
};

export const ModalOS = ({ close, data, atmMap, treasuryMap }: ModalOSProps) => {
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const activeJobIdRef = useRef<string | null>(null);
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  const getAtmName = (id: number) => atmMap.get(id) ?? "-";
  const getTreasuryName = (id: number) => treasuryMap.get(id) ?? "-";

  const allSupplyIds = useMemo(
    () => data.map((s) => s.id).filter((id): id is number => typeof id === "number"),
    [data]
  );

  useEffect(() => {
    setCheckedIds(allSupplyIds);
  }, [allSupplyIds]);

  const toggleCheckbox = (id: number) => {
    setCheckedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // ✅ estado do "Selecionar tudo"
  const allSelected = useMemo(() => {
    if (allSupplyIds.length === 0) return false;
    return allSupplyIds.every((id) => checkedIds.includes(id));
  }, [allSupplyIds, checkedIds]);

  const someSelected = useMemo(() => {
    return checkedIds.length > 0 && !allSelected;
  }, [checkedIds.length, allSelected]);

  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const handleToggleSelectAll = () => {
    if (loading) return;
    setCheckedIds((prev) => {
      const all = allSupplyIds;
      const isAll = all.length > 0 && all.every((id) => prev.includes(id));
      return isAll ? [] : [...all];
    });
  };

  useEffect(() => {
    return () => {
      socket.off("openos:started");
      socket.off("openos:progress");
      socket.off("openos:done");
      socket.off("openos:error");
    };
  }, []);

  const handleGenerateOss = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (!socket.connected) {
        socket.connect();
        await new Promise<void>((resolve) => socket.once("connect", () => resolve()));
      }

      const socketId = socket.id;

      if (atmMap.size === 0 || treasuryMap.size === 0) {
        toast.error("Não foi possível carregar nomes de ATM/Tesouraria. Clique em Pesquisar novamente.");
        setLoading(false);
        return;
      }

      const selectedSupplies = data.filter(
        (s): s is supplyProps => typeof s.id === "number" && checkedIds.includes(s.id)
      );

      if (selectedSupplies.length === 0) {
        toast.error("Selecione pelo menos uma OS para gerar.");
        setLoading(false);
        return;
      }

      //await generateExcelOs(selectedSupplies);

      const dataItem: openOSProps[] = selectedSupplies.map((item) => ({
        id_supply: Number(item.id),
        id_atm: Number(item.id_atm),
        atm_name: getAtmName(Number(item.id_atm)),
        id_treasury: Number(item.id_treasury),
        treasury_name: getTreasuryName(Number(item.id_treasury)),
        total_exchange: Boolean(item.total_exchange),
        date_on_supply: String(item.date_on_supply ?? ""),
        cassete_A: Number(item.cassete_A ?? 0),
        cassete_B: Number(item.cassete_B ?? 0),
        cassete_C: Number(item.cassete_C ?? 0),
        cassete_D: Number(item.cassete_D ?? 0),
      }));

      const startResp: any = await openOS({ socketId, data: dataItem });

      if (!startResp?.data?.ok || !startResp?.data?.jobId) {
        toast.error(startResp?.error ?? "Erro ao iniciar geração de OS");
        setLoading(false);
        return;
      }

      const jobId = String(startResp.data.jobId);
      activeJobIdRef.current = jobId;

      toast.message("Processo iniciado. Você pode continuar usando o sistema.");
      setLoading(false);

      socket.off("openos:started");
      socket.off("openos:progress");
      socket.off("openos:done");
      socket.off("openos:error");

      const onStarted = (p: any) => {
        if (String(p?.jobId) !== jobId) return;
        toast.message("Iniciando geração...");
      };

      const onProgress = (p: any) => {
        if (String(p?.jobId) !== jobId) return;
        if (p?.message) console.log("[OPENOS][PROGRESS]", p.message);
      };

      const cleanup = () => {
        socket.off("openos:started", onStarted);
        socket.off("openos:progress", onProgress);
        socket.off("openos:done", onDone);
        socket.off("openos:error", onError);
        if (activeJobIdRef.current === jobId) activeJobIdRef.current = null;
      };

      const onDone = (p: any) => {
        if (String(p?.jobId) !== jobId) return;
        cleanup();
        toast.success(p?.ok ? "OSs geradas e e-mails enviados com sucesso!" : "Processo finalizado, mas houve falhas.");
      };

      const onError = (p: any) => {
        if (String(p?.jobId) !== jobId) return;
        cleanup();
        toast.error(p?.details ?? p?.error ?? "Erro no processamento");
      };

      socket.on("openos:started", onStarted);
      socket.on("openos:progress", onProgress);
      socket.on("openos:done", onDone);
      socket.on("openos:error", onError);

      // se você quiser fechar o modal ao iniciar:
      // close();
    } catch (err: any) {
      toast.error(err?.message ?? "Erro inesperado ao iniciar geração de OS");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-xl shadow-lg w-11/12 max-w-5xl border border-zinc-700">
        <h2 className="text-lg font-bold mb-4 text-center uppercase text-zinc-200">
          OSs que serão geradas
        </h2>

        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-zinc-200 text-sm">
            <input
              ref={selectAllRef}
              type="checkbox"
              checked={allSelected}
              onChange={handleToggleSelectAll}
              disabled={loading || allSupplyIds.length === 0}
            />
            Selecionar / desmarcar tudo
          </label>

          <div className="text-zinc-300 text-sm">
            Selecionadas: <b>{checkedIds.length}</b> / {allSupplyIds.length}
          </div>
        </div>

        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left bg-zinc-800 text-zinc-300 text-sm uppercase">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">ATM</th>
                <th className="px-4 py-2">Troca Total</th>
                <th className="px-4 py-2">Tesouraria</th>
                <th className="px-4 py-2">Valor</th>
                <th className="px-4 py-2">Data</th>
              </tr>
            </thead>

            <tbody className="text-zinc-200 text-sm">
              {data.map((supply, idx) => {
                const rowKey = supply.id ?? idx;
                const hasId = typeof supply.id === "number";
                const checked = hasId ? checkedIds.includes(supply.id as number) : false;

                return (
                  <tr key={rowKey} className="hover:bg-zinc-800 border-b border-zinc-700 transition-colors">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!hasId || loading}
                        onChange={() => hasId && toggleCheckbox(supply.id as number)}
                      />
                    </td>

                    <td className="px-4 py-2">{hasId ? supply.id : "-"}</td>
                    <td className="px-4 py-2">{getAtmName(Number(supply.id_atm ?? 0))}</td>
                    <td className="px-4 py-2">{supply.total_exchange ? "Sim" : "Não"}</td>
                    <td className="px-4 py-2">{getTreasuryName(Number(supply.id_treasury ?? 0))}</td>

                    <td className="px-4 py-2">
                      {generateRealTotal(
                        supply.cassete_A ?? 0,
                        supply.cassete_B ?? 0,
                        supply.cassete_C ?? 0,
                        supply.cassete_D ?? 0
                      )}
                    </td>

                    <td className="px-4 py-2">{formatDateToString(String(supply.date_on_supply ?? ""))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleGenerateOss}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
            disabled={checkedIds.length === 0 || loading}
          >
            Confirmar
          </button>

          <button
            onClick={close}
            className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
            disabled={loading}
          >
            Cancelar
          </button>
        </div>

        {loading && <Loading />}
      </div>
    </div>
  );
};