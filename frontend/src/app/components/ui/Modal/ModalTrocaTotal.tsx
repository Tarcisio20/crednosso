"use client";

import {
  atmForSupplyProps,
  ordersWithTreasuriesProps, // 👈 nome correto aqui
  supplyProps,
} from "@/app/(private)/supply/add/page";
import { useEffect, useState } from "react";
import { Loading } from "../../ux/Loading";
import { add } from "@/app/service/supply";
import { toast } from "sonner";
import { treasuryType } from "@/types/treasuryType";

// (se não usar, pode remover esse type)
type AtmType = {
  id_system: number;
  name: string;
};

// extendendo o tipo para garantir que temos o campo `exchange`
type SupplyWithExchange = supplyProps & {
  exchange?: boolean;
};

type ModalTrocaTotalProps = {
  dateForOS: string;
  atmsSelected: atmForSupplyProps[];
  orderUsed: ordersWithTreasuriesProps | null; // 👈 usa o mesmo aqui
  onClose: () => void;
  treasuries: treasuryType[];
  changeTreasuries: (treasuries: treasuryType[]) => void;
};

export const ModalTrocaTotal = ({
  dateForOS,
  atmsSelected,
  orderUsed,
  onClose,
  treasuries,
  changeTreasuries,
}: ModalTrocaTotalProps) => {
  const [cloneAtmSelected, setCloneAtmSelected] = useState<SupplyWithExchange[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    const includeFiled: SupplyWithExchange[] = atmsSelected.map((atm) => ({
      id_atm: atm.id_system,
      id_treasury: atm.id_treasury,
      name: atm.name,
      short_name: atm.short_name,
      cassete_A: atm.cassete_A,
      cassete_B: atm.cassete_B,
      cassete_C: atm.cassete_C,
      cassete_D: atm.cassete_D,
      // inicialmente não é troca total
      total_exchange: false,
      exchange: false,
      date: orderUsed?.date_order as Date,
      date_on_supply: dateForOS,
    }));

    setCloneAtmSelected(includeFiled);
    setLoading(false);
  }, [atmsSelected, dateForOS, orderUsed]);

  const handleMarcar = (id: number) => {
    setCloneAtmSelected((prev) =>
      prev.map((atm) => {
        if (atm.id_atm !== id) return atm;

        const newExchange = !atm.exchange; // inverte
        return {
          ...atm,
          exchange: newExchange,
          total_exchange: newExchange, // mantém os dois em sincronia
        };
      })
    );
  };

  const onSave = async () => {
    setLoading(true);

    const qtAtms = atmsSelected?.length ?? 1;

    const valueA =
      (orderUsed?.confirmed_value_A ?? 0) > 0
        ? orderUsed?.confirmed_value_A
        : (orderUsed?.requested_value_A as number);

    const valueB =
      (orderUsed?.confirmed_value_B ?? 0) > 0
        ? orderUsed?.confirmed_value_B
        : (orderUsed?.requested_value_B as number);

    const valueC =
      (orderUsed?.confirmed_value_C ?? 0) > 0
        ? orderUsed?.confirmed_value_C
        : (orderUsed?.requested_value_C as number);

    const valueD =
      (orderUsed?.confirmed_value_D ?? 0) > 0
        ? orderUsed?.confirmed_value_D
        : (orderUsed?.requested_value_D as number);

    // monta payload final, mantendo exchange / total_exchange já marcados
    const novosDados: SupplyWithExchange[] = cloneAtmSelected.map((atm) => ({
      ...atm,
      id_order: orderUsed?.id_order as number,
      cassete_A: valueA! / qtAtms,
      cassete_B: valueB! / qtAtms,
      cassete_C: valueC! / qtAtms,
      cassete_D: valueD! / qtAtms,
    }));

    try {
      const addSupply = await add(novosDados);

      if (addSupply.data.erros.length === 0) {
        toast.success("Abastecimento adicionado com sucesso!");
        const newSelected = treasuries.filter(
          (t) => t.id_system !== atmsSelected[0].id_treasury
        );
        changeTreasuries(newSelected);
      } else {
        toast.error("Erro ao adicionar abastecimento: " + addSupply.data.erros);
      }
    } catch (e) {
      toast.error("Erro ao adicionar abastecimento.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded shadow-lg w-96 border-2 border-b-gray-300">
        <h2 className="text-sm font-bold mb-4 text-center uppercase">
          Deseja troca total para algum terminal?
        </h2>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {atmsSelected.map((atm) => {
            const selected = cloneAtmSelected.find(
              (a) => a.id_atm === atm.id_system
            );
            const checked = !!selected?.exchange;

            return (
              <label
                key={atm.id_system}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleMarcar(atm.id_system)}
                />
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
