"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { TableSearchOrders } from "@/app/components/ux/TableSearchOrders"; 

import { getAll as getAllTreasury } from "@/app/service/treasury";
import { getAll as getAllStatusOrder } from "@/app/service/status-order";
import { getWitchFilters } from "@/app/service/order";

import { faCoins } from "@fortawesome/free-solid-svg-icons";
import type { treasuryType } from "@/types/treasuryType";
import type { statusOrderType } from "@/types/statusOrder";
import type { filterType } from "@/types/filterType";
import type { orderType } from "@/types/orderType";

export default function Dashboard() {
  // Transportadora selecionada (id_treasury_origin)
  const [idTreasuryOrigin, setIdTreasuryOrigin] = useState<string>("");

  // Lista de transportadoras vinda da API
  const [treasuries, setTreasuries] = useState<treasuryType[]>([]);

  // Status de pedido (lista) e seleção (array de ids)
  const [statusOrder, setStatusOrder] = useState<statusOrderType[]>([]);
  const [statusSelected, setStatusSelected] = useState<number[]>([]);

  // Datas do filtro
  const [dateInitial, setDateInitial] = useState<string>("");
  const [dateFinal, setDateFinal] = useState<string>("");

  // Resultado da busca (pedidos filtrados)
  const [filteres, setFilteres] = useState<orderType[]>([]);

  useEffect(() => {
    document.title = "Dashboard de Pedidos";
    void getAllData();
  }, []);

  // input de código da transportadora
  const handleInputChangeOrigin = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIdTreasuryOrigin(event.target.value);
  };

  // select de transportadora
  const handleSelectChangeOrigin = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIdTreasuryOrigin(event.target.value.toString());
  };

  // carrega transportadoras e status de pedido
  const getAllData = async () => {
    // transportadoras
    const transportadora = await getAllTreasury();

    if (
      transportadora.status === 300 ||
      transportadora.status === 400 ||
      transportadora.status === 500
    ) {
      toast.error("Erro na requisição de transportadoras, tentar novamente!");
    }
    if (transportadora.status === 200 && transportadora.data !== undefined) {
      setTreasuries(transportadora.data.treasury);
    }

    // status do pedido
    const allStatusPedido = await getAllStatusOrder();
    if (
      allStatusPedido.status === 300 ||
      allStatusPedido.status === 400 ||
      allStatusPedido.status === 500
    ) {
      toast.error("Erro na requisição de status, tentar novamente!");
    }
    if (allStatusPedido.status === 200 && allStatusPedido.data !== undefined) {
      setStatusOrder(allStatusPedido.data.statusOrder);
    }
  };

  // toggle de seleção de status
  const handleSelectedStatusOrder = (idStatusOrder: number) => {
    setStatusSelected((prev) =>
      prev.includes(idStatusOrder)
        ? prev.filter((id) => id !== idStatusOrder) // desmarca
        : [...prev, idStatusOrder] // marca
    );
  };

  // dispara busca com filtros atuais
  const handleSearchFilters = async () => {
    const data: filterType = {
      transportadora: idTreasuryOrigin,
      statusPedido: statusSelected,
      datas: {
        inicial: dateInitial,
        final: dateFinal,
      },
    };

    const witchFilters = await getWitchFilters(data);

    if (
      witchFilters.status === 300 ||
      witchFilters.status === 400 ||
      witchFilters.status === 500
    ) {
      toast.error("Erro na requisição, tentar novamente!");
      return;
    }

    if (witchFilters.status === 200 && witchFilters.data !== undefined) {
      setFilteres(witchFilters.data.filters);
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/" icon={faCoins}>
        Dashboard de Pedidos
      </TitlePages>

      {/* Filtros */}
      <div className="flex flex-col gap-6">
        {/* Transportadora */}
        <div className="flex flex-col gap-4">
          <label className="uppercase leading-3 font-bold">Transportadora</label>
          <div className="flex gap-2">
            {/* Campo numérico (id) */}
            <div className="flex h-11 w-16 items-center rounded-md border-4 border-slate-600 bg-slate-700 px-2 text-lg">
              <input
                value={idTreasuryOrigin}
                onChange={handleInputChangeOrigin}
                className="m-0 w-full bg-transparent p-0 text-center text-lg text-white outline-none"
              />
            </div>

            {/* Select de transportadora */}
            <div className="flex h-11 w-96 items-center rounded-md border-4 border-slate-600 bg-slate-700 px-2 text-lg">
              <select
                className="m-0 h-full w-full bg-transparent p-0 text-center text-sm text-white outline-none"
                value={idTreasuryOrigin}
                onChange={handleSelectChangeOrigin}
              >
                <option value={""} className="bg-slate-700">
                  Selecione aqui...
                </option>
                {treasuries && treasuries.length > 0 ? (
                  treasuries.map((treasury) => (
                    <option
                      key={treasury.id_system}
                      value={treasury.id_system}
                      className="bg-slate-700"
                    >
                      {treasury.name}
                    </option>
                  ))
                ) : (
                  <option value="" className="bg-slate-700">
                    Sem dados a mostrar
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Datas */}
        <div className="flex flex-col gap-4">
          <label className="uppercase leading-3 font-bold">
            Pesquisa por data
          </label>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={dateInitial}
              onChange={(e) => setDateInitial(e.target.value)}
              className="h-10 w-72 rounded-md text-center text-black outline-none uppercase"
            />
            <div className="text-lg font-bold uppercase">até</div>
            <input
              type="date"
              value={dateFinal}
              onChange={(e) => setDateFinal(e.target.value)}
              className="h-10 w-72 rounded-md text-center text-black outline-none uppercase"
            />
          </div>
        </div>

        {/* Status do Pedido */}
        <div className="flex flex-col gap-4">
          <label className="uppercase leading-3 font-bold">
            Status do Pedido
          </label>
          <div className="flex flex-row flex-wrap gap-4">
            {statusOrder && statusOrder.length > 0 ? (
              statusOrder.map((status) => (
                <div className="flex items-center gap-2" key={status.id}>
                  <input
                    type="checkbox"
                    checked={statusSelected.includes(status.id as number)}
                    onChange={() =>
                      handleSelectedStatusOrder(status.id as number)
                    }
                  />
                  <label className="text-lg text-white">{status.name}</label>
                </div>
              ))
            ) : (
              <div>Sem dados a mostrar</div>
            )}
          </div>
        </div>

        {/* Botão de busca */}
        <div className="flex justify-start">
          <button
            onClick={handleSearchFilters}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Pesquisar
          </button>
        </div>
      </div>

      {/* Tabela de resultados – só mostra se houver filtros retornados */}
      {filteres && filteres.length > 0 && (
        <div className="mt-8">
          <TableSearchOrders orders={filteres} />
        </div>
      )}
    </Page>
  );
}
