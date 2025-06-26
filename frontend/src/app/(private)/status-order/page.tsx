"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faPenToSquare, faTrash, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { generateStatus } from "@/app/utils/generateStatus";
import { Loading } from "@/app/components/ux/Loading";
import { del, getAll, getAllPagination } from "@/app/service/status-order";
import { statusOrderType } from "@/types/statusOrder";
import { Messeger } from "@/app/components/ux/Messeger";
import { Pagination } from "@/app/components/ux/Pagination";

export default function StatusOrder() {

  const router = useRouter()

  const [statusOrders, setStatusOrders] = useState<statusOrderType[]>()
  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  const handleAdd = () => {
    router.push('/status-order/add')
    return
  }

  const loadStatusOrderPagination =  useCallback(async () => {
    setError({ type: '', title: '', messege: '' });
    setLoading(false);
    setLoading(true);
    const statusOrder = await getAllPagination(currentPage, pageSize);
    if (statusOrder.status === 300 || statusOrder.status === 400 || statusOrder.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro de requisição, tente novamente!' });
      setLoading(false);
      return;
    }
    
    if (statusOrder.data && statusOrder.data.length > 0) {
      setStatusOrders(statusOrder.data);
      setTotalPages(statusOrder.meta.totalPages);
      setLoading(false);
      return;
    } else {
      setError({ type: 'error', title: 'Error', messege: 'Sem dados a mostrar!' });
      setLoading(false);
      return;
    }
  }, [])

  useEffect(() => {
    document.title = "Status Pedido - Add | CredNosso";
    loadStatusOrderPagination();
  }, [currentPage, loadStatusOrderPagination]);


   const handleDelete = async (e : React.MouseEvent<HTMLAnchorElement  >, id: number) => {
        e.preventDefault()
         setError({ type: '', title: '', messege: '' });
        setLoading(false);
        setLoading(true);
       if(!id){
         setError({ type: 'error', title: 'Error', messege: 'Selecione um Atm, para continunar' })
          setLoading(false);
          return;
       }
       const deleteStatusOrder = await del(id)
       if(deleteStatusOrder.status === 300 || deleteStatusOrder.status === 400 || deleteStatusOrder.status === 500){
         setError({ type: 'error', title: 'Error', messege: 'Erro de requisição, tente novamente' })
          setLoading(false);
          return;
       }
       if(deleteStatusOrder.status === 200){
         setError({ type: 'success', title: 'Sucesso', messege: 'Atm deletado com sucesso!' })
         setLoading(false);
         loadStatusOrderPagination();
         return;
       }
      };

  return (
    <Page>
      <TitlePages linkBack="/" icon={faWandMagicSparkles} >Status do Pedido</TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className='flex flex-col gap-3 items-center justify-center mb-4'>
          <Button color='#2E8B57' secondaryColor='#81C784' textColor='white' onClick={handleAdd} size='meddium'>Adicionar</Button>
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
            {statusOrders && statusOrders?.map((item, key) => (
              <tr key={key} className="h-12">
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{generateStatus(item.status as boolean)}</td>
                <td className='flex justify-center items-center gap-4 h-12'>
                  <Link href={`/status-order/edit/${item.id}`}>
                    <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                  </Link>
                  <a href={`/status-order/del/${item.id}`}
                      onClick={(e)=>handleDelete(e, item.id as number)}
                      className="cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faTrash} size="1x" color="#BF6C6C" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {statusOrders && totalPages > 1 &&
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