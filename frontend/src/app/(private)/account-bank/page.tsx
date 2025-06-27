"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  faBuildingColumns,
  faCheck,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "@/app/components/ux/Loading";
import { treasuryType } from "@/types/treasuryType";
import { returnNameTreasury } from "@/app/utils/returnNameTreasury";
import { returnDefault } from "@/app/utils/returnDefault";
import { Messeger } from "@/app/components/ux/Messeger";
import { Pagination } from "@/app/components/ux/Pagination";
import { del, getAllPagination } from "@/app/service/account-bank";
import { accountBankType } from "@/types/accountBankType";
import { toast } from "sonner";

export default function AccountBank() {
  const router = useRouter();

  const [accounts, setAccouhnts] = useState<accountBankType[]>([]);
  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  const handleAdd = () => {
    router.push("/account-bank/add");
  };

  useEffect(() => {
    document.title = "Conta Bancária | CredNosso";
  }, []);


  const allAcountsPagination = useCallback(async () => {
    setLoading(true);
    const allAcounts = await getAllPagination(currentPage, pageSize);
    if (allAcounts.data !== undefined && allAcounts.data.account.data.length > 0) {
      setAccouhnts(allAcounts.data.account.data);
      setTotalPages(allAcounts.data.account.totalPages);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      toast.error('Sem dados a carregar, tente novamente!');
      return;
    }
    setLoading(false);
  }, [currentPage]);


  useEffect(() => {
    allAcountsPagination();
  }, [currentPage, allAcountsPagination]);

  const handleDelete = async (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault()
    setLoading(true);
    if (!id) {
      setLoading(false);
      toast.error('Selecione um Atm, para continunar');
      return;
    }
    const deleteAccountBank = await del(id)
    if (deleteAccountBank.status === 300 || deleteAccountBank.status === 400 || deleteAccountBank.status === 500) {
      setLoading(false);
      toast.error('Erro de requisição, tente novamente');
      return;
    }
    if (deleteAccountBank.status === 200) {
      setLoading(false);
      allAcountsPagination();
      toast.success('Atm deletado com sucesso!');
      return;
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/" icon={faBuildingColumns}> Contas Bancárias </TitlePages>
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
              <th>Agencia</th>
              <th>Digito</th>
              <th>Conta</th>
              <th>Digito</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className=" text-xl">
            {accounts &&
              accounts.map((item, index) => (
                <tr className={`h-12 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-600'
                  } hover:bg-zinc-300 transition-colors hover:text-black`} key={index}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.bank_branch}</td>
                  <td>{item.bank_branch_digit}</td>
                  <td>{item.account}</td>
                  <td>{item.account_digit}</td>
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
                    <Link href={`/account-bank/edit/${item.id}`}>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        size="1x"
                        color="#6C8EBF"
                      />
                    </Link>
                    <a href={`/account-bank/del/${item.id}`}
                      onClick={(e) => handleDelete(e, item.id as number)}>
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
        {accounts && totalPages > 1 &&
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
