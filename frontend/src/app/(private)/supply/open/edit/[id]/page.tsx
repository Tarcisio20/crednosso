"use client"

import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { AlterSupply, getOSById } from "@/app/service/os";
import { getSupplyForOS } from "@/app/service/supply";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { faParachuteBox } from "@fortawesome/free-solid-svg-icons";
import BoxInfo from "@/app/components/ui/BoxInfo";
import BoxInternalInfo from "@/app/components/ui/BoxInternalInfo";
import { generateFullReal } from "@/app/utils/generateFullReal";
import { Button } from "@/app/components/ui/Button";
import { supplyType } from "@/types/supplyType";
import { OsOpenType } from "@/types/openOsType";

export type orderType = {
  atm_name: string;
  cassete_A: number;
  cassete_B: number;
  cassete_C: number;
  cassete_D: number;
  createdAt: string;
  cassete_A_confirmed: number;
  cassete_B_confirmed: number;
  cassete_C_confirmed: number;
  cassete_D_confirmed: number;
  date: string;
  date_on_supply: string;
  id: number;
  id_atm: number;
  id_order: number;
  id_treasury: number;
  status: boolean;
  total_exchange: boolean;
  treasury_name: string;
  updatedAt: string;
};

type EditValuesType = {
  cassete_A: number;
  cassete_B: number;
  cassete_C: number;
  cassete_D: number;
};

export default function OpenEdit() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [openOSSelected, setOpenOSSelected] = useState<OsOpenType>();
  const [orderSelected, setOrderSelected] = useState<orderType>();
  const [editValues, setEditValues] = useState<EditValuesType>({
    cassete_A: 0,
    cassete_B: 0,
    cassete_C: 0,
    cassete_D: 0,
  });

  useEffect(() => {
    if (!id) return;

    (async () => {
      const response = await getOSById(id);
      setOpenOSSelected(response.data.openos);
      console.log("OS", response);
      if (
        response.status === 300 ||
        response.status === 400 ||
        response.status === 500
      ) {
        toast.error("Erro ao buscar OS!");
        return;
      }

      const responseSupply = await getSupplyForOS(response.data.openos.id_supply);
      console.log("order", responseSupply);
      if (
        responseSupply.status === 300 ||
        responseSupply.status === 400 ||
        responseSupply.status === 500
      ) {
        toast.error("Erro ao buscar abastecimento!");
        return;
      }

      setOrderSelected(responseSupply.data.supply[0]);

      setEditValues({
        cassete_A: 0,
        cassete_B: 0,
        cassete_C: 0,
        cassete_D: 0,
      });
    })();
  }, [id]);

  const currentTotal = useMemo(() => {
    if (!orderSelected) return 0;

    return (
      (orderSelected.cassete_A || 0) * 10 +
      (orderSelected.cassete_B || 0) * 20 +
      (orderSelected.cassete_C || 0) * 50 +
      (orderSelected.cassete_D || 0) * 100
    );
  }, [orderSelected]);

  const editTotal = useMemo(() => {
    return (
      (editValues.cassete_A || 0) * 10 +
      (editValues.cassete_B || 0) * 20 +
      (editValues.cassete_C || 0) * 50 +
      (editValues.cassete_D || 0) * 100
    );
  }, [editValues]);

  const handleChange = (value: string, cedula: number) => {
    const numericValue = Number(value.replace(/\D/g, "")) || 0;

    setEditValues((prev) => {
      switch (cedula) {
        case 10:
          return { ...prev, cassete_A: numericValue };
        case 20:
          return { ...prev, cassete_B: numericValue };
        case 50:
          return { ...prev, cassete_C: numericValue };
        case 100:
          return { ...prev, cassete_D: numericValue };
        default:
          return prev;
      }
    });
  };

  const handleSave = async () => {
    if (!orderSelected) {
      toast.error("Sem dados para editar.");
      return;
    }

    if(editValues.cassete_A === 0 && editValues.cassete_B === 0 && editValues.cassete_C === 0 && editValues.cassete_D === 0) {
      toast.error("Os não podem está todos zerados!");
      return
    }

    const payload = {
      id_os : openOSSelected?.id,
      id_supply: orderSelected.id,
      id_order: orderSelected.id_order,
      id_atm : orderSelected.id_atm,
      id_treasury : orderSelected.id_treasury,
      os : openOSSelected?.os,
      cassete_A: editValues.cassete_A,
      cassete_B: editValues.cassete_B,
      cassete_C: editValues.cassete_C,
      cassete_D: editValues.cassete_D,
    };

    console.log("payload para enviar ao backend:", payload);

    const response = await AlterSupply(payload)
    if (response.status === 200) {
      toast.success("Atualizado com sucesso!")
    } else {
      toast.error("Erro ao atualizar!")
    }
  };

  if (!id) {
    return (
      <Page>
        <TitlePages linkBack="/supply/open" icon={faParachuteBox}>
          Editar OS
        </TitlePages>
        <div className="flex flex-col gap-4 p-5 w-full">
          <div className="flex flex-col gap-5 w-1/3">
            Sem ID de OS para continuar!
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <TitlePages linkBack="/supply/open" icon={faParachuteBox}>
        Editar OS
      </TitlePages>

      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-4">
          <label className="text-md uppercase">Informações Gerais</label>

          <BoxInfo className="flex-row gap-3 justify-between p-3">
            <BoxInternalInfo
              label="ID ABASTECIMENTO: "
              value={String(orderSelected?.id ?? "")}
            />

            <BoxInternalInfo
              label="TRANSPORTADORA: "
              value={`${String(orderSelected?.id_treasury ?? "")} - ${String(orderSelected?.treasury_name ?? "")}`}
            />

            <BoxInternalInfo
              label="TERMINAL: "
              value={`${String(orderSelected?.id_atm ?? "")} - ${String(orderSelected?.atm_name ?? "")}`}
            />

            <BoxInternalInfo
              label="ID PEDIDO: "
              value={String(orderSelected?.id_order ?? "")}
            />
          </BoxInfo>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-md uppercase">Informações do abastecimento</label>

          <BoxInfo className="flex-row">
            <div className="flex-1 p-4">
              <label className="text-md font-bold uppercase">
                Valores atual
              </label>

              <div className="flex gap-2 p-2 justify-center items-center bg-zinc-800 w-full rounded">
                <div className="text-lg text-white">R$ 10,00</div>
                <input
                  className="text-lg h-9 rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
                  value={String(orderSelected?.cassete_A ?? "")}
                  disabled
                />
              </div>

              <div className="flex gap-2 p-2 justify-center items-center bg-zinc-800 w-full rounded">
                <div className="text-lg text-white">R$ 20,00</div>
                <input
                  className="text-lg h-9 rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
                  value={String(orderSelected?.cassete_B ?? "")}
                  disabled
                />
              </div>

              <div className="flex gap-2 p-2 justify-center items-center bg-zinc-800 w-full rounded">
                <div className="text-lg text-white">R$ 50,00</div>
                <input
                  className="text-lg h-9 rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
                  value={String(orderSelected?.cassete_C ?? "")}
                  disabled
                />
              </div>

              <div className="flex gap-2 p-2 justify-center items-center bg-zinc-800 w-full rounded">
                <div className="text-lg text-white">R$ 100,00</div>
                <input
                  className="text-lg h-9 rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
                  value={String(orderSelected?.cassete_D ?? "")}
                  disabled
                />
              </div>

              <div className="flex gap-2 p-2 justify-center items-center bg-zinc-800 w-full rounded">
                <div className="text-lg text-white">TOTAL</div>
                <div className="text-lg text-white">
                  {generateFullReal(currentTotal)}
                </div>
              </div>
            </div>

            <div className="flex-1 p-4">
              <label className="text-md font-bold uppercase">
                Alteração
              </label>

              <div className="flex gap-2 p-2 justify-center items-center bg-zinc-800 w-full rounded">
                <div className="text-lg text-white">R$ 10,00</div>
                <input
                  type="number"
                  className="text-lg h-9 rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
                  value={String(editValues.cassete_A)}
                  onChange={(e) => handleChange(e.target.value, 10)}
                />
              </div>

              <div className="flex gap-2 p-2 justify-center items-center bg-zinc-800 w-full rounded">
                <div className="text-lg text-white">R$ 20,00</div>
                <input
                  type="number"
                  className="text-lg h-9 rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
                  value={String(editValues.cassete_B)}
                  onChange={(e) => handleChange(e.target.value, 20)}
                />
              </div>

              <div className="flex gap-2 p-2 justify-center items-center bg-zinc-800 w-full rounded">
                <div className="text-lg text-white">R$ 50,00</div>
                <input
                  type="number"
                  className="text-lg h-9 rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
                  value={String(editValues.cassete_C)}
                  onChange={(e) => handleChange(e.target.value, 50)}
                />
              </div>

              <div className="flex gap-2 p-2 justify-center items-center bg-zinc-800 w-full rounded">
                <div className="text-lg text-white">R$ 100,00</div>
                <input
                  type="number"
                  className="text-lg h-9 rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
                  value={String(editValues.cassete_D)}
                  onChange={(e) => handleChange(e.target.value, 100)}
                />
              </div>

               <div className="flex gap-2 p-2 justify-center items-center bg-zinc-800 w-full rounded mb-3">
                <div className="text-lg text-white">TOTAL</div>
                <div className="text-lg text-white">
                  {generateFullReal(editTotal)}
                </div>
              </div>

                <Button
                color="#2E8B57"
                onClick={handleSave}
                size="medium"
                textColor="white"
                variant="primary"
              >
                Cadastrar
              </Button>
            </div>

            
          </BoxInfo>
          
        </div>
      </div>
    </Page>
  );
}