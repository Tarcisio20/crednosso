"use client";

import { Button } from "@/app/components/ui/Button";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { del, getAllPagination } from "@/app/service/operational-error";
import { getAll } from "@/app/service/treasury";
import { returnNameTreasury } from "@/app/utils/returnNameTreasury";
import { OperationalErrorType } from "@/types/operationalErrorType";
import { treasuryType } from "@/types/treasuryType";
import { faBomb, faCheck, faPenToSquare, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function OperationalError() {

  const router = useRouter()

  const [erros, setErros] = useState<OperationalErrorType[]>([])
  const [treasuries, setTreasuries] = useState<treasuryType[]>([])
  const [loading, setLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 16;

  useEffect(() => {
    document.title = "Erro Operacional | CredNosso";
  }, [])

  const getAllPaginationError = useCallback(async () => {
    setLoading(true)
    const allErros = await getAllPagination(currentPage, pageSize)
    if (allErros.status === 300 || allErros.status === 400 || allErros.status === 500) {
      toast.error('Erro na requisição, tente novamente!')
      setLoading(false)
      return
    }
    if (allErros.data !== undefined && allErros.data.operationalError.data.length > 0) {
      setErros(allErros.data.operationalError.data)
      setTotalPages(allErros.data.operationalError.totalPages)

      const treasury = await getAll()
      if (treasury.status === 300 || treasury.status === 400 || treasury.status === 500) {
        toast.error('Erro na requisição, tente novamente!')
        setLoading(false)
        return
      }
      if (treasury.data !== undefined && treasury.data.treasury[0]?.id > 0) {
        setTreasuries(treasury.data.treasury)

      }
      setLoading(false)
      return
    }

    setLoading(false)
    toast.error('Sem dados a carregar!')
    return
  }, [currentPage])

  useEffect(() => {
    getAllPaginationError()
  }, [currentPage, getAllPaginationError])

  const handleAdd = () => {
    setLoading(true)
    router.push("/operational-error/add");
    setLoading(false)
    return
  }

  const handleDelete = async (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault()
    setLoading(true)
    if (!id) {
      setLoading(false)
      toast.error('Selecione um Erro, para continunar')
      return
    }
    const deleteError = await del(id)
    if (deleteError.status === 300 || deleteError.status === 400 || deleteError.status === 500) {
      setLoading(false)
      toast.error('Erro de requisição, tente novamente')
      return
    }
    if (deleteError.status === 200) {
      setLoading(false)
      toast.success('Erro deletado com sucesso!')
      getAllPaginationError()
      return
    }
  }

  return <Page>
    <TitlePages linkBack="/" icon={faBomb}>Erro Operacional</TitlePages>
    <div className="flex flex-col gap-4 p-5 w-full">
      <div className="flex flex-col gap-3 items-center justify-center mb-4">
        <Button
          color="#2E8857"
          secondaryColor="#81C784"
          textColor="white"
          onClick={handleAdd}
          size="meddium"
        >Adicionar</Button>
      </div>
      <table className="flex-1 text-center p-3" width="100%">
        <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl">
          <tr>
            <th>ID</th>
            <th>Transportadora</th>
            <th>N OS</th>
            <th>Descrição</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody className=" text-xl">
          {erros &&
            erros.map((item, index) => (
              <tr key={index}
                className={`h-12 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-600'
                  } hover:bg-zinc-300 transition-colors hover:text-black`}>
                <td>{item.id}</td>
                <td>{ returnNameTreasury(treasuries, item.id_treasury)}</td>
                <td>{item.num_os}</td>
                <td>{item.description}</td>
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
                  <Link href={`/atm/edit/${item.id}`} >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size="1x"
                      color="#6C8EBF"
                    />
                  </Link>
                  <a href={`/atm/del/${item.id}`} onClick={(e) => handleDelete(e, item.id as number)} className="cursor-pointer" >
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
    </div>
  </Page>
}