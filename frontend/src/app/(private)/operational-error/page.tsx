"use client";

import { Button } from "@/app/components/ui/Button";
import { GenerateExcelErros } from "@/app/components/ui/GenerateExcelErros";
import { Page } from "@/app/components/ux/Page";
import { Pagination } from "@/app/components/ux/Pagination";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { del, getAllOperationError, getAllPagination } from "@/app/service/operational-error";
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
  const [modalRelatory, setModalRelatory] = useState(false)
  const [periodo, setPeriodo] = useState("PAGINA_ATUAL")

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 14;

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
  const closeModalRelatory = () => {
    setModalRelatory(false)
  }

  const handleGenerateRelatory = async () => {
    if(periodo === "PAGINA_ATUAL"){
      await GenerateExcelErros(erros)
    }
    else if(periodo === "TODOS_OS_REGISTROS"){
      const response = await getAllOperationError()
      if(response.status === 300 || response.status === 400 || response.status === 500){
        toast.error('Erro de requisição, tente novamente')
        return
      }
      if(response.status === 200 || response.status === 201){
        await GenerateExcelErros(response.data.operationalError)
      }
      console.log("Erros", response)
    }
  }

  return <Page>
    <TitlePages linkBack="/" icon={faBomb}>Erro Operacional</TitlePages>
    <div className="flex flex-col gap-4 p-5 w-full">
      <div className="flex flex-row gap-3 items-center justify-center mb-4">
        <Button
          color="#2E8857"
          variant={"primary"}
          textColor="white"
          onClick={handleAdd}
          size="medium"
        >Adicionar</Button>

        <Button
          color="#2563EB"
          variant={"primary"}
          textColor="white"
          onClick={() => setModalRelatory(true)}
          size="medium"
        >Gerar Relatório</Button>
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
                <td>{returnNameTreasury(treasuries, item.id_treasury)}</td>
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
                  <Link href={`/operational-error/edit/${item.id}`} >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size="1x"
                      color="#6C8EBF"
                    />
                  </Link>
                  <a href={`/operational-error/del/${item.id}`} onClick={(e) => handleDelete(e, item.id as number)} className="cursor-pointer" >
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
      {erros && totalPages > 1 &&
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      }
    </div>



    {modalRelatory ? (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
          <h2 className="text-xl font-bold mb-4 text-black text-center uppercase">
            Selecionar tipo de relatório
          </h2>
          <div className="w-full  flex justify-center items-center mt-2 mb-2">
            <div className="w-full h-1 bg-zinc-600 rounded"></div>
          </div>
          <div className="mb-4 flex flex-col w-full h-full gap-4 text-black">
            <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 text-lg`} >
              <select
                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
              >

                <option value="PAGINA_ATUAL" className="uppercase bg-slate-700 text-white">
                  PÁGINA ATUAL
                </option>
                 <option value="TODOS_OS_REGISTROS" className="uppercase bg-slate-700 text-white">
                  TODOS OS REGISTROS
                </option>

              </select>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleGenerateRelatory}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Confirmar
            </button>
            <button
              onClick={closeModalRelatory}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    ) : null}
  </Page>
}