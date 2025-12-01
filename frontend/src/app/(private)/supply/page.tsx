"use client"

import { Button } from "@/app/components/ui/Button";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { Pagination } from "@/app/components/ux/Pagination";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getAll } from "@/app/service/atm";
import { getSuppliesByDate, getSuppliesForDay, getSuppliesForDayPagination, getTreasuriesForDate, toSendEmail } from "@/app/service/supply";
import { returnDayAtual } from "@/app/utils/returnDayAtual";
import { returnDayAtualForInput } from "@/app/utils/returnDayAtualForInput";
import { supplyType } from "@/types/supplyType";
import { faParachuteBox } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Supply() {

  const [supplies, setSupplies] = useState<supplyType[]>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentDay, setCurrentDay] = useState('')
  const [dateSupply, setDateSupply] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);  
  const pageSize = 15;

  useEffect(() => {
    document.title = "Pedidos | CredNosso";
    const day = returnDayAtual()
    const dayForInput = returnDayAtualForInput()
    if (day) {
      setCurrentDay(day)
      setDateSupply(dayForInput)
    }
  }, [])

  const handleGenerateOrders = async () => {
    setLoading(true)  
    try {
      const response = await toSendEmail({ date : dateSupply })
      console.log("Response", response)
      if(response.status === 300 || response.status === 400 || response.status === 500){
        toast.error('Erro ao gerar email, tente novamente!')
        return
      } else if(response.status === 200 && response.data.success === false){
        toast.error('Erro ao gerar email, tente novamente!')
        return
      }
      toast.success('Email com sucesso!')
      return
    }catch(error){
      toast.error('Erro ao gerar email, tente novamente!')
    }finally{
      setLoading(false)
    }  
  }

  const handleAdd = () => {
    router.push('/supply/add')
    return
  }

  const handleDaySupplies = async () => {
    setLoading(true)
    const data = {
      date: currentDay
    }
    
    const supplayDay = await getSuppliesForDayPagination(data, currentPage, pageSize)
    if (supplayDay.Status === 300 || supplayDay.Status === 400 || supplayDay.Status === 500) {
      setLoading(false)
      toast.error('Erro na requisição, tentenovamente!') 
      return
    }

    if (supplayDay.data !== undefined && supplayDay.status === 200) {
      setSupplies(supplayDay.data.supply.data)
      setTotalPages(supplayDay.data.supply.totalPages)
      setLoading(false)
      return
    }
    setLoading(false)
    toast.error('Nenhum abastecimento cadastrado para hoje!')
  }

  useEffect(() => {
    if (!currentDay) return
    handleDaySupplies()
  }, [currentDay, currentPage])

  const handleSuppliesDay = async () => {
    try {
      const response = await getSuppliesByDate({date : dateSupply})
      if(response.status === 300 || response.status === 400 || response.status === 500){
        toast.error("Sem abastecimentos a listar!")
        setSupplies([])
        return
      }
      if(response.status === 200 && response.data.supply.length === 0){
        toast.error("Sem abastecimentos a listar!")
        setSupplies([])
        return
      }
      if(response.data.supply.length > 0){
        setSupplies(response.data.supply)
        return
      } 
    }catch(error){
      toast.error("Sem abastecimentos a listar!")
      setSupplies([])
      return
    }
  }

  return (
    <Page>
      <TitlePages linkBack="/" icon={faParachuteBox} >Abastecimento</TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className='flex flex-row gap-3 items-center justify-center mb-4'>
          <Button color='#2E8B57'  textColor='white' onClick={handleAdd} size='medium'>Adicionar</Button>
          {supplies && supplies.length > 0 &&
            <Button color='#2E8B57' variant={"primary"}  disabled={loading} textColor='white' onClick={handleGenerateOrders} size='medium'>Gerar Abastecimentos</Button>
          }
        </div>
        <div className="flex flex-col gap-5 w-1/3">
          <label className="text-lg uppercase">Data do pedido</label>
          <input
            type="date"
            value={dateSupply}
            onChange={(e) => setDateSupply(e.target.value)}
            className="w-full h-10 outline-none rounded-md text-black text-center uppercase"
          />
          <button onClick={handleSuppliesDay} >Buscar</button>
        </div>
        <table className="flex-1 text-center p-3" width="100%">
          <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl" >
            <tr >
              <th>ID</th>
              <th>Id Atm</th>
              <th>Nome Atm</th>
              <th>Cassete A</th>
              <th>Cassete B</th>
              <th>Cassete C</th>
              <th>Cassete D</th>
              <th>Total</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody className=" text-xl">
            {supplies && supplies.map((item, index) => (
             <tr key={index}
                  className={`h-12 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-600'
                    } hover:bg-zinc-300 transition-colors hover:text-black`}>
                <td>{item.id}</td>
                <td>{item.id_atm}</td>
                <td>{item.atm?.name ?? '-'}</td>
                <td>{item.cassete_A}</td>
                <td>{item.cassete_B}</td>
                <td>{item.cassete_C}</td>
                <td>{item.cassete_D}</td>
                <td>total</td>
                <td>Excluir</td>
              </tr>
            ))}
          </tbody>
        </table>
        {supplies && totalPages > 1 &&
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        }
        {loading &&
          <Loading />
        }
      </div>
    </Page>
  );

}