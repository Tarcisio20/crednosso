"use client";
import { socket } from "@/lib/socket";
import { Button } from "@/app/components/ui/Button";
import { ButtonScreenOrder } from "@/app/components/ui/ButtonScreenOrder";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { Pagination } from "@/app/components/ux/Pagination";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { atenderOsForDate, atenderOsForIds, getSuppliesOssOpenForDayPagination } from "@/app/service/os";
import { OsOpenType } from "@/types/openOsType";
import {
  faCheck,
  faCheckDouble,
  faEnvelope,
  faEnvelopeOpen,
  faParachuteBox,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export default function Open() {
  const activeJobIdRef = useRef<string | null>(null);

  const [items, setItems] = useState<OsOpenType[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateSelected, setDateSelected] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [modal, setModal] = useState(false)
  const [optionSelected, setOptionSeletected] = useState<string>("SELECTED")
  const pageSize = 15;

  const validIdsOnPage = useMemo(
    () =>
      items
        .map((item) => item.id)
        .filter((id): id is number => typeof id === "number"),
    [items]
  );

  useEffect(() => {
    return () => {
      socket.off("attendos:started");
      socket.off("attendos:progress");
      socket.off("attendos:done");
      socket.off("attendos:error");
    };
  }, []);

  const allSelected =
    validIdsOnPage.length > 0 &&
    validIdsOnPage.every((id) => selectedItems.includes(id));

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
        setSelectedItems([]);
        setTotalPages(1);
        return;
      }

      const result = response?.data?.openos;

      if (!result || !result.data || result.data.length === 0) {
        toast.error("Sem abastecimentos abertos a listar!");
        setItems([]);
        setSelectedItems([]);
        setTotalPages(1);
        return;
      }

      setItems(result.data);
      setSelectedItems([]);
      setTotalPages(result.totalPages ?? 1);
      setCurrentPage(result.page ?? page);
    } catch {
      toast.error("Erro ao buscar abastecimentos abertos!");
      setItems([]);
      setSelectedItems([]);
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

  const handleDelete = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: number
  ) => {
    e.preventDefault();
    alert("Funcionalidade em desenvolvimento!");
  };

  const handleSelectOne = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedItems([]);
      return;
    }

    setSelectedItems(validIdsOnPage);
  };

  const handleAtenderOs = async () => {
    if (loading) return;

    if (optionSelected === "SELECTED" && selectedItems.length === 0) {
      toast.error("Selecione ao menos um abastecimento para atender!");
      return;
    }

    if (optionSelected === "ALL" && !dateSelected) {
      toast.error("Selecione uma data para atender todas as OSs.");
      return;
    }

    setLoading(true);

    try {
      if (!socket.connected) {
        socket.connect();
        await new Promise<void>((resolve) => {
          socket.once("connect", () => resolve());
        });
      }

      const socketId = socket.id;

      if (!socketId) {
        toast.error("Não foi possível obter a conexão do socket.");
        setLoading(false);
        return;
      }

      let startResp: any;

      if (optionSelected === "SELECTED") {
        //console.log("Somente as selecionadas");
        startResp = await atenderOsForIds({
          socketId,
          ids: selectedItems,
        });
      } else {
        //console.log("Todas as OSs");
        startResp = await atenderOsForDate({
          socketId,
          date: dateSelected,
        });
      }

      if (!startResp?.data?.ok || !startResp?.data?.jobId) {
        toast.error(startResp?.data?.error ?? "Erro ao iniciar atendimento das OSs.");
        setLoading(false);
        return;
      }

      const jobId = String(startResp.data.jobId);
      activeJobIdRef.current = jobId;

      toast.message("Processo iniciado. Você pode continuar usando o sistema.");
      setLoading(false);
      setModal(false);

      socket.off("attendos:started");
      socket.off("attendos:progress");
      socket.off("attendos:done");
      socket.off("attendos:error");

      const onStarted = (p: any) => {
        if (String(p?.jobId) !== jobId) return;
        toast.message("Iniciando atendimento das OSs...");
      };

      const onProgress = (p: any) => {
        if (String(p?.jobId) !== jobId) return;
        if (p?.message) console.log("[ATTENDOS][PROGRESS]", p.message);
      };

      const cleanup = () => {
        socket.off("attendos:started", onStarted);
        socket.off("attendos:progress", onProgress);
        socket.off("attendos:done", onDone);
        socket.off("attendos:error", onError);

        if (activeJobIdRef.current === jobId) {
          activeJobIdRef.current = null;
        }
      };

      const onDone = (p: any) => {
        if (String(p?.jobId) !== jobId) return;
        cleanup();

        if (p?.ok) {
          toast.success("OSs atendidas com sucesso!");
          fetchOpenSupplies(currentPage);
          setSelectedItems([]);
        } else {
          toast.error("Processo finalizado, mas houve falhas.");
        }
      };

      const onError = (p: any) => {
        if (String(p?.jobId) !== jobId) return;
        cleanup();
        toast.error(p?.details ?? p?.error ?? "Erro no processamento");
      };

      socket.on("attendos:started", onStarted);
      socket.on("attendos:progress", onProgress);
      socket.on("attendos:done", onDone);
      socket.on("attendos:error", onError);
    } catch (err: any) {
      toast.error(err?.message ?? "Erro inesperado ao iniciar atendimento");
      setLoading(false);
    }
  };


  const OpenModal = async () => {
    console.log("selectedItems", selectedItems)
    if (selectedItems.length === 0) {
      toast.error("Selecione ao menos um abastecimento para atender!");
      return;
    }
    setModal(true)
  }

  return (
    <Page>
      <TitlePages linkBack="/supply" icon={faParachuteBox}>
        Abastecimentos Abertos
      </TitlePages>

      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-5 w-1/3">
          <label className="text-lg uppercase">Data dos abastecimentos</label>
          <div className="flex flex-row gap-2">
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
        </div>

        <div className="flex flex-col gap-5 w-1/3">
          {selectedItems.length > 0 && (
            <ButtonScreenOrder
              color="#415eff"
              onClick={OpenModal}
              size="btn-icon-text"
              textColor="white"
              secondaryColor="#546bec"
              icon={faCheckDouble}
            >Atender OSs</ButtonScreenOrder>
          )}

        </div>

        <table className="flex-1 text-center p-3" width="100%">
          <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-5 h-5 cursor-pointer"
                />
              </th>
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
              items.map((item, index) => {
                const itemId = item.id;
                const isSelected =
                  typeof itemId === "number" && selectedItems.includes(itemId);

                return (
                  <tr
                    key={item.id ?? index}
                    className={`h-12 ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-600"
                      } hover:bg-zinc-300 transition-colors hover:text-black`}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={typeof itemId !== "number"}
                        onChange={() =>
                          typeof itemId === "number" && handleSelectOne(itemId)
                        }
                        className="w-5 h-5 cursor-pointer"
                      />
                    </td>
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
                      <a href={`/supply/open/edit/${item.id}`}>
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          size="1x"
                          color="#6C8EBF"
                        />
                      </a>
                      <a
                        onClick={(e) => handleDelete(e, item.id as number)}
                        className="cursor-pointer"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          size="1x"
                          color="#BF6C6C"
                        />
                      </a>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="h-12 bg-gray-800">
                <td colSpan={10}>Nenhum registro encontrado.</td>
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
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-black">ATENDER OSs</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Marque as Oss de que devem ser atendidas.
            </p>
            <div
              className={`flex bg-slate-700 pt-1 pb-1 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
            >
              <select className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg "
                value={optionSelected}
                onChange={(e) => setOptionSeletected(e.target.value)}
              >
                <option value="SELECTED" className="uppercase bg-slate-700 text-white" >SOMENTE SELECIONADAS</option>
                <option value="ALL" className="uppercase bg-slate-700 text-white" >TODAS DESTA DATA</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded-md bg-zinc-200 px-4 py-2 text-black" onClick={() => setModal(false)} >
                Cancelar
              </button>
              <button className="rounded-md bg-green-600 px-4 py-2 text-white" onClick={handleAtenderOs} >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}