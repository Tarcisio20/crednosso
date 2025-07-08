"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faCheck, faPenToSquare, faTrash, faWandMagicSparkles, faXmark } from "@fortawesome/free-solid-svg-icons";
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
import { toast } from "sonner";

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

  const loadStatusOrderPagination = useCallback(async () => {
    setLoading(true);
    const statusOrder = await getAllPagination(currentPage, pageSize);
    if (statusOrder.status === 300 || statusOrder.status === 400 || statusOrder.status === 500) {
      setLoading(false);
      toast.error('Erro de requisição, tente novamente!')
      return;
    }

    if (statusOrder.data && statusOrder.data.length > 0) {
      setStatusOrders(statusOrder.data);
      setTotalPages(statusOrder.meta.totalPages);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      toast.error('Sem dados a mostrar, tente novamente!')
      return;
    }
  }, [])

  useEffect(() => {
    document.title = "Status Pedido - Add | CredNosso";
    loadStatusOrderPagination();
  }, [currentPage, loadStatusOrderPagination]);

  const handleDelete = async (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault()
    setLoading(true);
    if (!id) {
      setLoading(false);
      toast.error('Selecione um Atm, para continunar');
      return;
    }
    const deleteStatusOrder = await del(id)
    if (deleteStatusOrder.status === 300 || deleteStatusOrder.status === 400 || deleteStatusOrder.status === 500) {
      setLoading(false);
      toast.error('Erro de requisição, tente novamente')
      return;
    }
    if (deleteStatusOrder.status === 200) {
      setLoading(false);
      loadStatusOrderPagination()
      toast.success('Atm deletado com sucesso!');
      return;
    }
    setLoading(false);
    return
  };

  return (
    <Page>
      <TitlePages linkBack="/" icon={faWandMagicSparkles} >Status do Pedido</TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className='flex flex-col gap-3 items-center justify-center mb-4'>
          <Button color='#2E8B57' variant={'primary'} textColor='white' onClick={handleAdd} size='medium'>Adicionar</Button>
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
              <tr key={key} className={`h-12 ${key % 2 === 0 ? 'bg-gray-800' : 'bg-gray-600'
                } hover:bg-zinc-300 transition-colors hover:text-black`}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  {item.status ? (
                    <FontAwesomeIcon
                      icon={faCheck}
                      size="2x"
                      color="#2E8B57"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faXmark}
                      size="2x"
                      color="#BF6C6C"
                    />
                  )}
                </td>
                <td className='flex justify-center items-center gap-4 h-12'>
                  <Link href={`/status-order/edit/${item.id}`}>
                    <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                  </Link>
                  <a href={`/status-order/del/${item.id}`}
                    onClick={(e) => handleDelete(e, item.id as number)}
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