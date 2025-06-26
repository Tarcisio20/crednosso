"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  faBoxOpen,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { atmType } from "@/types/atmType";
import { del, getAllPagination } from "@/app/service/atm";
import { getAll as gtTreasury } from "@/app/service/treasury";
import { Loading } from "@/app/components/ux/Loading";
import { treasuryType } from "@/types/treasuryType";
import { returnNameTreasury } from "@/app/utils/returnNameTreasury";
import { returnDefault } from "@/app/utils/returnDefault";
import { Messeger } from "@/app/components/ux/Messeger";
import { Pagination } from "@/app/components/ux/Pagination";
import { toast } from "sonner";

export default function Atm() {
  const router = useRouter();

  const [atms, setAtms] = useState<atmType[]>([]);
  const [treasuries, setTreasuries] = useState<treasuryType[]>([]);
  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  const handleAdd = () => {
    router.push("/atm/add");
  };

  useEffect(() => {
    document.title = "Atms | CredNosso";
  }, []);


  const getAllAtmsPagination = useCallback(async () => {
    setError({ type: '', title: '', messege: '' });
    setLoading(false);
    setLoading(true);
    const allAtms = await getAllPagination(currentPage, pageSize);
    const allTreasury = await gtTreasury();
    if (allTreasury.status === 300 || allTreasury.status === 400 || allTreasury.status === 500) {
      toast.error('Erro de requisição, tente novamente')
      setLoading(false);
      return;
    }

    if (allAtms.data.atm.data && allAtms.data.atm.data.length > 0) {
      setAtms(allAtms.data.atm.data);
      setTreasuries(allTreasury.data.treasury);
      setTotalPages(allAtms.data.atm.totalPages);
      setLoading(false);
      return;
    } else {
      toast.error('Sem dados a carregar, tente novamente!')
      setLoading(false);
      return;
    }
  }, [currentPage]);


  useEffect(() => {
    getAllAtmsPagination();
  }, [currentPage, getAllAtmsPagination]);

  const handleDelete = async (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault()
    setError({ type: '', title: '', messege: '' });
    setLoading(false);
    setLoading(true);
    if (!id) {
      toast.error('Selecione um Atm, para continunar')
      setLoading(false);
      return;
    }
    const deleteAtm = await del(id)
    if (deleteAtm.status === 300 || deleteAtm.status === 400 || deleteAtm.status === 500) {
      toast.error('Erro de requisição, tente novamente')
      setLoading(false);
      return;
    }
    if (deleteAtm.status === 200) {
      toast.success('Atm deletado com sucesso!')
      setLoading(false);
      getAllAtmsPagination();
      return;
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/" icon={faBoxOpen}>
        Atm
      </TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-3 items-center justify-center mb-4">
          <Button
            color="#2E8B57"
            secondaryColor="#81C784"
            textColor="white"
            onClick={handleAdd}
            size="meddium"
          >
            Adicionar
          </Button>
        </div>
        <table className="flex-1 text-center p-3" width="100%">
          <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Nome Reduzido</th>
              <th>Transportadora</th>
              <th>Config Cassetes</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className=" text-xl">
            {atms &&
              atms.map((item, index) => (
                <tr className="h-12" key={index}>
                  <td>{item.id_system}</td>
                  <td>{item.name}</td>
                  <td>{item.short_name}</td>
                  <td>{returnNameTreasury(treasuries, item.id_treasury)}</td>
                  <td>
                    {returnDefault({
                      cassete_A: item.cassete_A,
                      cassete_B: item.cassete_B,
                      cassete_C: item.cassete_C,
                      cassete_D: item.cassete_D,
                    })}
                  </td>
                  <td>Ativo</td>
                  <td className="flex justify-center items-center gap-4 h-12">
                    <Link href={`/atm/edit/${item.id_system}`} >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        size="1x"
                        color="#6C8EBF"
                      />
                    </Link>
                    <a href={`/atm/del/${item.id_system}`} onClick={(e) => handleDelete(e, item.id_system)} className="cursor-pointer" >
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="1x"
                        color="#BF6C6C"
                      />
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {atms && totalPages > 1 &&
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        }
        {error.messege && (
          <Messeger type={error.type} title={error.title} messege={error.messege} />
        )}
        {loading && <Loading />}
      </div>
    </Page>
  );
}
