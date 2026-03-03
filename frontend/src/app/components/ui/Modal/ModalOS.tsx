"use client";

import { supplyProps } from "@/app/(private)/supply/add/page";
import { openOS, openOSProps } from "@/app/service/supply";
import { formatDateToString } from "@/app/utils/formatDateToString";
import { generateExcelOs } from "@/app/utils/generateExcelOs";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ModalOSProps = {
  close: () => void;
  data: Partial<supplyProps>[];
  atmMap: Map<number, string>;
  treasuryMap: Map<number, string>;
};

export const ModalOS = ({ close, data, atmMap, treasuryMap }: ModalOSProps) => {
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const getAtmName = (id: number) => atmMap.get(id) ?? `ATM ${id}`;
  const getTreasuryName = (id: number) => treasuryMap.get(id) ?? `Tesouraria ${id}`;
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

  const handleGenerateOss = async () => {
    setLoading(true);
    const selectedSupplies = data.filter(
      (s): s is supplyProps =>
        typeof s.id === "number" && checkedIds.includes(s.id)
    );

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

      const open = await openOS(dataItem);
      if(open.ok){
        toast.success("OSs geradas com sucesso!");
      }else{
        toast.error("Erro ao gerar OSS");
      }
    setLoading(false);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-xl shadow-lg w-11/12 max-w-5xl border border-zinc-700">
        <h2 className="text-lg font-bold mb-4 text-center uppercase text-zinc-200">
          OSs que serão geradas
        </h2>

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
                  <tr
                    key={rowKey}
                    className="hover:bg-zinc-800 border-b border-zinc-700 transition-colors"
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!hasId}
                        onChange={() => hasId && toggleCheckbox(supply.id as number)}
                      />
                    </td>

                    <td className="px-4 py-2">{hasId ? supply.id : "-"}</td>

                    <td className="px-4 py-2">
                      {getAtmName(Number(supply.id_atm ?? 0))}
                    </td>

                    <td className="px-4 py-2">{supply.total_exchange ? "Sim" : "Não"}</td>

                    <td className="px-4 py-2">
                      {getTreasuryName(Number(supply.id_treasury ?? 0))}
                    </td>

                    <td className="px-4 py-2">
                      {generateRealTotal(
                        supply.cassete_A ?? 0,
                        supply.cassete_B ?? 0,
                        supply.cassete_C ?? 0,
                        supply.cassete_D ?? 0
                      )}
                    </td>

                    <td className="px-4 py-2">
                      {formatDateToString(String(supply.date_on_supply ?? ""))}
                    </td>
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
            disabled={checkedIds.length === 0}
          >
            Confirmar
          </button>

          <button
            onClick={close}
            className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};