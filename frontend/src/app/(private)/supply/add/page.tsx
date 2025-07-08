"use client"

import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";;
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getTreasuriesForDate } from "@/app/service/supply";
import { Button } from "@/app/components/ui/Button";
import { faParachuteBox } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast } from "sonner";
import { OrderWithTreasuryProps } from "@/types/ordersSearchtype";
import { isValidDateString } from "@/app/utils/isValidDateString";


type atmProps = {
  id_atm: number;
  id_treasury: number;
  name: string;
  short_name: string;
  check: boolean;
  type: 'COMPLEMENTAR' | 'RECOLHIMENTO TOTAL' | 'TROCA TOTAL';
  cass_A: number;
  cass_B: number;
  cass_C: number;
  cass_D: number;
}

type orderProps = {
  id: number;
  id_type_operation: number;
  id_trasury: number;
  cass_A: number;
  cass_B: number;
  cass_C: number;
  cass_D: number;
}

export default function SupplyAdd() {

  const [infos, setInfos] = useState<OrderWithTreasuryProps[]>([])
  const [dateSelected, setDateSelected] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const getTreasuriesInorder = async () => {
    setLoading(true);
    console.log("dateSelected", dateSelected);
    if (!dateSelected || dateSelected === "") {
      toast.error("Selecione uma data válida para buscar os pedidos.");
      setLoading(false);
      return
    }

    if(isValidDateString(dateSelected) === false) {
      toast.error("Data inválida, verifique o formato (DD/MM/YYYY).");
      setLoading(false);
      return;

    }

    const treasuryInOrder = await getTreasuriesForDate(dateSelected);
    console.log("treasuryInOrder", treasuryInOrder);
    if(treasuryInOrder.status === 400 || treasuryInOrder.status === 500 || treasuryInOrder.status === 300)  {
      toast.error("Erro na reqquisição, tente novamente mais tarde.");
      setLoading(false);
      return;
    }
    if(treasuryInOrder.data !== undefined && treasuryInOrder.data.length > 0) {

      const orders: orderProps[] = treasuryInOrder.data;
      console.log("orders",orders);

    }
  }



  return <Page>
    <TitlePages linkBack="/supply" icon={faParachuteBox}>Adicionar Abastecimento</TitlePages>
    <div className="flex flex-col gap-4 p-5 w-full">
      <div className="flex flex-col gap-4">

        <div className="flex flex-col gap-5 max-w-[300px]">
          <label className="uppercase leading-3 font-bold">Data do Pedido</label>
          <input
            color="#DDDD"
            className="border border-gray-300 rounded p-2 w-full text-black text-center max-w-[300px]"
            placeholder="(DD/MM/YYYY)"
            type="date"
            value={dateSelected}
            onChange={(e) => setDateSelected(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-5 max-w-[300px]" >
          <Button color='#2E8B57' variant="primary" textColor='white' onClick={getTreasuriesInorder} size='medium'>Pesquisar</Button>
        </div>
      </div>
    </div>
    {loading && <Loading />}
  </Page>
}