"use client"

import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";;
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getSupliesForNums, getTreasuriesForDate, saveIndividualSupply } from "@/app/service/supply";
import { Button } from "@/app/components/ui/Button";
import { faBroom, faDivide, faEdit, faParachuteBox, faReceipt, faSave, faTable, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OrderWithTreasuryProps } from "@/types/ordersSearchtype";
import { isValidDateString } from "@/app/utils/isValidDateString";
import { removeDuplicateInOrders } from "@/app/utils/removeDuplicateInOrders";
import { getAtmsForIdsTreasury } from "@/app/service/atm";
import { Input } from "@/app/components/ui/Input"
import { treasuryType } from "@/types/treasuryType";
import { getAll, getTreasuriesForIds } from "@/app/service/treasury";
import { getOrderForTreasuryId } from "@/app/service/order";
import { ButtonScreenOrder } from "@/app/components/ui/ButtonScreenOrder";
import { generateCurrency } from "@/app/utils/generateCurrency";
import { generateReal } from "@/app/utils/generateReal";
import { generateFullReal } from "@/app/utils/generateFullReal";
import { ModalTrocaTotal } from "@/app/components/ui/Modal/ModalTrocaTotal";
import { validatorDate } from "@/app/utils/validatorDate";
import { isPar } from "@/app/utils/isPar";
import { supplyType } from "@/types/supplyType";
import { formatDateToString } from "@/app/utils/formatDateToString";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { ModalOS } from "@/app/components/ui/Modal/ModalOS";


export type supplyProps = {
  id?: number;
  id_atm: number;
  id_order?: number;
  id_treasury: number;
  name: string;
  date: Date;
  date_on_supply?: string;
  short_name: string;
  total_exchange: boolean;
  cassete_A: number;
  cassete_B: number;
  cassete_C: number;
  cassete_D: number;
}

export type ordersWithTreasuriesProps = {
  id_order: number,
  id_type_operation: number;
  id_treasury_origin: number;
  id_treasury_destin: number;
  requested_value_A: number;
  requested_value_B: number;
  requested_value_C: number;
  requested_value_D: number;
  confirmed_value_A: number;
  confirmed_value_B: number;
  confirmed_value_C: number;
  confirmed_value_D: number;
  observation: string;
  status_order: number;
  composition_change: boolean;
  date_order: Date
}

export type atmForSupplyProps = {
  id: number;
  id_treasury: number;
  cassete_A: number;
  cassete_B: number;
  cassete_C: number;
  cassete_D: number;
  id_system: number;
  name: string;
  short_name: string
}

export default function SupplyAdd() {

  const [treasuries, setTreasuries] = useState<treasuryType[]>([])
  const [orders, setOrders] = useState<ordersWithTreasuriesProps[] | null>(null)
  const [atms, setAtms] = useState<atmForSupplyProps[] | null>(null)

  const [ordersSelected, setOrdersSelected] = useState<ordersWithTreasuriesProps[] | null>(null)
  const [atmsTreasurySelected, setAtmsTreasurySelected] = useState<atmForSupplyProps[]>([])
  const [idAtm, setIdAtm] = useState<string>("0");
  const [idTreasury, setIdTreasury] = useState<string>("0");

  const [suplies, setSuplies] = useState<supplyProps[] | null>([])
  const [suppliesSelected, setSuppliesSelected] = useState<Partial<supplyProps>[]>([]);

  const [valueA, setValueA] = useState<number>(0);
  const [valueB, setValueB] = useState<number>(0);
  const [valueC, setValueC] = useState<number>(0);
  const [valueD, setValueD] = useState<number>(0);
  const [trocaTotal, setTrocaTotal] = useState<boolean>(false);
  const [dateForOS, setDateForOS] = useState<string>("");


  const [dateSelected, setDateSelected] = useState<string>("");
  const [orderInUse, setOrderInUse] = useState<ordersWithTreasuriesProps | null>(null)
  const [loading, setLoading] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);
  const [showModalOS, setShowModalOS] = useState(false);


  const getTreasury = async (ids: number[]) => {
    const t = await getTreasuriesForIds(ids);
    if (t) {
      return t
    }
    return null;
  };

  const getOrderByIdSystem = async (id: number) => {
    if (!orders) return null;

    const encontrados = orders.filter(order => order.id_treasury_destin === id);
    setOrdersSelected(encontrados)
  };

  const getOrderByTreasuryDestin = (orders: ordersWithTreasuriesProps[], id: number): ordersWithTreasuriesProps | null => {
    const encontrado = orders.find(order => order.id_treasury_destin === id);
    return encontrado || null;
  }

  const calcularTotal = (order?: ordersWithTreasuriesProps | null): number => {
    if (!order) return 0;

    if (suppliesSelected.length === 0) {
      const {
        confirmed_value_A,
        confirmed_value_B,
        confirmed_value_C,
        confirmed_value_D,
        requested_value_A,
        requested_value_B,
        requested_value_C,
        requested_value_D,
      } = order;

      return (
        (confirmed_value_A > 0 ? confirmed_value_A : requested_value_A) * 10 +
        (confirmed_value_B > 0 ? confirmed_value_B : requested_value_B) * 20 +
        (confirmed_value_C > 0 ? confirmed_value_C : requested_value_C) * 50 +
        (confirmed_value_D > 0 ? confirmed_value_D : requested_value_D) * 100
      );
    }

    return (
      handleGenerateEmTesouraria(
        orderInUse?.confirmed_value_A as number > 0 ? orderInUse?.confirmed_value_A as number : orderInUse?.requested_value_A as number,
        10) * 10 +
      handleGenerateEmTesouraria(
        orderInUse?.confirmed_value_B as number > 0 ? orderInUse?.confirmed_value_B as number : orderInUse?.requested_value_B as number,
        20) * 20 +
      handleGenerateEmTesouraria(
        orderInUse?.confirmed_value_C as number > 0 ? orderInUse?.confirmed_value_C as number : orderInUse?.requested_value_C as number,
        50) * 50 +
      handleGenerateEmTesouraria(
        orderInUse?.confirmed_value_D as number > 0 ? orderInUse?.confirmed_value_D as number : orderInUse?.requested_value_D as number,
        100) * 100
    )
  };

  const getTreasuriesInorder = async () => {
    setLoading(true);
    setValueA(0);
    setValueB(0);
    setValueC(0);
    setValueD(0);
    if (!dateSelected || dateSelected === "") {
      setOrders(null);
      setAtmsTreasurySelected([]);
      setOrderInUse(null);
      toast.error("Selecione uma data válida para buscar os pedidos.");
      setLoading(false);
      return
    }

    if (isValidDateString(dateSelected) === false) {
      setOrders(null);
      setAtms(null);
      setOrderInUse(null);
      setAtmsTreasurySelected([]);
      toast.error("Data inválida, verifique o formato (DD/MM/YYYY).");
      setLoading(false);
      return;

    }

    const treasuryInOrder = await getTreasuriesForDate(dateSelected);
    if (treasuryInOrder.status === 400 || treasuryInOrder.status === 500 || treasuryInOrder.status === 300) {
      setOrders(null);
      setAtms(null);
      setAtmsTreasurySelected([]);
      setOrderInUse(null);
      toast.error("Erro na reqquisição, tente novamente mais tarde.");
      setLoading(false);
      return;
    }
    if (treasuryInOrder.data !== undefined) {
      const orders: ordersWithTreasuriesProps[] = treasuryInOrder.data.treasury;
      setOrders(orders)
      const ids = removeDuplicateInOrders(orders)

      const numOrders = orders.map(order => order.id_order);
      const allSupplies = await getSupliesForNums(numOrders)
      if (allSupplies.data !== undefined) {
        setSuplies(allSupplies.data.supply);
        let sSelected: supplyType[] = [];
        if (orderInUse) {
          sSelected = allSupplies.data.supply.filter(
            (supply: supplyType) =>
              supply.id_treasury === orderInUse.id_treasury_destin &&
              supply.id_order === orderInUse.id_order
          )
          console.log("sSelected", sSelected);
          if (sSelected.length > 0) setSuppliesSelected(sSelected);
        }
      }
      if (ids) {
        const atms = await getAtmsForIdsTreasury(ids);
        if (atms.status === 3400 || atms.status === 400 || atms.status === 500) {
          toast.error("Erro ao buscar os dados dos atms, tente novamente mais tarde.");
          return
        }
        if (atms.data !== undefined) {
          setIdTreasury(ids[0].toString());
          selectedAtmsForChangeTreasury(ids[0].toString());
          setIdAtm(atms.data.atm[0].id_system.toString());
          getOrderByIdSystem(ids[0])
          handleSelectChangeOrder(ids[0])
          setOrderInUse(getOrderByTreasuryDestin(orders, ids[0]))
          setAtms(atms.data.atm)
          const t = await getTreasury(ids)
          setTreasuries(t.data.treasury)
          setLoading(false);
          return
        }
      }
    }
    setOrders(null);
    setAtms(null);
    setOrderInUse(null);
    toast.error("Erro ao buscar os dados, tente novamente mais tarde.");
    setLoading(false);
    return
  }

  const selectedAtmsForChangeTreasury = (value: string) => {
    if (!atms) return;
    const selecionados = atms.filter((atm) => atm.id_treasury === Number(value));
    setAtmsTreasurySelected(selecionados)
    setIdAtm(selecionados[0].id_system.toString());
  }

  const selectSuppliesForChangeTreasury = (id_treasury: number, order: number) => {
    if (!suplies) return;
    const selecionados = suplies?.filter((supply) => supply.id_treasury === id_treasury && supply.id_order === order)
    setSuppliesSelected(selecionados);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value) || "";
    setIdTreasury(value.toString());
    selectedAtmsForChangeTreasury(value.toString());
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIdTreasury(event.target.value.toString());
    selectedAtmsForChangeTreasury(event.target.value.toString());
    getOrderByIdSystem(Number(event.target.value))
    setOrderInUse(getOrderByTreasuryDestin(orders as [], Number(event.target.value)));
    let newOder = getOrderByTreasuryDestin(orders as [], Number(event.target.value))
    selectSuppliesForChangeTreasury(Number(event.target.value), newOder?.id_order || 0);
    setValueA(0);
    setValueB(0);
    setValueC(0);
    setValueD(0);
    setTrocaTotal(false);
  };

  // Atualiza o estado ao selecionar no select
  const handleSelectChangeAtm = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIdAtm(event.target.value.toString());
  };

  const handleInputChangeAtm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value) || "";
    setIdAtm(value.toString());
  };

  const handleSelectChangeOrder = (id: number) => {
    if (!ordersSelected) return null;

    const encontrado = ordersSelected.filter(order => order.id_order === id);
    if (encontrado.length > 0) {
      selectSuppliesForChangeTreasury(encontrado[0].id_treasury_destin, encontrado[0].id_order)
      setOrderInUse(encontrado[0])
    } else {
      setOrderInUse(null);
    }

  };

  {/** ação dos botoes  */ }
  const handleButtonDivider = () => {
    setLoading(true)
    let qtAtms = atmsTreasurySelected?.length ?? 1
    let valueA = (orderInUse?.confirmed_value_A ?? 0 > 0) ? orderInUse?.confirmed_value_A : orderInUse?.requested_value_A as number
    let valueB = (orderInUse?.confirmed_value_B ?? 0 > 0) ? orderInUse?.confirmed_value_B : orderInUse?.requested_value_B as number
    let valueC = (orderInUse?.confirmed_value_C ?? 0 > 0) ? orderInUse?.confirmed_value_C : orderInUse?.requested_value_C as number
    let valueD = (orderInUse?.confirmed_value_D ?? 0 > 0) ? orderInUse?.confirmed_value_D : orderInUse?.requested_value_D as number

    if (qtAtms > 1) {
      if (isPar(valueA as number) && isPar(valueB as number) && isPar(valueC as number) && isPar(valueD as number)) {
        if (validatorDate(dateForOS)) {
          setShowModal(true);
        } else {
          toast.error('Digite uma data váldia para conntinuar!')
          setLoading(false);
          return
        }
      } else {
        toast.error('Os valores precisam ser par para essa função!')
      }
    }

  }

  const handleSaveIndovidual = async () => {
    setLoading(true)

    if (valueA === 0 && valueB === 0 && valueC === 0 && valueD === 0) {
      toast.error("Preencha pelo menos um valor para continuar!")
      setLoading(false);
      return
    }
    if (!validatorDate(dateForOS)) {
      toast.error('Digite uma data váldia para conntinuar!')
      setLoading(false);
      return
    }
    const data: Partial<supplyProps> = {
      id_order: orderInUse?.id_order as number,
      id_treasury: orderInUse?.id_treasury_destin as number,
      id_atm: parseInt(idAtm),
      cassete_A: valueA ?? 0,
      cassete_B: valueB ?? 0,
      cassete_C: valueC ?? 0,
      cassete_D: valueD ?? 0,
      date_on_supply: dateForOS,
      total_exchange: trocaTotal,
      date: orderInUse?.date_order as Date,
    }

    const saveSupply = await saveIndividualSupply(data)
    if (saveSupply.status === 400 || saveSupply.status === 500 || saveSupply.status === 300) {
      toast.error(saveSupply.message)
      setLoading(false);
      return
    }
    if (saveSupply.data !== undefined) {
      toast.success("Abastecimento adicionado com sucesso!")
      getTreasuriesInorder()
      setLoading(false);
      return
    }
    toast.error("Erro ao adicionar o abastecimento, tente novamente mais tarde!")
    setLoading(false);
    return
  }

  const handleChangeSuplies = (e: React.ChangeEvent<HTMLInputElement>, type: number) => {
    if (type === 10) {
      let solicitado = ((orderInUse?.confirmed_value_A ?? 0 > 0) ? orderInUse?.confirmed_value_A : orderInUse?.requested_value_A) as number
      let digitado = parseInt(e.target.value !== "" ? e.target.value : "0")
      if (solicitado < digitado) {
        toast.error("Valor digitado maior que o solicitado, tente novamente")
        return
      } else {
        setValueA(digitado);
        return
      }
    } else if (type === 20) {
      let solicitado = ((orderInUse?.confirmed_value_B ?? 0 > 0) ? orderInUse?.confirmed_value_B : orderInUse?.requested_value_B) as number
      let digitado = parseInt(e.target.value !== "" ? e.target.value : "0")
      if (solicitado < digitado) {
        toast.error("Valor digitado maior que o solicitado, tente novamente")
        return
      } else {
        setValueB(digitado);
        return
      }

    } else if (type === 50) {
      let solicitado = ((orderInUse?.confirmed_value_C ?? 0 > 0) ? orderInUse?.confirmed_value_C : orderInUse?.requested_value_C) as number
      let digitado = parseInt(e.target.value !== "" ? e.target.value : "0")
      if (solicitado < digitado) {
        toast.error("Valor digitado maior que o solicitado, tente novamente")
        return
      } else {
        setValueC(digitado);
        return
      }
    } else if (type === 100) {
      let solicitado = ((orderInUse?.confirmed_value_D ?? 0 > 0) ? orderInUse?.confirmed_value_D : orderInUse?.requested_value_D) as number
      let digitado = parseInt(e.target.value !== "" ? e.target.value : "0")
      if (solicitado < digitado) {
        toast.error("Valor digitado maior que o solicitado, tente novamente")
        return
      } else {
        setValueD(digitado);
        return
      }
    }
  }

  const handleSetDateForOs = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    let value = e.target.value
    setDateForOS(value)
  }

  const handleCloseModal = () => {
    setLoading(false);
    setShowModal(false)
    getTreasuriesInorder()

  }

  const hanldeEditSupply = async (id: number) => {
    alert("Funcionalidade em desenvolvimento, aguarde! " + id)
  }

  const handleDelSupply = async (id: number) => {
    alert("Funcionalidade em desenvolvimento, aguarde! " + id)
  }

  const handleGenerateEmTesouraria = (valorTesouraria: number, typeCassete: number) => {
    let valor = 0
    if (suppliesSelected.length > 0) {
      suppliesSelected.map((supply) => {
        switch (typeCassete) {
          case 10:
            valor += supply.cassete_A as number
            break;
          case 20:
            valor += supply.cassete_B as number
            break;
          case 50:
            valor += supply.cassete_C as number
            break;
          case 100:
            valor += supply.cassete_D as number
            break;
        }
      })
      return valorTesouraria - valor
    }
    return valorTesouraria
  }

  const handleCleanButton = () => {
    setValueA(0);
    setValueB(0);
    setValueC(0);
    setValueD(0);
    setTrocaTotal(false);
  }

  const handleGenerateOS = () => {
    setLoading(true);
    setShowModalOS(true)
  }

  const handleCloseModalOS = () => {    //funcionalidade em desenvolvimento
    setLoading(false);
    setShowModalOS(false)
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

        {orders && orders.length > 0 && (
          <div className="w-full flex-col  gap-4flex p-2 border-t-2 border-zinc-400 ">

            <div className="flex-1 flex  flex-col gap-4">

              <div className="flex flex-row justify-between gap-10">
                {/**  campos de ajuste */}
                <div className="flex flex-col gap-5">

                  <div className="flex flex-col gap-5">
                    <label className="uppercase leading-3 font-bold">
                      Transportadora
                    </label>
                    <div className="flex gap-2">
                      <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
                        <input
                          value={idTreasury}
                          onChange={handleInputChange}
                          className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                        />
                      </div>
                      <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-80 h-11 text-lg`} >
                        <select
                          className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm"
                          value={idTreasury}
                          onChange={handleSelectChange}
                        >
                          {treasuries.map((treasury) => (
                            <option key={treasury.id} value={treasury.id_system} className="uppercase bg-slate-700 text-white">
                              {treasury.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <label className="uppercase leading-3 font-bold">
                      Atms
                    </label>
                    <div className="flex gap-2">
                      <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
                        <input
                          value={idAtm}
                          onChange={handleInputChangeAtm}
                          className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                        />
                      </div>
                      <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-80 h-11 text-lg`} >
                        <select
                          className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm"
                          value={idAtm}
                          onChange={handleSelectChangeAtm}
                        >
                          {atmsTreasurySelected?.map((atm) => (
                            <option key={atm.id_system} value={atm.id_system} className="uppercase bg-slate-700 text-white">
                              {atm.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 ">
                    <div className="font-bold text-xl uppercase">Lote: </div>
                    <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-full h-11 text-lg`} >
                      <select
                        className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm"
                        onChange={(e) => handleSelectChangeOrder(parseInt(e.target.value))}
                      >
                        {ordersSelected?.map((order) => (
                          <option key={order.id_order} value={order.id_order} className="uppercase bg-slate-700 text-white">
                            {order.id_order}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <label className="font-bold text-xl uppercase">Data para atendimento</label>
                    <div className="flex  bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-full text-lg">
                      <input
                        type="date"
                        className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                        value={dateForOS}
                        onChange={handleSetDateForOs}
                      />
                    </div>
                  </div>
                </div>

                {/** campos do pedido */}
                <div className="flex flex-row items-center flex-1">
                  <div className=" w-[300px] flex flex-col gap-5 justify-center items-center border-2 border-zinc-600 rounded-md pr-2 pl-2">
                    <h4 className="font-bold text-xl uppercase">Em Tesouraria</h4>
                    <div className="flex gap-2 p-1 justify-between bg-zinc-800 w-full">
                      <div className="text-xl flex-1">R$ 10,00</div>
                      <div className="text-xl text-center flex-1">
                        {
                          handleGenerateEmTesouraria(
                            orderInUse?.confirmed_value_A as number > 0 ? orderInUse?.confirmed_value_A as number : orderInUse?.requested_value_A as number,
                            10)
                        }
                      </div>
                      <div className="text-xl flex-1">
                        {generateReal(
                          handleGenerateEmTesouraria(
                            orderInUse?.confirmed_value_A as number > 0 ? orderInUse?.confirmed_value_A as number : orderInUse?.requested_value_A as number,
                            10), 10)}
                      </div>
                    </div>
                    <div className="flex gap-2 p-0.5  justify-between  w-full">
                      <div className="text-xl flex-1">R$ 20,00</div>
                      <div className="text-xl text-center flex-1">
                        {
                          handleGenerateEmTesouraria(
                            orderInUse?.confirmed_value_B as number > 0 ? orderInUse?.confirmed_value_B as number : orderInUse?.requested_value_B as number,
                            20)
                        }
                      </div>
                      <div className="text-xl flex-1">
                        {generateReal(
                          handleGenerateEmTesouraria(
                            orderInUse?.confirmed_value_B as number > 0 ? orderInUse?.confirmed_value_B as number : orderInUse?.requested_value_B as number,
                            20), 20)}
                      </div>
                    </div>
                    <div className="flex gap-2 p-0.5  justify-between bg-zinc-800  w-full">
                      <div className="text-xl flex-1">R$ 50,00</div>
                      <div className="text-xl text-center flex-1">
                        {
                          handleGenerateEmTesouraria(
                            orderInUse?.confirmed_value_C as number > 0 ? orderInUse?.confirmed_value_C as number : orderInUse?.requested_value_C as number,
                            50)
                        }
                      </div>
                      <div className="text-xl flex-1">
                        {generateReal(
                          handleGenerateEmTesouraria(
                            orderInUse?.confirmed_value_C as number > 0 ? orderInUse?.confirmed_value_C as number : orderInUse?.requested_value_C as number,
                            50), 50)}
                      </div>
                    </div>
                    <div className="flex gap-2 p-0.5  justify-between  w-full">
                      <div className="text-xl flex-1">R$ 100,00</div>
                      <div className="text-xl text-center flex-1">
                        {
                          handleGenerateEmTesouraria(
                            orderInUse?.confirmed_value_D as number > 0 ? orderInUse?.confirmed_value_D as number : orderInUse?.requested_value_D as number,
                            100)
                        }
                      </div>
                      <div className="text-xl flex-1">
                        {generateReal(
                          handleGenerateEmTesouraria(
                            orderInUse?.confirmed_value_D as number > 0 ? orderInUse?.confirmed_value_D as number : orderInUse?.requested_value_D as number,
                            100), 100)}
                      </div>
                    </div>
                    <div className="flex gap-2 p-0.5  justify-between bg-zinc-800  w-full font-bold">
                      <div className="text-xl">TOTAL</div>
                      <div className="text-xl">
                        {calcularTotal(orderInUse).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </div>
                    </div>
                  </div>
                </div>
                {/**  campos observação */}
                <div className="flex flex-col items-center flex-1 p-3 gap-2 border border-zinc-400 rounded-md">
                  <label className="font-bold text-xl uppercase">Obs. para atendimento</label>
                  <textarea
                    className="flex-1 w-full outline-none border-2 border-zinc-600 bg-zinc-700 p-2 rounded-md font-bold text-white"
                    readOnly value={orderInUse?.observation ?? "Sem observação!"}
                  />
                </div>
                {/**  campos abastecimento */}
                <div className="flex flex-row items-center flex-1">
                  <div className=" w-[300px] flex flex-col gap-5 justify-center items-center border-2 border-zinc-600 rounded-md pr-2 pl-2">
                    <h4 className="font-bold text-xl uppercase">Abastecimento</h4>
                    <div className="flex gap-2 p-1 items-center  bg-zinc-800 w-full">
                      <input type="checkbox" checked={trocaTotal} onChange={(e) => setTrocaTotal(e.target.checked)} />
                      <label className="uppercase text-sm">Troca total</label>
                    </div>
                    <div className="flex gap-2 p-1 justify-between bg-zinc-800 w-full">
                      <div className="text-xl">R$ 10,00</div>
                      <input
                        className="text-xl h-8 w-[100px] rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center"
                        value={valueA}
                        onChange={(e) => { handleChangeSuplies(e, 10) }}
                      />
                      <div className="text-xl">
                        {generateReal(valueA as number, 10)}
                      </div>
                    </div>
                    <div className="flex gap-2 p-0.5  justify-between  w-full">
                      <div className="text-xl">R$ 20,00</div>
                      <input
                        className="text-xl h-8 w-[100px] rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center"
                        value={valueB}
                        onChange={(e) => { handleChangeSuplies(e, 20) }}
                      />
                      <div className="text-xl">
                        {generateReal(valueB as number, 10)}
                      </div>
                    </div>
                    <div className="flex gap-2 p-0.5  justify-between bg-zinc-800  w-full">
                      <div className="text-xl">R$ 50,00</div>
                      <input
                        className="text-xl h-8 w-[100px] rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center"
                        value={valueC}
                        onChange={(e) => { handleChangeSuplies(e, 50) }}
                      />
                      <div className="text-xl">
                        {generateReal(valueC as number, 10)}
                      </div>
                    </div>
                    <div className="flex gap-2 p-0.5  justify-between  w-full">
                      <div className="text-xl">R$ 100,00</div>
                      <input
                        className="text-xl h-8 w-[100px] rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center"
                        value={valueD}
                        onChange={(e) => { handleChangeSuplies(e, 100) }}
                      />
                      <div className="text-xl">
                        {generateReal(valueD as number, 10)}
                      </div>
                    </div>
                    <div className="flex gap-2 p-0.5  justify-between bg-zinc-800  w-full font-bold">
                      <div className="text-xl">TOTAL</div>
                      <div className="text-xl">
                        {generateFullReal(
                          (valueA * 10) +
                          (valueB * 20) +
                          (valueC * 50) +
                          (valueD * 100)
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              {/**  Linha de botoes */}
              <div className="flex flex-row justify-center gap-5">
                {atmsTreasurySelected.length > 1 &&
                  <ButtonScreenOrder
                    size="btn-icon-text"
                    color="#1E3A8A"
                    secondaryColor="#3B82F6"
                    textColor="white"
                    onClick={handleButtonDivider}
                    icon={faDivide}
                  >Dividir</ButtonScreenOrder>
                }
                <ButtonScreenOrder
                  size="btn-icon-text"
                  color="#1E3A8A"
                  secondaryColor="#3B82F6"
                  textColor="white"
                  onClick={handleSaveIndovidual}
                  icon={faSave}
                >Salvar</ButtonScreenOrder>

                <ButtonScreenOrder
                  size="btn-icon-text"
                  color="#1E3A8A"
                  secondaryColor="#3B82F6"
                  textColor="white"
                  onClick={handleCleanButton}
                  icon={faBroom}
                >Limpar</ButtonScreenOrder>

                <ButtonScreenOrder
                  size="btn-icon-text"
                  color="#22C55E"
                  secondaryColor="#15803D"
                  textColor="white"
                  onClick={handleGenerateOS}
                  icon={faTable}
                >Gerar Oss</ButtonScreenOrder>
              </div>
            </div>
            {/**  Lado das OSs */}
            {suppliesSelected.length > 0 && (
              <div className="flex-1 w-full border-t-4 border-zinc-600 mt-2 p-2">
                <div>
                  <input type="checkbox" className="mr-2" />
                  <label className="font-bold text-lg">Ver todas</label>
                </div>
                <div>
                  <table className="w-full border border-gray-300 text-left">
                    <thead className="bg-gray-800 text-center" >
                      <tr>
                        <th className="border border-gray-300 px-4 py-2" >ID</th>
                        <th className="border border-gray-300 px-4 py-2" >Lote</th>
                        <th className="border border-gray-300 px-4 py-2">Terminal</th>
                        <th className="border border-gray-300 px-4 py-2">Troca total</th>
                        <th className="border border-gray-300 px-4 py-2">Data</th>
                        <th className="border border-gray-300 px-4 py-2">R$ 10,00</th>
                        <th className="border border-gray-300 px-4 py-2">R$ 20,00</th>
                        <th className="border border-gray-300 px-4 py-2">R$ 50,00</th>
                        <th className="border border-gray-300 px-4 py-2">R$ 100,00</th>
                        <th className="border border-gray-300 px-4 py-2">Total</th>
                        <th className="border border-gray-300 px-4 py-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliesSelected.map((supply, index) => (
                        <tr key={index} className=" text-center hover:bg-zinc-800 ">
                          <td className="border border-gray-300 px-2 py-1">{supply.id}</td>
                          <td className="border border-gray-300 px-2 py-1">{supply.id_order}</td>
                          <td className="border border-gray-300 px-2 py-1">{supply.id_atm}</td>
                          <td className="border border-gray-300 px-2 py-1">{supply.total_exchange === true ? 'Sim' : 'Nao'}</td>
                          <td className="border border-gray-300 px-2 py-1">{formatDateToString(supply.date_on_supply?.toString() as string)}</td>
                          <td className="border border-gray-300 px-2 py-1">{supply.cassete_A}</td>
                          <td className="border border-gray-300 px-2 py-1">{supply.cassete_B}</td>
                          <td className="border border-gray-300 px-2 py-1">{supply.cassete_C}</td>
                          <td className="border border-gray-300 px-2 py-1">{supply.cassete_D}</td>
                          <td className="border border-gray-300 px-2 py-1">{
                            generateRealTotal(supply.cassete_A ?? 0, supply.cassete_B ?? 0, supply.cassete_C ?? 0, supply.cassete_D ?? 0)
                          }</td>
                          <td className="border border-gray-300 px-2 py-1 flex items-center justify-center gap-4">
                            <ButtonScreenOrder
                              size="btn-icon"
                              color="#1E3A8A"
                              secondaryColor="#3B82F6"
                              textColor="white"
                              onClick={() => hanldeEditSupply(supply.id as number)}
                              icon={faEdit}
                            />

                            <ButtonScreenOrder
                              size="btn-icon"
                              color="#DC2626"
                              secondaryColor="#F87171"
                              textColor="white"
                              onClick={() => handleDelSupply(supply.id as number)}
                              icon={faTrashCan}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    {
      showModal && <ModalTrocaTotal
        dateForOS={dateForOS}
        atmsSelected={atmsTreasurySelected}
        orderUsed={orderInUse}
        onClose={handleCloseModal}
      />
    }
    {
      showModalOS && <ModalOS
        close={handleCloseModalOS}
        data={suplies as []}
        atms={atms as []}
        treasuries={treasuries as []}
        /> 
    }
    {loading && <Loading />}
  </Page >
}