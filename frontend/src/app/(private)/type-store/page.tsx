"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faBan, faCheck, faPenToSquare, faStore, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { generateStatus } from "@/app/utils/generateStatus";
import { Loading } from "@/app/components/ux/Loading";
import { typeStoreType } from "@/types/typeStoreType";
import { getAllTypeStorePagination } from "@/app/service/type-store";
import { Pagination } from "@/app/components/ux/Pagination";
import { Messeger } from "@/app/components/ux/Messeger";
import { toast } from "sonner";

export default function TypeStore() {
  const router = useRouter();

  const [typeStores, setTypeStores] = useState<typeStoreType[]>();
  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    document.title = "Tipo de Loja   | CredNosso";
  }, []);

  const handleAdd = () => {
    router.push('/type-store/add');
  };

  const loadTypeStorePagination = useCallback(async () => {
    setLoading(true);
    const tStores = await getAllTypeStorePagination(currentPage, pageSize);

    if ("status" in tStores && [300, 400, 500].includes(tStores.status)) {
      setLoading(false);
      toast.error('Erro na requisição, tente novamente!');
      return;
    }

    if ("data" in tStores && tStores.data.length > 0) {
      setTypeStores(tStores.data);
      setTotalPages(tStores.meta.totalPages);
    } else {
      toast.error('Erro ao retornar dados, tente novamente!');
    }

    setLoading(false);
  }, [currentPage]);

  useEffect(() => {
    loadTypeStorePagination();
  }, [currentPage, loadTypeStorePagination]);

  return (
    <Page>
      <TitlePages linkBack="/" icon={faStore}>Tipo de Loja</TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className='flex flex-col gap-3 items-center justify-center mb-4'>
          <Button color='#2E8B57' textColor='white' onClick={handleAdd} size="medium" variant={"primary"}>Adicionar</Button>
        </div>
        <table className="flex-1 text-center p-3" width="100%">
          <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className=" text-xl">
            {typeStores?.map((item, key) => (
              <tr key={key} className={`h-12 ${key % 2 === 0 ? 'bg-gray-800' : 'bg-gray-600'} hover:bg-zinc-300 transition-colors hover:text-black`}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  {item.status ? (
                    <FontAwesomeIcon icon={faCheck} size="2x" color="#2E8B57" />
                  ) : (
                    <FontAwesomeIcon icon={faXmark} size="2x" color="#BF6C6C" />
                  )}
                </td>
                <td className='flex justify-center items-center gap-4 h-12'>
                  <Link href={`/type-store/edit/${item.id}`}>
                    <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                  </Link>
                  <Link href={`/type-store/del/${item.id}`}>
                    {item.status === true ? (
                      <FontAwesomeIcon icon={faTrash} size="1x" color="#BF6C6C" />
                    ) : (
                      <FontAwesomeIcon icon={faBan} size="1x" color="#BF6C6C" />
                    )}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {typeStores && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        )}
        {error.messege && (
          <Messeger type={error?.type} title={error.title} messege={error.messege} />
        )}
        {loading && <Loading />}
      </div>
    </Page>
  );
}
