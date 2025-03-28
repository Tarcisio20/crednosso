"use client"

import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { ModalSupply } from "@/app/components/ux/ModalSuppy";
import { Page } from "@/app/components/ux/Page";
import { Pagination } from "@/app/components/ux/Pagination";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getAtmsForTreasury } from "@/app/service/atm";
import { getTreasuriesInOrder } from "@/app/service/order";
import { getTreasuriesForIds } from "@/app/service/treasury";
import { atmType } from "@/types/atmType";
import { treasuryType } from "@/types/treasuryType";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Supply() {

  const [treasuries, setTreasuries] = useState<treasuryType[]>()
  const [atms, setAtms] = useState<atmType[]>()
  const [filteredAtms, setFilteredAtms] = useState<atmType[]>()
  const [filteredTreasury, setFilteredTreasury] = useState<treasuryType[]>()
  const [idTreasury, setIdTreasury] = useState('')
  const [dateSupply, setDateSupply] = useState('')

  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false)
  const [currentDay, setCurrentDay] = useState('')
  const [modal, setModal] = useState(false)
  const [atmUnique, setAtmUnique] = useState<atmType | null>()
  const [idAtmSupplied, setIdAtmSupplied] = useState()
  const [infosAtmSupplied, setInfosAtmsSupplied] = useState({
    valueA: 0, valueB: 0, valueC: 0, valueD: 0
  })

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    handleAll()
  }, [idTreasury, atms]);


  const handleAll = () => {
    const treasuryId = parseInt(idTreasury);
    const result = atms?.filter(atm => atm.id_treasury === treasuryId);
    setFilteredAtms(result);
    filterTreasury()
  }

  const handleTreasuriesForDateOrder = async () => {

    setError({ type: '', title: '', messege: '' })
    setLoading(true)
    if (dateSupply === '') {
      setError({ type: 'error', title: 'Error', messege: 'Prrencher o campo de data!' })
      setAtms([])
      setLoading(false)
      return
    }
    const idTreasuriesInOrderDate: any = await getTreasuriesInOrder(dateSupply)
    if (idTreasuriesInOrderDate.status === 300 || idTreasuriesInOrderDate.status === 400 || idTreasuriesInOrderDate.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, tente novamente!' })
      setAtms([])
      setLoading(false)
      return
    }
    const treasuriesForIds = await getTreasuriesForIds(idTreasuriesInOrderDate.data.order)
    if (!treasuriesForIds?.data?.treasury) {
      setAtms([])
      setError({ type: 'error', title: 'Error', messege: 'Erro na busca por tesourarias, tente novamente!' })
      setLoading(false)
      return
    }

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

    setTreasuries(uniqueTreasury)
    if (treasuriesForIds.data.treasury.length === 0) {
      setAtms([])
      setError({ type: 'error', title: 'Error', messege: 'Sem pedidos a retornar!' })
      setLoading(false)
      return
    }
    setIdTreasury(treasuriesForIds.data.treasury[0].id_system)

    const atmsForTreasury = await getAtmsForTreasury(idTreasuriesInOrderDate.data.order)
    if (atmsForTreasury.status === 300 || atmsForTreasury.status === 400 || atmsForTreasury.status === 500) {
      setAtms([])
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, Faça a busca por data novamente!' })
      setLoading(false)
      return
    }
    if (atmsForTreasury.data.atm && atmsForTreasury.data.atm[0].id > 0) {

      const uniqueAtms = atmsForTreasury.data.atm.reduce((acc: any, current: any) => {
        // Verifica se já existe no acumulador um item com o mesmo id_system
        if (!acc.some((item: any) => item.id_system === current.id_system)) {
          acc.push(current); // Se não existir, adiciona ao acumulador
        }
        return acc;
      }, []);

      setAtms(uniqueAtms)
      setError({ type: '', title: '', messege: '' })
      setLoading(false)
      return
    }else{
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

  const handleCloseModal = () => {
    setError({ type: '', title: '', messege: '' })
    setLoading(false)
    setAtmUnique(undefined)
    setModal(false)
  }

  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>, atm: atmType) => {
    if (event.target.checked) {
      setAtmUnique(atm); // Define o ATM selecionado
      setModal(true)
    } else {
      setAtmUnique(null); // Desmarca o ATM se o checkbox for desmarcado
    }

  }

  const filterTreasury = () => {
    if (idTreasury) {
      setFilteredTreasury(treasuries?.filter(treasury => treasury.id_system === parseInt(idTreasury)))
    }
  }

  const handleSave = () => {
    setError({ type: '', title: '', messege: '' })
    setLoading(false)
    handleTreasuriesForDateOrder()
    handleCloseModal()
  }

  const handleSaveAndExclude = () => {
    handleTreasuriesForDateOrder()
    /*if (treasuries && filteredTreasury && filteredTreasury.length > 0) {
      const filtered = treasuries.filter(
        (treasury) =>
          !filteredTreasury.some(
            (filteredItem) => filteredItem.id_system === treasury.id_system
          )
      );*/
    // setTreasuries(filtered);
    // handleAll()
    //}
    handleCloseModal()
  }


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
                  <input
                    type="checkbox"
                    checked={atmUnique?.id === atm.id}
                    onChange={(event) => handleChecked(event, atm)}
                  />
                  <div className="w-64 h-96  bg-slate-600 flex flex-col items-center pt-6 rounded-md">
                    <div className="w-56 h-28 bg-slate-500 flex flex-col gap-2 justify-center items-center border-2 border-zinc-200">
                      <label className="text-4lg text-white">{atm.id_system}</label>
                      <label className="text-4lg text-white">{atm.short_name}</label>
                    </div>
                    <div className="flex flex-col gap-3 mt-8 w-full pl-4 pr-4">
                      <div className="bg-slate-500 min-h-6 w-[100%]">
                        <div className="bg-red-300 min-h-6" style={{ width: `${Math.floor(Math.random() * 101)}%` }} ></div>
                      </div>
                      <div className="bg-slate-500 min-h-6 w-[100%]">
                        <div className="bg-red-300 min-h-6" style={{ width: `${Math.floor(Math.random() * 101)}%` }} ></div>
                      </div>
                      <div className="bg-slate-500 min-h-6 w-[100%]">
                        <div className="bg-red-300 min-h-6" style={{ width: `${Math.floor(Math.random() * 101)}%` }} ></div>
                      </div>
                      <div className="bg-slate-500 min-h-6 w-[100%]">
                        <div className="bg-red-300 min-h-6" style={{ width: `${Math.floor(Math.random() * 101)}%` }} ></div>
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
      {modal &&
        <ModalSupply
          atmIndividual={atmUnique}
          onClose={handleCloseModal}
          treasury={filteredTreasury}
          onSave={handleSave}
        />
      }
    </Page>
  );

}