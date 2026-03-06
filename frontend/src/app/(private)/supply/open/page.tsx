"use client"

import { Button } from "@/app/components/ui/Button";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { Pagination } from "@/app/components/ux/Pagination";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getSuppliesOssOpenForDayPagination } from "@/app/service/os";
import { OsOpenType } from "@/types/openOsType";
import { faCheck, faEnvelope, faEnvelopeOpen, faEnvelopeOpenText, faParachuteBox, faPenToSquare, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Open() {
  const [items, setItems] = useState<OsOpenType[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateSelected, setDateSelected] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  const fetchOpenSupplies = async (page = 1) => {
    if (!dateSelected) {
      toast.error("Selecione uma data para pesquisar!");
      return;
    }

    setLoading(true);

    try {
      const response = await getSuppliesOssOpenForDayPagination(
        dateSelected,
        page,
        pageSize
      );

      if (
        response.status === 300 ||
        response.status === 400 ||
        response.status === 500
      ) {
        toast.error("Erro ao buscar abastecimentos abertos!");
        setItems([]);
        setTotalPages(1);
        return;
      }

      const result = response?.data?.openos;
      console.log("result", result);
      if (!result || !result.data || result.data.length === 0) {
        toast.error("Sem abastecimentos abertos a listar!");
        setItems([]);
        setTotalPages(1);
        return;
      }

      setItems(result.data);
      setTotalPages(result.totalPages ?? 1);
      setCurrentPage(result.page ?? page);
    } catch (error) {
      toast.error("Erro ao buscar abastecimentos abertos!");
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    await fetchOpenSupplies(1);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchOpenSupplies(page);
  };

  const handleDelete = async (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    alert("Funcionalidade em desenvolvimento!");
  }

  return (
    <Page>
      <TitlePages linkBack="/supply" icon={faParachuteBox}>
        Abastecimentos Abertos
      </TitlePages>

      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-5 w-1/3">
          <label className="text-lg uppercase">Data dos abastecimentos</label>
          <input
            type="date"
            value={dateSelected}
            onChange={(e) => setDateSelected(e.target.value)}
            className="w-full h-10 outline-none rounded-md text-black text-center uppercase"
          />
          <Button
            color="#2E8B57"
            variant="primary"
            textColor="white"
            onClick={handleSearch}
            size="medium"
            disabled={loading}
          >
            Pesquisar
          </Button>
        </div>

        <table className="flex-1 text-center p-3" width="100%">
          <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl">
            <tr>
              <th>ID</th>
              <th>Terminal</th>
              <th>OS</th>
              <th>Situação</th>
              <th>Valor</th>
              <th>Email</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody className="text-xl">
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr
                  key={item.id ?? index}
                  className={`h-12 ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-600"
                    } hover:bg-zinc-300 transition-colors hover:text-black`}
                >
                  <td>{item.id ?? "-"}</td>
                  <td>{`${item.terminal} - ${item.atm_name}`}</td>
                  <td>{item.os ?? "-"}</td>
                  <td>{item.situacao ?? "-"}</td>
                  <td>{item.valor ?? "-"}</td>
                  <td>
                    {item.send_email ? (
                      <FontAwesomeIcon
                        icon={faEnvelopeOpen}
                        size="2x"
                        color="#2E8B57"
                      />

                    ) : (
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        size="2x"
                        color="#BF6C6C"
                      />
                    )}

                  </td>
                  <td>
                    {item.date_os
                      ? new Date(item.date_os).toLocaleString("pt-BR")
                      : "-"}
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
                    <a href={`/supply/open/edit/${item.id}`} >
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        size="1x"
                        color="#6C8EBF"
                      />
                    </a>
                    <a
                      // href={`/atm/del/${item.id_system}`} 
                      onClick={(e) => handleDelete(e, item.id as number)} className="cursor-pointer" >
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="1x"
                        color="#BF6C6C"
                      />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="h-12 bg-gray-800">
                <td colSpan={9}>Nenhum registro encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>

        {items.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {loading && <Loading />}
      </div>
    </Page>
  );
}