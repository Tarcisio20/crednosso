"use client"

import { supplyProps } from "@/app/(private)/supply/add/page";
import { formatDateToString } from "@/app/utils/formatDateToString";
import { generateExcelOs } from "@/app/utils/generateExcelOs";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { atmType } from "@/types/atmType";
import { treasuryType } from "@/types/treasuryType";
import { useEffect, useState } from "react";

type ModalOSProps = {
  close: () => void;
  data: Partial<supplyProps[]>;
  atms: atmType[];
  treasuries: treasuryType[];
};

const getAtmName = (id: number, atms: atmType[]) => {
  const atm = atms.find((atm) => atm.id_system === id);
  return atm ? atm.short_name : "ATM Inválido!";
};

const getTreasuryName = (id: number, treasuries: treasuryType[]) => {
  const treasury = treasuries.find((treasury) => treasury.id_system === id);
  return treasury ? treasury.name : "Tesouraria Inválida!";
};

export const ModalOS = ({ close, data, atms, treasuries }: ModalOSProps) => {
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  useEffect(() => {
    const allIds = data.map((s) => s?.id).filter((id): id is number => Boolean(id));
    setCheckedIds(allIds);
  }, [data]);

  const toggleCheckbox = (id: number) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGenerateOss = async () => {
    const selectedSupplies = data.filter(
      (supply): supply is supplyProps => supply?.id !== undefined && checkedIds.includes(supply.id)
    );
    await generateExcelOs(selectedSupplies);
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
              {data.map((supply) => (
                <tr
                  key={supply?.id ?? Math.random()}
                  className="hover:bg-zinc-800 border-b border-zinc-700 transition-colors"
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={checkedIds.includes(supply?.id ?? -1)}
                      onChange={() => toggleCheckbox(supply?.id ?? -1)}
                    />
                  </td>
                  <td className="px-4 py-2">{supply?.id}</td>
                  <td className="px-4 py-2">
                    {getAtmName(supply?.id_atm ?? -1, atms)}
                  </td>
                  <td className="px-4 py-2">
                    {supply?.total_exchange ? "Sim" : "Não"}
                  </td>
                  <td className="px-4 py-2">
                    {getTreasuryName(supply?.id_treasury ?? -1, treasuries)}
                  </td>
                  <td className="px-4 py-2">
                    {generateRealTotal(
                      supply?.cassete_A ?? 0,
                      supply?.cassete_B ?? 0,
                      supply?.cassete_C ?? 0,
                      supply?.cassete_D ?? 0
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {formatDateToString(supply?.date_on_supply ?? "")}
                  </td>
                </tr>
              ))}
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