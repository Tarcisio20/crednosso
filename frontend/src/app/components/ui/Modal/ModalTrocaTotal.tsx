"use client";

import { atmForSupplyProps, supplyProps } from "@/app/(private)/supply/add/page";
import { useEffect, useMemo, useState } from "react";
import { Loading } from "../../ux/Loading";
import { add } from "@/app/service/supply";
import { toast } from "sonner";

type SupplyWithExchange = supplyProps & {
  exchange?: boolean;
};

type ModalTrocaTotalProps = {
  dateForOS: string;
  atmsSelected: atmForSupplyProps[];

  // ✅ valores por terminal (saldo tesouraria / qtTerminais)
  perTerminal: { a: number; b: number; c: number; d: number };

  orderId: number;
  treasuryId: number;
  dateOrder: Date;

  onApplied: (createdList: Partial<supplyProps>[]) => void;
  onClose: () => void;
};

export const ModalTrocaTotal = ({
  dateForOS,
  atmsSelected,
  perTerminal,
  orderId,
  treasuryId,
  dateOrder,
  onApplied,
  onClose,
}: ModalTrocaTotalProps) => {
  const [cloneAtmSelected, setCloneAtmSelected] = useState<SupplyWithExchange[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const totalPorTerminal = useMemo(() => {
    return perTerminal.a * 10 + perTerminal.b * 20 + perTerminal.c * 50 + perTerminal.d * 100;
  }, [perTerminal]);

  useEffect(() => {
    const base: SupplyWithExchange[] = atmsSelected.map((atm) => ({
      id_atm: atm.id_system,
      id_treasury: treasuryId,
      id_order: orderId,

      name: atm.name,
      short_name: atm.short_name,

      cassete_A: 0,
      cassete_B: 0,
      cassete_C: 0,
      cassete_D: 0,

      total_exchange: false,
      exchange: false,

      date: dateOrder,
      date_on_supply: dateForOS,
    }));

    setCloneAtmSelected(base);
  }, [atmsSelected, dateForOS, dateOrder, orderId, treasuryId]);

  const handleMarcar = (idSystem: number) => {
    setCloneAtmSelected((prev) =>
      prev.map((atm) => {
        if (atm.id_atm !== idSystem) return atm;
        const newExchange = !atm.exchange;
        return { ...atm, exchange: newExchange, total_exchange: newExchange };
      })
    );
  };

  const onSave = async () => {
    if (!orderId || !treasuryId) return toast.error("Dados inválidos para salvar.");
    if (!atmsSelected || atmsSelected.length <= 1) return toast.error("Precisa ter mais de 1 terminal.");

    setLoading(true);

    const novosDados: SupplyWithExchange[] = cloneAtmSelected.map((atm) => ({
      ...atm,
      id_order: orderId,
      id_treasury: treasuryId,

      // ✅ VALORES REAIS (saldo em tesouraria dividido)
      cassete_A: perTerminal.a,
      cassete_B: perTerminal.b,
      cassete_C: perTerminal.c,
      cassete_D: perTerminal.d,

      total_exchange: Boolean(atm.total_exchange),
    }));

    try {
      const resp = await add(novosDados);

      if (resp?.data?.erros && Array.isArray(resp.data.erros) && resp.data.erros.length > 0) {
        toast.error("Erro ao adicionar abastecimento: " + resp.data.erros.join(", "));
        setLoading(false);
        return;
      }

      // tenta pegar lista criada; se não vier, usa payload mesmo (já com valores corretos)
      const createdFromApi: any[] =
        resp?.data?.supply ?? resp?.data?.supplies ?? resp?.data?.created ?? resp?.data?.data ?? [];

      const createdList: Partial<supplyProps>[] =
        Array.isArray(createdFromApi) && createdFromApi.length > 0 ? createdFromApi : novosDados;

      toast.success("Abastecimento dividido e salvo com sucesso!");
      onApplied(createdList);
      onClose();
    } catch (e) {
      toast.error("Erro ao adicionar abastecimento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded shadow-lg w-96 border-2 border-b-gray-300">
        <h2 className="text-sm font-bold mb-2 text-center uppercase">
          Dividir saldo em tesouraria por {atmsSelected.length} terminais
        </h2>

        <div className="text-xs text-center mb-4 text-zinc-200">
          Por terminal: A={perTerminal.a} | B={perTerminal.b} | C={perTerminal.c} | D={perTerminal.d}
          <br />
          Total por terminal:{" "}
          {totalPorTerminal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </div>

        <h3 className="text-sm font-bold mb-2 text-center uppercase">Marque troca total</h3>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {atmsSelected.map((atm) => {
            const selected = cloneAtmSelected.find((a) => a.id_atm === atm.id_system);
            const checked = !!selected?.exchange;

            return (
              <label key={atm.id_system} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={checked} onChange={() => handleMarcar(atm.id_system)} />
                {atm.id_system} - {atm.name}
              </label>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-400 hover:text-black"
            disabled={loading}
          >
            Confirmar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-300 rounded hover:bg-red-100 hover:text-black"
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