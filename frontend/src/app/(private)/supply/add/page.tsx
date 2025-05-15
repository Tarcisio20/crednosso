"use client"

import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { ModalSupply } from "@/app/components/ux/ModalSuppy";
import { ModalTrocaTotal } from "@/app/components/ux/ModalTrocaTotal";
import { Page } from "@/app/components/ux/Page";
import { Pagination } from "@/app/components/ux/Pagination";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getAtmsForTreasury, getAtmsWithSupplyInDateAndTreasury } from "@/app/service/atm";
import { getAllOrdersForDate, getTreasuriesInOrder } from "@/app/service/order";
import { getSuppliesForNow, getSuppliesWithSupplyInDateAndTreasury, getSupplyForIdTreasury, saveIndividualSupply } from "@/app/service/supply";
import { getTreasuriesForIds } from "@/app/service/treasury";
import { generateReal } from "@/app/utils/generateReal";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { returnDayAtual } from "@/app/utils/returnDayAtual";
import { atmType } from "@/types/atmType";
import { orderType } from "@/types/orderType";
import { supplyForDayType } from "@/types/supplyForDayType";
import { treasuryType } from "@/types/treasuryType";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

type atmPage = {
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

type orderPage = {
  id: number;
  id_type_operation : number;
  id_trasury: number;
  cass_A: number;
  cass_B: number;
  cass_C: number;
  cass_D: number;
}

export default function Supply() {

  const [treasuries, setTreasuries] = useState<treasuryType[]>()
  const [atms, setAtms] = useState<atmPage[]>()
  const [filteredAtms, setFilteredAtms] = useState<atmPage[]>()
  const [filteredTreasury, setFilteredTreasury] = useState<treasuryType[]>()
  const [orders, setOrders] = useState<orderPage[]>([])
  const [orderFiltered, setOrderFiltered] = useState<orderPage[]>([])
  const [idTreasury, setIdTreasury] = useState('')
  const [dateSupply, setDateSupply] = useState('')
  const [supplyUnique, setSupplyUnique] = useState<orderPage[]>([])
  const [saveSupply, setSaveSuppy] = useState([])
  const [isPar, setIsPar] = useState(false)
  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false)
  const [currentDay, setCurrentDay] = useState('')
  const [modal, setModal] = useState(false)
  const [atmUnique, setAtmUnique] = useState<atmType | null>()
  const [supplyForDay, setSupplyForDay] = useState<supplyForDayType[]>([])
  const [modalTrocaTotal, setModalTrocaTotal] = useState(false)
  const [idAtmSupplied, setIdAtmSupplied] = useState()
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  const [cassA, setCassA] = useState("0")
  const [cassB, setCassB] = useState("0")
  const [cassC, setCassC] = useState("0")
  const [cassD, setCassD] = useState("0")

  const handleAll = () => {
    const treasuryId = parseInt(idTreasury);
    filterTreasury()
  }

  useEffect(() => {
    document.title = "Pedidos - Add | CredNosso";
    if (idTreasury) {
      handleAll()
    }
  }, [idTreasury, atms]);

  const handleTreasuriesForDateOrder = async () => {
    setError({ type: '', title: '', messege: '' })
    setLoading(true)
    if (dateSupply === '') {
      setError({ type: 'error', title: 'Error', messege: 'Prrencher o campo de data!' })
      setAtms([])
      setLoading(false)
      return
    }
    const orderAjusted: orderPage[] = []
    const idTreasuriesInOrderDate: any = await getTreasuriesInOrder(dateSupply)

    if (idTreasuriesInOrderDate.status === 300 || idTreasuriesInOrderDate.status === 400 || idTreasuriesInOrderDate.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, tente novamente!' })
      setAtms([])
      setLoading(false)
      return
    }

    idTreasuriesInOrderDate.data.order.map((item: any) => (
      orderAjusted.push({
        id : item.id,
        id_type_operation : item.id_type_operation,
        id_trasury: item.id_treasury_destin,
        cass_A: item.status_order === 1 ? item.requested_value_A : item.requested_value_A,
        cass_B: item.status_order === 1 ? item.requested_value_B : item.requested_value_B,
        cass_C: item.status_order === 1 ? item.requested_value_C : item.requested_value_C,
        cass_D: item.status_order === 1 ? item.requested_value_D : item.requested_value_D,
      })
    ))
    setOrderFiltered(orderAjusted)

    const treasuriesForIds = await getTreasuriesForIds(idTreasuriesInOrderDate.data.order)
    console.log("IDS", idTreasuriesInOrderDate.data.order)
    if (!treasuriesForIds?.data?.treasury) {
      setAtms([])
      setError({ type: 'error', title: 'Error', messege: 'Erro na busca por tesourarias, tente novamente!' })
      setLoading(false)
      return
    }
    const atmsWithSupply = []
    idTreasuriesInOrderDate.data.order.map(async(item : any) => {
      const atmsWithSupplies = await getSuppliesWithSupplyInDateAndTreasury(item.id_treasury_destin, { date : dateSupply })
     console.log(atmsWithSupplies)
    })
    
    if ([300, 400, 500].includes(treasuriesForIds)) {
      setAtms([])
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, Faça a busca por data novamente!' })
      setLoading(false)
      return
    }

    const uniqueTreasury = treasuriesForIds?.data?.treasury.reduce((acc: any, current: any) => {
      // Verifica se já existe no acumulador um item com o mesmo id_system
      if (!acc.some((item: any) => item.id_system === current.id_system)) {
        acc.push(current); // Se não existir, adiciona ao acumulador
      }
      return acc;
    }, []);


    if (treasuriesForIds.data.treasury.length === 0) {
      setAtms([])
      setError({ type: 'error', title: 'Error', messege: 'Sem pedidos a retornar!' })
      setLoading(false)
      return
    }
    setTreasuries(uniqueTreasury)
    setIdTreasury(treasuriesForIds.data.treasury[0].id_system)
    setSupplyUnique(orderAjusted.filter(item => item.id_trasury === treasuriesForIds.data.treasury[0].id_system))

    const atmsForTreasury = await getAtmsForTreasury(idTreasuriesInOrderDate.data.order)
    if (atmsForTreasury.status === 300 || atmsForTreasury.status === 400 || atmsForTreasury.status === 500) {
      setAtms([])
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, Faça a busca por data novamente!' })
      setLoading(false)
      return
    }
    if (atmsForTreasury.data.atm && atmsForTreasury.data.atm.length > 0) {

      const uniqueAtms = atmsForTreasury.data.atm.reduce((acc: any, current: any) => {
        // Verifica se já existe no acumulador um item com o mesmo id_system
        if (!acc.some((item: any) => item.id_system === current.id_system)) {
          acc.push(current); // Se não existir, adiciona ao acumulador
        }
        return acc;
      }, []);
      const atmsAjusted: any = []

      uniqueAtms.map((item: atmType) => (
        atmsAjusted.push({
          date_order : dateSupply,
          id_atm: item.id_system,
          id_treasury: item.id_treasury,
          name: item.name,
          short_name: item.short_name,
          check: false,
          type: 'COMPLEMENTAR',
          cass_A: 0,
          cass_B: 0,
          cass_C: 0,
          cass_D: 0,
        })
      ))
      const atmFiltered = atmsAjusted.filter((item: any) => item.id_treasury === treasuriesForIds.data.treasury[0].id_system)

      if (atmFiltered.length > 1) {
        const ord = orderFiltered.filter(item => item.id_trasury === treasuriesForIds.data.treasury[0].id_system)
        if (ord.length > 0) {
          const value = (ord[0].cass_A * 10) + (ord[0].cass_B * 20) + (ord[0].cass_C * 50) + (ord[0].cass_D * 100)
          if (value % 2 === 0) {
            setIsPar(true)
          } else {
            setIsPar(false)
          }
        }
      } else {
        setIsPar(false)
      }

      const suppliesNow = await getSuppliesForNow({ date: returnDayAtual() }, treasuriesForIds.data.treasury[0].id_system)
      if (suppliesNow.data !== undefined && suppliesNow.data.supply.length > 0) {
        setSupplyForDay(suppliesNow.data.supply)
      } else {
        setSupplyForDay([])
      }
      setAtms(atmsAjusted)
      setFilteredAtms(atmFiltered)
      await getSupplyForTreasury()
      setError({ type: '', title: '', messege: '' })
      setLoading(false)
      return
    } else {
      setAtms([])
      setError({ type: 'error', title: 'Error', messege: 'Erro ao filtrar atms' })
      setLoading(false)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value) || "";
    setIdTreasury(value.toString());
  };
  // Atualiza o estado ao selecionar no select
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIdTreasury(event.target.value.toString());
  };

  const filterTreasury = async () => {

    if (idTreasury) {

      setFilteredTreasury(treasuries?.filter(treasury => treasury.id_system === parseInt(idTreasury)))
      let aFiltered = atms?.filter((item: any) => item.id_treasury === parseInt(idTreasury)) as []
      if (aFiltered && aFiltered.length > 1) {
        let ord = orderFiltered.filter(item => item.id_trasury === parseInt(idTreasury))
        if (ord.length > 0) {
          const value = (ord[0].cass_A * 10) + (ord[0].cass_B * 20) + (ord[0].cass_C * 50) + (ord[0].cass_D * 100)
          if (value % 2 === 0) {
            setIsPar(true)
          } else {
            setIsPar(false)
          }
        }
      } else {
        setIsPar(false)
      }
      await getSupplyForTreasury()
      setFilteredAtms(aFiltered)
      setSupplyUnique(orderFiltered.filter(item => item.id_trasury === parseInt(idTreasury)))
      const suppliesNow = await getSuppliesForNow({ date: returnDayAtual() }, parseInt(idTreasury))
      if (suppliesNow.data !== undefined && suppliesNow.data.supply.length > 0) {
        setSupplyForDay(suppliesNow.data.supply)
      } else {
        setSupplyForDay([])
      }
    }
  }

  const getSupplyForTreasury = async () => {
    setError({ type: '', title: '', messege: '' })
    setLoading(true)
    const allSupplyForTreasury = await getSupplyForIdTreasury(parseInt(idTreasury))
    if ([300, 400, 500].includes(allSupplyForTreasury)) {
      setLoading(false)
      return
    }
    if (allSupplyForTreasury.data !== undefined && allSupplyForTreasury.data.supply.length > 0) {
      setSaveSuppy(allSupplyForTreasury.data.supply)
      setLoading(false)
    } else {
      setLoading(false)
      return
    }
  }

  const handleSave = () => {
    console.log("Filtrado", filteredAtms)
  }

  const saveIndividual = async () => {
    const atm : atmPage[] = filteredAtms?.filter(item => item.check === true) ?? []
    if (atm.length === 1) {
      if (cassA === "0" && cassB === "0" && cassC === "0" && cassD === "0") {
        setError({ type: 'error', title: 'Erro', messege: 'Preciso de algum valor para abasetcer ' })
        return
      }

      let data : atmPage = {
        id_atm : atm[0]?.id_atm,
        id_treasury : atm[0]?.id_treasury,
        name : atm[0]?.name,
        short_name : atm[0]?.short_name,
        check : atm[0]?.check,
        type : atm[0]?.type,
        cass_A : atm[0]?.cass_A,
        cass_B : atm[0]?.cass_B,
        cass_C : atm[0]?.cass_C,
        cass_D : atm[0]?.cass_D,
      }

      const supply = await saveIndividualSupply(data)
      console.log("add", supply)

    }else{
      setError({ type: 'error', title: 'Erro', messege: 'Preciso de um atm selecionado ' })
      return
    }

    console.log("Passei")
  }


  const handleCloseModalTrocaTotal = () => {
    setModalTrocaTotal(false)
  }


  const handleDiv = async () => {
    const confirmed = window.confirm("Tem certeza que deseja dividir o abastecimento?");
    if (!confirmed) {
      return
    }

    let cass_A = supplyUnique[0].cass_A / (filteredAtms ? filteredAtms?.length : 0)
    let cass_B = supplyUnique[0].cass_B / (filteredAtms ? filteredAtms?.length : 0)
    let cass_C = supplyUnique[0].cass_C / (filteredAtms ? filteredAtms?.length : 0)
    let cass_D = supplyUnique[0].cass_D / (filteredAtms ? filteredAtms?.length : 0)

    const updatedAtms = filteredAtms?.map((atm) => ({
      ...atm,
      cass_A,
      cass_B,
      cass_C,
      cass_D
    }));
    setFilteredAtms(updatedAtms);
    setModalTrocaTotal(true)
  }

  return (
    <Page>
      <TitlePages linkBack="/supply" icon={faAdd} >Adicionar Abastecimento</TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div>
          <div className="flex flex-col gap-5 w-1/3">
            <label className="text-lg uppercase">Data do pedido</label>
            <input
              type="date"
              value={dateSupply}
              onChange={(e) => setDateSupply(e.target.value)}
              className="w-full h-10 outline-none rounded-md text-black text-center uppercase"
            />
            <button onClick={handleTreasuriesForDateOrder} >Buscar</button>
          </div>
          <div className="flex flex-row gap-5 w-1/3">
            {treasuries && treasuries.length > 0 &&
              <div>
                <label className="uppercase leading-3 font-bold">Trasportadora</label>
                <div className="flex gap-2">
                  <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
                    <input
                      value={idTreasury}
                      onChange={handleInputChange}
                      className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                    />
                  </div>
                  <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                    <select
                      className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                      value={idTreasury}
                      onChange={handleSelectChange}
                    >
                      {treasuries && treasuries.map((item, index) => (
                        <option
                          className="uppercase bg-slate-700 text-white"
                          value={item.id_system} key={index} >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            }
            {supplyUnique && supplyUnique.length > 0 &&
              <div>
                <label className="uppercase leading-3 font-bold" >Saldo do pedido</label>
                <div className="flex gap-5 border border-gray-600 w-80 mb-2">
                  <label className="w-[106px]">R$ 10,00</label>
                  <label className="w-[106px]">{supplyUnique[0].cass_A ?? 0}</label>
                  <label className="w-[106px]" >{generateReal(supplyUnique[0].cass_A, 10)}</label>
                </div>
                <div className="flex gap-5 border border-gray-600 w-80  mb-2">
                  <label className="w-[106px]" >R$ 20,00</label>
                  <label className="w-[106px]" >{supplyUnique[0].cass_B}</label>
                  <label className="w-[106px]" >{generateReal(supplyUnique[0].cass_B, 20)}</label>
                </div>
                <div className="flex gap-5 border border-gray-600 w-80  mb-2">
                  <label className="w-[106px]" >R$ 50,00</label>
                  <label className="w-[106px]" >{supplyUnique[0].cass_C}</label>
                  <label className="w-[106px]" >{generateReal(supplyUnique[0].cass_C, 50)}</label>
                </div>
                <div className="flex gap-5 border border-gray-600 w-80  mb-2">
                  <label className="w-[106px]" >R$ 100,00</label>
                  <label className="w-[106px]" >{supplyUnique[0].cass_D}</label>
                  <label className="w-[106px]" >{generateReal(supplyUnique[0].cass_D, 100)}</label>
                </div>
                <div className="flex gap-5 border border-gray-600 w-80  mb-2 bg-red-400 ">
                  <label className="w-14 font-bold">Total</label>
                  <label className="  flex-1 text-end font-bold">{generateRealTotal(supplyUnique[0].cass_A, supplyUnique[0].cass_B, supplyUnique[0].cass_C, supplyUnique[0].cass_D)}</label>
                </div>
              </div>
            }
          </div>
        </div >
        <div className="flex items-center gap-3">
          <div>
            {filteredAtms && filteredAtms.length > 0 &&
              <label className="uppercase leading-3 font-bold">Atms</label>
            }
            {filteredAtms && filteredAtms.length > 0 && filteredAtms.map((item, key) => (

              <div key={key} className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 gap-3 rounded-md mb-2 border-4 border-slate-600 h-11 w-[600px] text-lg items-center">
                <input type="checkbox" checked={item.check} onChange={(e) => {
                  const updated = [...filteredAtms];
                  updated[key] = { ...item, check: e.target.checked };
                  setFilteredAtms(updated);
                }}
                />
                <div className="w-96">{item.id_atm} - {item.short_name}</div>
                <select className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full" value={item.type}
                  onChange={(e) => {
                    const updated = [...filteredAtms];
                    updated[key] = { ...item, type: e.target.value as atmPage['type'] };
                    setFilteredAtms(updated);
                  }}>
                  <option className="uppercase bg-slate-700 text-white" value="COMPLEMENTAR">COMPLEMENTAR</option>
                  <option className="uppercase bg-slate-700 text-white" value="TROCA TOTAL">TROCA TOTAL</option>
                  <option className="uppercase bg-slate-700 text-white" value="RECOLHIMENTO TOTAL">RECOLHIMENTO TOTAL</option>
                </select>
              </div>
            ))}
            {filteredAtms && filteredAtms.length > 0 &&
              <div>
                <button onClick={handleSave} >Salvar</button>
                {isPar &&
                  <button onClick={handleDiv}>Dividir</button>
                }
              </div>
            }
          </div>

          <div>
            <label className="uppercase leading-3 font-bold" >Abastecimento</label>
            <div className="flex gap-5 border border-gray-600 w-80 mb-2">
              <label className="w-[95px]">R$ 10,00</label>
              <label className="w-[117px] text-black text-center">
                <input type="number" className="w-full" value={cassA} onChange={e => setCassA(e.target.value)} />
              </label>
              <label className="w-[106px]" >{generateReal(parseInt(cassA), 10)}</label>
            </div>
            <div className="flex gap-5 border border-gray-600 w-80  mb-2">
              <label className="w-[95px]" >R$ 20,00</label>
              <label className="w-[117px] text-black text-center" >
                <input type="number" className="w-full" value={cassB} onChange={e => setCassB(e.target.value)} />
              </label>
              <label className="w-[106px]" >{generateReal(parseInt(cassB), 20)}</label>
            </div>
            <div className="flex gap-5 border border-gray-600 w-80  mb-2">
              <label className="w-[95px]" >R$ 50,00</label>
              <label className="w-[117px] text-black text-center">
                <input type="number" className="w-full" value={cassC} onChange={e => setCassC(e.target.value)} />
              </label>
              <label className="w-[106px]" >{generateReal(parseInt(cassC), 50)}</label>
            </div>
            <div className="flex gap-5 border border-gray-600 w-80  mb-2">
              <label className="w-[95px]" >R$ 100,00</label>
              <label className="w-[117px] text-black text-center" >
                <input type="number" className="w-full" value={cassD} onChange={e => setCassD(e.target.value)} />
              </label>
              <label className="w-[106px]" >{generateReal(parseInt(cassD), 100)}</label>
            </div>
            <div className="flex gap-5 border border-gray-600 w-80  mb-2 bg-red-400 ">
              <label className="w-14 font-bold">Total</label>
              <label className="  flex-1 text-end font-bold">{generateRealTotal(parseInt(cassA), parseInt(cassB),
                parseInt(cassC), parseInt(cassD))}</label>
            </div>
            <div>
              <button onClick={saveIndividual}>Salvar</button>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 w-full h-1"></div>
        {supplyForDay.length > 0 &&
          <div className="flex flex-col gap-5">
            <table className="flex-1 text-center p-3" width="100%">
              <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl">
                <tr>
                  <th>ID</th>
                  <th>Transportadora</th>
                  <th>Atm</th>
                  <th>Total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className=" text-xl">
                {supplyForDay.map(item => (
                  <tr key={item.id}>
                    <th>{item.id}</th>
                    <th>{item.id_treasury}</th>
                    <th>{item.id_atm}</th>
                    <th>Total</th>
                    <th>Ações</th>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        }
      </div>
      {modalTrocaTotal &&
        <ModalTrocaTotal atms={filteredAtms ?? []} onClose={handleCloseModalTrocaTotal} />
      }
      {error.messege &&
        <Messeger type={error.type} title={error.title} messege={error.messege} />
      }
      {loading &&
        <Loading />
      }
    </Page>
  );

}