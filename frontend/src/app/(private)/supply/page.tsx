"use client"

import { Button } from "@/app/components/ui/Button";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Page } from "@/app/components/ux/Page";
import { Pagination } from "@/app/components/ux/Pagination";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { returnDayAtual } from "@/app/utils/returnDayAtual";
import { faParachuteBox, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function Supply() {

  const router = useRouter()

  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false)
  const [currentDay, setCurrentDay] = useState('')

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    setCurrentDay(returnDayAtual())
  }, [])

  const handleAdd = () => {
    router.push('/supply/add')
    return
  }

  const handleDaySupplies = async () => {
    setError({ type: '', title: '', messege: '' })
    setLoading(false)
    
  }

  return (
    <Page>
      <TitlePages linkBack="/" icon={faParachuteBox} >Abastecimento</TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className='flex flex-col gap-3 items-center justify-center mb-4'>
          <Button color='#2E8B57' secondaryColor='#81C784' textColor='white' onClick={handleAdd} size='meddium'>Adicionar</Button>
        </div>
        <div>
          <div className="text-2xl ">Abastecimentos realizados para o dia: {currentDay}</div>
        </div>
        <table className="flex-1 text-center p-3" width="100%">
          <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl" >
            <tr >
              <th>ID</th>
              <th>Nome</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className=" text-xl">

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