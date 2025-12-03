"use client";

import * as React from "react";
import type { orderType } from "@/types/orderType";

type TableSearchOrdersProps = {
  orders: orderType[];
};

type SortField =
  | "id"
  | "id_type_operation"
  | "id_treasury_origin"
  | "id_treasury_destin"
  | "date_order"
  | "requested_value_A"
  | "requested_value_B"
  | "requested_value_C"
  | "requested_value_D"
  | "status_order";

type SortDirection = "asc" | "desc";

export const TableSearchOrders: React.FC<TableSearchOrdersProps> = ({
  orders,
}) => {
  // campo usado para ordenar
  const [sortField, setSortField] = React.useState<SortField>("id");
  // direção: menor → maior (asc) ou maior → menor (desc)
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>("asc");
  // paginação local
  const [pageSize, setPageSize] = React.useState<number>(20);
  const [pageIndex, setPageIndex] = React.useState<number>(0);

  // sempre que mudar a lista ou o sort, volta pra página 1
  React.useEffect(() => {
    setPageIndex(0);
  }, [orders, sortField, sortDirection, pageSize]);

  // converte valor para algo comparável (number)
  const getComparableValue = (row: orderType, field: SortField): number => {
    const value = row[field];

    if (field === "date_order" && typeof value === "string") {
      const time = new Date(value).getTime();
      return Number.isNaN(time) ? 0 : time;
    }

    if (typeof value === "number") return value;
    if (typeof value === "boolean") return value ? 1 : 0;
    if (typeof value === "string") {
      // tenta converter pra número, se não der fica 0
      const n = Number(value);
      return Number.isNaN(n) ? 0 : n;
    }

    return 0;
  };

  // ordena os dados conforme campo + direção
  const sortedOrders = React.useMemo(() => {
    const cloned = [...orders];

    cloned.sort((a, b) => {
      const aVal = getComparableValue(a, sortField);
      const bVal = getComparableValue(b, sortField);

      if (aVal === bVal) return 0;

      if (sortDirection === "asc") {
        return aVal < bVal ? -1 : 1;
      } else {
        return aVal > bVal ? -1 : 1;
      }
    });

    return cloned;
  }, [orders, sortField, sortDirection]);

  // paginação em cima do array ordenado
  const pageCount = Math.max(
    1,
    Math.ceil(sortedOrders.length / (pageSize || 1))
  );
  const currentPage = Math.min(pageIndex, pageCount - 1);

  const paginatedOrders = React.useMemo(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return sortedOrders.slice(start, end);
  }, [sortedOrders, currentPage, pageSize]);

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (v: number) =>
    (v ?? 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });

  return (
    <div className="mt-8 space-y-4">
      {/* cabeçalho / controles */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Pedidos encontrados</h2>
          <p className="text-xs text-muted-foreground">
            Total: {orders.length} registro(s)
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3 text-sm">
          {/* Campo de ordenação */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Ordenar por
            </label>
            <select
              className="h-8 rounded-md border bg-background px-2 text-xs"
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
            >
              <option value="id">ID</option>
              <option value="date_order">Data do pedido</option>
              <option value="id_treasury_origin">Transportadora origem</option>
              <option value="id_treasury_destin">Transportadora destino</option>
              <option value="requested_value_A">Valor A</option>
              <option value="requested_value_B">Valor B</option>
              <option value="requested_value_C">Valor C</option>
              <option value="requested_value_D">Valor D</option>
              <option value="status_order">Status</option>
            </select>
          </div>

          {/* Direção: menor → maior / maior → menor */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Direção
            </label>
            <select
              className="h-8 rounded-md border bg-background px-2 text-xs"
              value={sortDirection}
              onChange={(e) =>
                setSortDirection(e.target.value as SortDirection)
              }
            >
              <option value="asc">Menor → Maior</option>
              <option value="desc">Maior → Menor</option>
            </select>
          </div>

          {/* Page size */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Itens por página
            </label>
            <select
              className="h-8 rounded-md border bg-background px-2 text-xs"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value) || 10)}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full border-collapse text-xs">
          <thead className="bg-muted/60">
            <tr>
              <th className="border-b px-2 py-2 text-left">ID</th>
              <th className="border-b px-2 py-2 text-left">Data</th>
              <th className="border-b px-2 py-2 text-left">Origem</th>
              <th className="border-b px-2 py-2 text-left">Destino</th>
              <th className="border-b px-2 py-2 text-right">Valor A</th>
              <th className="border-b px-2 py-2 text-right">Valor B</th>
              <th className="border-b px-2 py-2 text-right">Valor C</th>
              <th className="border-b px-2 py-2 text-right">Valor D</th>
              <th className="border-b px-2 py-2 text-center">Status</th>
              <th className="border-b px-2 py-2 text-left">Obs.</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-3 py-4 text-center text-xs text-muted-foreground"
                >
                  Nenhum pedido encontrado para os filtros informados.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <td className="border-b px-2 py-1">{order.id}</td>
                  <td className="border-b px-2 py-1">
                    {formatDate(order.date_order)}
                  </td>
                  <td className="border-b px-2 py-1">
                    {order.id_treasury_origin}
                  </td>
                  <td className="border-b px-2 py-1">
                    {order.id_treasury_destin}
                  </td>
                  <td className="border-b px-2 py-1 text-right">
                    {formatCurrency(order.requested_value_A)}
                  </td>
                  <td className="border-b px-2 py-1 text-right">
                    {formatCurrency(order.requested_value_B)}
                  </td>
                  <td className="border-b px-2 py-1 text-right">
                    {formatCurrency(order.requested_value_C)}
                  </td>
                  <td className="border-b px-2 py-1 text-right">
                    {formatCurrency(order.requested_value_D)}
                  </td>
                  <td className="border-b px-2 py-1 text-center">
                    {order.status_order}
                  </td>
                  <td className="border-b px-2 py-1 max-w-[220px] truncate">
                    {order.observation}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação – controles de página */}
      {paginatedOrders.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-2 text-xs md:flex-row">
          <div className="text-muted-foreground">
            Página {currentPage + 1} de {pageCount}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              Anterior
            </button>
            <button
              type="button"
              className="rounded-md border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))
              }
              disabled={currentPage >= pageCount - 1}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
