"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  faThumbTack,
  faPenToSquare,
  faTrash,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { typeOperationType } from "@/types/typeOperationType";
import { Loading } from "@/app/components/ux/Loading";
import { getAllPagination } from "@/app/service/type-order";
import { generateStatus } from "@/app/utils/generateStatus";
import { Messeger } from "@/app/components/ux/Messeger";
import { Pagination } from "@/app/components/ux/Pagination";
import { toast } from "sonner";

export default function TypeOrder() {
  const router = useRouter();

  const [typeOrders, settypeOrders] = useState<typeOperationType[]>([]);
  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    document.title = "Tipo Pedido | CredNosso";
    loadTypeOrderPagination();
  }, [currentPage]);

  const handleAdd = () => {
    router.push("/type-order/add");
    return;
  };

  const loadTypeOrderPagination = async () => {
    setLoading(true)
    const tOrders = await getAllPagination(currentPage, pageSize)
    if (tOrders.status === 300 || tOrders.status === 400 || tOrders.status === 500) {
      setLoading(false)
      toast.error('Erro na requisição, tente novamente!')
      return
    }

    if (tOrders.data && tOrders.data.length > 0) {
      settypeOrders(tOrders.data)
      setTotalPages(tOrders.meta.totalPages);
      setLoading(false)
      return
    }
    setLoading(false)
    toast.error('Erro ao retornar dados, tente novamente!')
  }

  return (
    <Page>
      <TitlePages linkBack="/" icon={faThumbTack} >Tipo de Pedido</TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className='flex flex-col gap-3 items-center justify-center mb-4'>
          <Button color='#2E8B57' textColor='white' onClick={handleAdd} size="medium" variant={"primary"} >Adicionar</Button>
        </div>
        <table className="flex-1 text-center p-3" width="100%">
          <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl" >
            <tr >
              <th>ID</th>
              <th>Nome</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className=" text-xl">
            {typeOrders && typeOrders.map((item, index) => (
              <tr className={`h-12 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-600'
                } hover:bg-zinc-300 transition-colors hover:text-black`} key={index}>
                <td>{item.id_system}</td>
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
                  <Link href={`/type-order/edit/${item.id}`}>
                    <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                  </Link>
                  <Link href={`/type-order/del/${item.id}`}>
                    <FontAwesomeIcon icon={faTrash} size="1x" color="#BF6C6C" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {typeOrders && totalPages > 1 &&
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
