"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  faSackDollar,
  faPenToSquare,
  faTrash,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import {  useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { treasuryType } from "@/types/treasuryType";
import { del, getAllTreasuryPagination } from "@/app/service/treasury";
import { generateValueTotal } from "@/app/utils/generateValueTotal";
import { Loading } from "@/app/components/ux/Loading";
import { Pagination } from "@/app/components/ux/Pagination";
import { Messeger } from "@/app/components/ux/Messeger";
import { toast } from "sonner";

export default function Treasury() {
  const router = useRouter();


  const [treasuries, setTreasuries] = useState<treasuryType[]>();

  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;


  const loadTreasuries = async () => {
    setLoading(true);
    const treasury = await getAllTreasuryPagination(currentPage, pageSize);
    if (treasury.data && treasury.data.length > 0) {
      setTreasuries(treasury.data);
      setTotalPages(treasury.meta.totalPages);
      setLoading(false);
      return;
    }
    setLoading(false);
    toast.error('Sem dados a mostrar')
    return;
  };

  useEffect(() => {
    document.title = "Tesourarias | CredNosso";
    loadTreasuries();
  }, [currentPage]);

  const handleAdd = () => {
    router.push("/treasury/add");
  };

  const handleDelete = async (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault()
    setLoading(true);
    if (!id) {
      setLoading(false);
      toast.error('Selecione um Atm, para continunar')
      return;
    }
    const deleteTreasury = await del(id)
    if (deleteTreasury.status === 300 || deleteTreasury.status === 400 || deleteTreasury.status === 500) {
      setLoading(false);
      toast.error('Erro de requisição, tente novamente')
      return;
    }
    if (deleteTreasury.status === 200) {
      loadTreasuries();
      setLoading(false);
      toast.success('Atm deletado com sucesso!');
      return;
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/" icon={faSackDollar}>
        Tesouraria
      </TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-3 items-center justify-center mb-4">
          <Button
            color="#2E8B57"
           variant={"primary"}
            textColor="white"
            onClick={handleAdd}
            size="medium"
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
              <th>N Conta</th>
              <th>GMCore</th>
              <th>Saldo</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className=" text-xl">
            {treasuries?.map((item, key) => (
              <tr key={key} className={`h-12 ${key % 2 === 0 ? 'bg-gray-800' : 'bg-gray-600'
                } hover:bg-zinc-300 transition-colors hover:text-black`}>
                <td>{item.id_system}</td>
                <td>{item.name}</td>
                <td>{item.short_name}</td>
                <td>{item.account_number}</td>
                <td>{item.gmcore_number}</td>
                <td>
                  {generateValueTotal(
                    item?.bills_10 as number,
                    item.bills_20 as number,
                    item.bills_50 as number,
                    item.bills_100 as number
                  )}
                </td>
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
                <td className="flex justify-center items-center gap-4 h-12">
                  <Link href={`/treasury/edit/${item.id_system}`}>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size="1x"
                      color="#6C8EBF"
                    />
                  </Link>
                  <a href={`/treasury/del/${item.id_system}`}
                    onClick={(e) => handleDelete(e, item.id_system as number)}
                  >
                    <FontAwesomeIcon icon={faTrash} size="1x" color="#BF6C6C" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {treasuries && totalPages > 1 &&
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        }

        {error.messege && (
          <Messeger type={error?.type} title={error.title} messege={error.messege} />
        )}
        {loading && <Loading />}
      </div>
    </Page>
  );
}
