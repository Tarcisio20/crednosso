"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getAllPagination } from "@/app/service/type-supply";
import { generateStatus } from "@/app/utils/generateStatus";
import { typeSupplyType } from "@/types/typeSupplyType";
import { faSupple } from "@fortawesome/free-brands-svg-icons";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Pagination } from "@/app/components/ux/Pagination";

export default function TypeSupply() {

  const router = useRouter()

  const [typeSupplies, setTypeSupplies] = useState<typeSupplyType[]>()
  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;



  const handleAdd = () => {
    router.push('/type-supply/add')
    return
  }

  const loadTypeSupplyPagination = useCallback(async () => {
    setError({ type: '', title: '', messege: '' })
    setLoading(false);
    setLoading(true);
    const typeSupplies = await getAllPagination(currentPage, pageSize);
    if (typeSupplies.status === 300 || typeSupplies.status === 400 || typeSupplies.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro de requisição, tente novamente!' })
      setLoading(false);
      return
    }
    if (typeSupplies.data && typeSupplies.data.length > 0) {
      setTypeSupplies(typeSupplies.data);
      setTotalPages(typeSupplies.meta.totalPages);
      setLoading(false);
      return;
    } else {
      setError({ type: 'error', title: 'Error', messege: 'Sem dados a mostrar!' })
      setLoading(false);
      return;
    }
  },[])

  useEffect(() => {
    document.title = "Tipos Abastecimento | CredNosso";
    loadTypeSupplyPagination();
  }, [currentPage, loadTypeSupplyPagination]);

  return (
    <Page>
      <TitlePages linkBack="/" icon={faSupple} >Tipo de Abastecimento</TitlePages>
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
            {typeSupplies?.map((item, key) => (
              <tr key={key} className="h-12">
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{generateStatus(item.status as boolean)}</td>
                <td className='flex justify-center items-center gap-4 h-12'>
                  <Link href={`/type-supply/edit/${item.id}`}>
                    <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                  </Link>
                  <Link href={`/type-supply/del/${item.id}`}>
                    <FontAwesomeIcon icon={faTrash} size="1x" color="#BF6C6C" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {typeSupplies && totalPages > 1 &&
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