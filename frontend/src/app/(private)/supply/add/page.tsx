"use client"

import { Button } from "@/app/components/ui/Button";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Page } from "@/app/components/ux/Page";
import { Pagination } from "@/app/components/ux/Pagination";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getAtmsForTreasury } from "@/app/service/atm";
import { getTreasuriesInOrder } from "@/app/service/order";
import { getTreasuriesForIds } from "@/app/service/treasury";
import { atmType } from "@/types/atmType";
import { treasuryType } from "@/types/treasuryType";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useEffect, useState } from "react";

export default function Supply() {

  const [treasuries, setTreasuries] = useState<treasuryType[]>()
  const [atms, setAtms] = useState<atmType[]>()
  const [filteredAtms, setFilteredAtms] = useState<atmType[]>()
  const [idTreasury, setIdTreasury] = useState('')
  const [dateSupply, setDateSupply] = useState('')

  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false)
  const [currentDay, setCurrentDay] = useState('')

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    console.log("Array completo de ATMs:", atms);
    const treasuryId = parseInt(idTreasury);
    const result = atms?.filter(atm => atm.id_treasury === treasuryId);
    setFilteredAtms(result);
    console.log(result)
  }, [idTreasury, atms]);


  const handleTreasuriesForDateOrder = async () => {

    setError({ type: '', title: '', messege: '' })
    setLoading(true)
    if (dateSupply === '') {
      setError({ type: 'error', title: 'Error', messege: 'Prrencher o campo de data!' })
      setLoading(false)
      return
    }
    const idTreasuriesInOrderDate: any = await getTreasuriesInOrder(dateSupply)
    if (idTreasuriesInOrderDate.status === 300 || idTreasuriesInOrderDate.status === 400 || idTreasuriesInOrderDate.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, tente novamente!' })
      setLoading(false)
      return
    }
    const treasuriesForIds = await getTreasuriesForIds(idTreasuriesInOrderDate.data.order)
    if (!treasuriesForIds.data.treasury) {
      setError({ type: 'error', title: 'Error', messege: 'Erro na busca por tesourarias, tente novamente!' })
      setLoading(false)
      return
    }
    if (treasuriesForIds.status === 300 || treasuriesForIds.status === 400 || treasuriesForIds.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, Faça a busca por data novamente!' })
      setLoading(false)
      return
    }
    setTreasuries(treasuriesForIds.data.treasury)
    setIdTreasury(treasuriesForIds.data.treasury[0].id_system)

    const atmsForTreasury = await getAtmsForTreasury(idTreasuriesInOrderDate.data.order)
    console.log(atmsForTreasury.data.atm)
    if (atmsForTreasury.status === 300 || atmsForTreasury.status === 400 || atmsForTreasury.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, Faça a busca por data novamente!' })
      setLoading(false)
      return
    }
    if (atmsForTreasury.data.atm && atmsForTreasury.data.atm[0].id > 0) {
      setAtms(atmsForTreasury.data.atm)
      setError({ type: '', title: '', messege: '' })
      setLoading(false)
      return
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


  return (
    <Page>
      <TitlePages linkBack="/supply" icon={faAdd} >Adicinar Abastecimento</TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
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
        <div className="flex flex-col gap-5 w-1/3">
          {treasuries && treasuries.length > 0 &&
            <>
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
            </>
          }
        </div>
        <div className="bg-slate-800 w-full h-1"></div>
        <div className=" w-full h-full">
          <label className="text-3xl uppercase">Terminais</label>
          <div className="mt-4 flex flex-row gap-8">

            <div className="flex gap-3 items-start">
              {filteredAtms && filteredAtms.length > 0 && filteredAtms.map((atm) => (
                <div key={atm.id} className="flex items-start gap-3">
                  <input type="checkbox" />
                  <div className="w-80 h-96  bg-slate-600 flex flex-col items-center pt-6 rounded-md">
                    <div className="w-56 h-28 bg-slate-500 flex justify-center items-center border-2 border-zinc-200">
                      <label className="text-4lg text-white">{atm.short_name}</label>
                    </div>
                    <div className="mt-2 flex items-start gap-2">
                      <label className="uppercase">Troca Total</label>
                      <input type="checkbox" />
                    </div>
                    <div className="flex flex-col gap-3 mt-8 w-full pl-4 pr-4">
                      <div className="bg-slate-500 min-h-6 w-[100%]">
                        <div className="bg-red-300 min-h-6 w-[20%]"></div>
                      </div>
                      <div className="bg-slate-500 min-h-6 w-[100%]">
                        <div className="bg-red-300 min-h-6  w-[80%]"></div>
                      </div>
                      <div className="bg-slate-500 min-h-6 w-[100%]">
                        <div className="bg-red-300 min-h-6  w-[33%]"></div>
                      </div>
                      <div className="bg-slate-500 min-h-6 w-[100%]">
                        <div className="bg-red-300 min-h-6  w-[69%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
              }
            </div>

          </div>
        </div>
      </div>
      {error.messege &&
        <Messeger type={error.type} title={error.title} messege={error.messege} />
      }
      {loading &&
        <Loading />
      }
    </Page>
  );

}