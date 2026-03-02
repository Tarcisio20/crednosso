"use client";

import { useMemo, useState } from "react";
import { supplyProps } from "@/app/(private)/supply/add/page";
import { generateFullReal } from "@/app/utils/generateFullReal";
import { toast } from "sonner";
import { editIndividualSupply } from "@/app/service/supply"; // ✅ ajuste o caminho se necessário

type ModalEditSupplyType = {
  saldo: { a: number; b: number; c: number; d: number };
  onApply: (updated: Partial<supplyProps>) => void;
  supply: Partial<supplyProps>;
  onClose: () => void;
};

type SupplyEdit = {
  cassete_A?: number;
  cassete_B?: number;
  cassete_C?: number;
  cassete_D?: number;
  total_exchange?: boolean;
};

export default function ModalEditSupply({ saldo, supply, onApply, onClose }: ModalEditSupplyType) {
  const supplyId = Number(supply.id ?? 0);

  const supplyA0 = Number(supply.cassete_A ?? 0);
  const supplyB0 = Number(supply.cassete_B ?? 0);
  const supplyC0 = Number(supply.cassete_C ?? 0);
  const supplyD0 = Number(supply.cassete_D ?? 0);

  const baseEditA = Number(saldo.a ?? 0) + supplyA0;
  const baseEditB = Number(saldo.b ?? 0) + supplyB0;
  const baseEditC = Number(saldo.c ?? 0) + supplyC0;
  const baseEditD = Number(saldo.d ?? 0) + supplyD0;

  const [valueA, setValueA] = useState<number>(supplyA0);
  const [valueB, setValueB] = useState<number>(supplyB0);
  const [valueC, setValueC] = useState<number>(supplyC0);
  const [valueD, setValueD] = useState<number>(supplyD0);
  const [trocaTotal, setTrocaTotal] = useState<boolean>(Boolean(supply.total_exchange));
  const [saving, setSaving] = useState<boolean>(false);

  const disponivelA = Math.max(0, baseEditA - valueA);
  const disponivelB = Math.max(0, baseEditB - valueB);
  const disponivelC = Math.max(0, baseEditC - valueC);
  const disponivelD = Math.max(0, baseEditD - valueD);

  const clamp = (v: number, max: number) =>
    Math.max(0, Math.min(max, Number.isFinite(v) ? v : 0));

  const handleChange = (raw: string, type: 10 | 20 | 50 | 100) => {
    const v = Number(raw === "" ? 0 : raw);
    if (type === 10) return setValueA(clamp(v, baseEditA));
    if (type === 20) return setValueB(clamp(v, baseEditB));
    if (type === 50) return setValueC(clamp(v, baseEditC));
    if (type === 100) return setValueD(clamp(v, baseEditD));
  };

  const handleSave = async () => {
    if (!supplyId) {
      toast.error("ID do abastecimento inválido.");
      return;
    }

    setSaving(true);
    try {
      const dataBackend: SupplyEdit = {
        cassete_A: valueA,
        cassete_B: valueB,
        cassete_C: valueC,
        cassete_D: valueD,
        total_exchange: trocaTotal,
      };

      const resp = await editIndividualSupply(supplyId, dataBackend);

      if ((resp as any)?.status && Number((resp as any).status) >= 400) {
        toast.error((resp as any).message ?? "Erro ao salvar edição.");
        return;
      }
      onApply({
        ...supply,
        id: supplyId,
        cassete_A: valueA,
        cassete_B: valueB,
        cassete_C: valueC,
        cassete_D: valueD,
        total_exchange: trocaTotal,
      });
      toast.success("OS atualizada com sucesso!");
      onClose();
    } catch (err) {
      toast.error("Erro ao salvar edição.");
    } finally {
      setSaving(false);
    }
  };

  const total = useMemo(
    () => valueA * 10 + valueB * 20 + valueC * 50 + valueD * 100,
    [valueA, valueB, valueC, valueD]
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4">
      <div className="bg-zinc-900 rounded-xl shadow-lg border border-zinc-700 p-6 w-fit">
        <h2 className="text-lg font-bold text-center uppercase text-zinc-200 mb-5">
          Editar Abastecimento
        </h2>

        <div className="w-[420px] flex flex-col gap-4 border-2 border-zinc-600 rounded-md p-4">
          <div className="flex gap-2 p-2 items-center bg-zinc-800 w-full rounded">
            <input
              type="checkbox"
              checked={trocaTotal}
              onChange={(e) => setTrocaTotal(e.target.checked)}
              disabled={saving}
            />
            <label className="uppercase text-sm text-white">Troca total</label>
          </div>

          <div className="flex gap-2 p-2 justify-between bg-zinc-800 w-full rounded">
            <div className="text-lg text-white w-[90px]">R$ 10,00</div>
            <input
              className="text-lg h-9 w-[140px] rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
              value={valueA}
              max={baseEditA}
              onChange={(e) => handleChange(e.target.value, 10)}
              disabled={saving}
            />
            <div className="text-sm text-zinc-300 self-center w-[80px] text-right">
              disp: {disponivelA}
            </div>
          </div>

          <div className="flex gap-2 p-2 justify-between bg-zinc-800 w-full rounded">
            <div className="text-lg text-white w-[90px]">R$ 20,00</div>
            <input
              className="text-lg h-9 w-[140px] rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
              value={valueB}
              max={baseEditB}
              onChange={(e) => handleChange(e.target.value, 20)}
              disabled={saving}
            />
            <div className="text-sm text-zinc-300 self-center w-[80px] text-right">
              disp: {disponivelB}
            </div>
          </div>

          <div className="flex gap-2 p-2 justify-between bg-zinc-800 w-full rounded">
            <div className="text-lg text-white w-[90px]">R$ 50,00</div>
            <input
              className="text-lg h-9 w-[140px] rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
              value={valueC}
              max={baseEditC}
              onChange={(e) => handleChange(e.target.value, 50)}
              disabled={saving}
            />
            <div className="text-sm text-zinc-300 self-center w-[80px] text-right">
              disp: {disponivelC}
            </div>
          </div>

          <div className="flex gap-2 p-2 justify-between bg-zinc-800 w-full rounded">
            <div className="text-lg text-white w-[90px]">R$ 100,00</div>
            <input
              className="text-lg h-9 w-[140px] rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
              value={valueD}
              max={baseEditD}
              onChange={(e) => handleChange(e.target.value, 100)}
              disabled={saving}
            />
            <div className="text-sm text-zinc-300 self-center w-[80px] text-right">
              disp: {disponivelD}
            </div>
          </div>

          <div className="flex gap-2 p-2 justify-between bg-zinc-800 w-full rounded font-bold">
            <div className="text-lg text-white">TOTAL</div>
            <div className="text-lg text-white">{generateFullReal(total)}</div>
          </div>

          <div className="flex w-full gap-3 pt-1">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 rounded-md disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 rounded-md disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}