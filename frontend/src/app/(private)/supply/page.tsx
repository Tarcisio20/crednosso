"use client";

import { Button } from "@/app/components/ui/Button";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { Pagination } from "@/app/components/ux/Pagination";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  getSuppliesByDate,
  getSuppliesForDayPagination,
} from "@/app/service/supply";
import { generateExcelOs } from "@/app/utils/generateExcelOs";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { returnDayAtual } from "@/app/utils/returnDayAtual";
import { returnDayAtualForInput } from "@/app/utils/returnDayAtualForInput";
import { supplyType } from "@/types/supplyType";
import { faParachuteBox } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Supply() {
  const [supplies, setSupplies] = useState<supplyType[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentDay, setCurrentDay] = useState("");
  const [dateSupply, setDateSupply] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    document.title = "Pedidos | CredNosso";
    const day = returnDayAtual();
    const dayForInput = returnDayAtualForInput();

    if (day) {
      setCurrentDay(day);
      setDateSupply(dayForInput);
    }
  }, []);

  const handleGenerateOrders = async () => {
    try {
      setLoading(true);

      const response = await getSuppliesByDate({ date: dateSupply });

      if (
        response.status === 300 ||
        response.status === 400 ||
        response.status === 500
      ) {
        toast.error("Sem abastecimentos para gerar excel!");
        return;
      }

      const allSupplies = response?.data?.supply ?? [];

      if (!allSupplies || allSupplies.length === 0) {
        toast.error("Nenhum abastecimento para gerar excel!");
        return;
      }

      const ok = await generateExcelOs(allSupplies);

      if (!ok) {
        toast.error("Erro ao gerar excel!");
        return;
      }

      toast.success("Excel gerado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar excel!");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    router.push("/supply/add");
  };

  const handleOpen = () => {
    router.push("/supply/open");
  };

  const handleDaySupplies = async () => {
    setLoading(true);

    try {
      const data = {
        date: currentDay,
      };

      const supplayDay = await getSuppliesForDayPagination(
        data,
        currentPage,
        pageSize
      );

      if (
        supplayDay.Status === 300 ||
        supplayDay.Status === 400 ||
        supplayDay.Status === 500
      ) {
        toast.error("Erro na requisição, tente novamente!");
        setSupplies([]);
        return;
      }

      if (supplayDay.data !== undefined && supplayDay.status === 200) {
        setSupplies(supplayDay.data.supply.data ?? []);
        setTotalPages(supplayDay.data.supply.totalPages ?? 1);
        return;
      }

      setSupplies([]);
      toast.error("Nenhum abastecimento cadastrado para hoje!");
    } catch (error) {
      console.error(error);
      setSupplies([]);
      toast.error("Erro ao buscar abastecimentos!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentDay) return;
    handleDaySupplies();
  }, [currentDay, currentPage]);

  const handleSuppliesDay = async () => {
    try {
      setLoading(true);

      const response = await getSuppliesByDate({ date: dateSupply });

      if (
        response.status === 300 ||
        response.status === 400 ||
        response.status === 500
      ) {
        toast.error("Sem abastecimentos a listar!");
        setSupplies([]);
        setTotalPages(1);
        setCurrentPage(1);
        return;
      }

      if (response.status === 200 && response.data?.supply?.length === 0) {
        toast.error("Sem abastecimentos a listar!");
        setSupplies([]);
        setTotalPages(1);
        setCurrentPage(1);
        return;
      }

      if (response.status === 200 && response.data?.supply?.length > 0) {
        setSupplies(response.data.supply);
        setTotalPages(1);
        setCurrentPage(1);
        return;
      }

      toast.error("Sem abastecimentos a listar!");
      setSupplies([]);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      toast.error("Sem abastecimentos a listar!");
      setSupplies([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/" icon={faParachuteBox}>
        Abastecimento
      </TitlePages>

      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-row gap-3 items-center justify-center mb-4 flex-wrap">
          <Button
            color="#2E8B57"
            textColor="white"
            onClick={handleAdd}
            size="medium"
          >
            Adicionar Abastecimento
          </Button>

          <Button
            color="#2E8B57"
            textColor="white"
            onClick={handleOpen}
            size="medium"
          >
            OSs Abertas
          </Button>

          {supplies && supplies.length > 0 && (
            <Button
              color="#2E8B57"
              variant={"primary"}
              disabled={loading}
              textColor="white"
              onClick={handleGenerateOrders}
              size="medium"
            >
              Gerar Excel
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-5 w-full md:w-1/3">
          <label className="text-lg uppercase">Data do pedido</label>

          <input
            type="date"
            value={dateSupply}
            onChange={(e) => setDateSupply(e.target.value)}
            className="w-full h-10 outline-none rounded-md text-black text-center uppercase"
          />

          <button
            onClick={handleSuppliesDay}
            className="bg-green-700 hover:bg-green-800 transition-colors rounded-md h-10 px-4 text-white font-medium"
          >
            Buscar
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-center p-3 min-w-[900px]">
            <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl">
              <tr>
                <th>ID</th>
                <th>Id Atm</th>
                <th>Nome Atm</th>
                <th>Cassete A</th>
                <th>Cassete B</th>
                <th>Cassete C</th>
                <th>Cassete D</th>
                <th>Total</th>
                <th>Ação</th>
              </tr>
            </thead>

            <tbody className="text-xl">
              {supplies &&
                supplies.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`h-12 ${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-600"
                    } hover:bg-zinc-300 transition-colors hover:text-black`}
                  >
                    <td>{item.id}</td>
                    <td>{item.id_atm}</td>
                    <td>{item.atm?.name ?? "-"}</td>
                    <td>{item.cassete_A}</td>
                    <td>{item.cassete_B}</td>
                    <td>{item.cassete_C}</td>
                    <td>{item.cassete_D}</td>
                    <td>
                      {generateRealTotal(
                        (item.cassete_A ?? 0) * 10,
                        (item.cassete_B ?? 0) * 20,
                        (item.cassete_C ?? 0) * 50,
                        (item.cassete_D ?? 0) * 100
                      )}
                    </td>
                    <td>Excluir</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {supplies && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        )}

        {loading && <Loading />}
      </div>
    </Page>
  );
}