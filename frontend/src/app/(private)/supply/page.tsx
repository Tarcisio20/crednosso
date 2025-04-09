"use client"

import { Button } from "@/app/components/ui/Button";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Page } from "@/app/components/ux/Page";
import { Pagination } from "@/app/components/ux/Pagination";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getSuppliesForDay } from "@/app/service/supply";
import { returnDayAtual } from "@/app/utils/returnDayAtual";
import { supplyType } from "@/types/supplyType";
import { faParachuteBox, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function Supply() {

  const [supplies, setSupplies] = useState<supplyType[]>()

  const router = useRouter()

  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false)
  const [currentDay, setCurrentDay] = useState('')

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    document.title = "Pedidos | CredNosso";
    const day = returnDayAtual()
    if (day) {
      setCurrentDay(day)
    }
  }, [])

  useEffect(() => {
    if (!currentDay) return
    handleDaySupplies()

  }, [currentDay])


  const handleAdd = () => {
    router.push('/supply/add')
    return
  }

  const handleDaySupplies = async () => {
    setError({ type: '', title: '', messege: '' })
    setLoading(true)
    let data = {
      date: currentDay
    }
    const supplayDay = await getSuppliesForDay(data)
    console.log(supplayDay)
    if (supplayDay.Status === 300 || supplayDay.Status === 400 || supplayDay.Status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, tentenovamente!' })
      setLoading(false)

    }
    if (supplayDay.data.supply && supplayDay.data.supply.length > 0) {
      setSupplies(supplayDay.data.supply)
      setError({ type: '', title: '', messege: '' })
      setLoading(false)
      return
    }
    setError({ type: 'error', title: 'Error', messege: 'Nunhum abastecimento cadastrado para hoje!' })
    setLoading(false)

  }

  return (
    <Page>
      <TitlePages linkBack="/" icon={faParachuteBox} >Abastecimento</TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className='flex flex-row gap-3 items-center justify-center mb-4'>
          <Button color='#2E8B57' secondaryColor='#81C784' textColor='white' onClick={handleAdd} size='meddium'>Adicionar</Button>
          {supplies && supplies.length > 0 &&
          <Button color='#2E8B57' secondaryColor='#81C784' textColor='white' onClick={()=>{}} size='meddium'>Gerar Abastecimentos</Button>
          }
        </div>
        <div>
          <div className="text-2xl ">Abastecimentos realizados para o dia: {currentDay}</div>
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
            {supplies && supplies.map((item) => (
              <tr>
                <td>{item.id}</td>
                <td>{item.id_atm}</td>
                <td>"Nome"</td>
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
        {true && totalPages > 1 &&
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        }
        {error.messege && (
          <Messeger type={error?.type} title={error.title} messege={error.messege} />
        )}
        {loading &&
          <Loading />
        }
      </div>
    </Page>
  );

}