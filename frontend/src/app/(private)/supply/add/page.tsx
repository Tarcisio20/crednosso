"use client";

import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { delIndividualSupply, getSuppliesForDay, saveIndividualSupply } from "@/app/service/supply";
import { Button } from "@/app/components/ui/Button";
import {
  faBroom,
  faDivide,
  faEdit,
  faParachuteBox,
  faSave,
  faTable,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { isValidDateString } from "@/app/utils/isValidDateString";
import { ButtonScreenOrder } from "@/app/components/ui/ButtonScreenOrder";
import { generateReal } from "@/app/utils/generateReal";
import { generateFullReal } from "@/app/utils/generateFullReal";
import { ModalTrocaTotal } from "@/app/components/ui/Modal/ModalTrocaTotal";
import { validatorDate } from "@/app/utils/validatorDate";
import { isPar } from "@/app/utils/isPar";
import { formatDateToString } from "@/app/utils/formatDateToString";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { ModalOS } from "@/app/components/ui/Modal/ModalOS";
import { getOrderForDay } from "@/app/service/order";
import { orderToSupplyType } from "@/types/orderToSupply";
import { treasuryType } from "@/types/treasuryType";
import ModalEditSupply from "@/app/components/ui/Modal/ModalEditSupply";

export type supplyProps = {
  id?: number;
  id_atm: number;
  id_order?: number;
  id_treasury: number;
  name: string;
  date: Date;
  date_on_supply?: string;
  short_name: string;
  total_exchange: boolean;
  cassete_A: number;
  cassete_B: number;
  cassete_C: number;
  cassete_D: number;
};

export type atmForSupplyProps = {
  id: number;
  id_treasury: number;
  cassete_A: number;
  cassete_B: number;
  cassete_C: number;
  cassete_D: number;
  id_system: number;
  name: string;
  short_name: string;
};

export default function SupplyAdd() {
  const [treasuries, setTreasuries] = useState<treasuryType[]>([]);
  const [orders, setOrders] = useState<orderToSupplyType[] | null>(null);
  const [atms, setAtms] = useState<atmForSupplyProps[] | null>(null);

  const [ordersSelected, setOrdersSelected] = useState<orderToSupplyType[] | null>(null);
  const [atmsTreasurySelected, setAtmsTreasurySelected] = useState<atmForSupplyProps[]>([]);
  const [idAtm, setIdAtm] = useState<string>("0");
  const [idTreasury, setIdTreasury] = useState<string>("0");

  const [suplies, setSuplies] = useState<supplyProps[] | null>([]);
  const [suppliesSelected, setSuppliesSelected] = useState<Partial<supplyProps>[]>([]);

  const [valueA, setValueA] = useState<number>(0);
  const [valueB, setValueB] = useState<number>(0);
  const [valueC, setValueC] = useState<number>(0);
  const [valueD, setValueD] = useState<number>(0);
  const [trocaTotal, setTrocaTotal] = useState<boolean>(false);
  const [dateForOS, setDateForOS] = useState<string>("");

  const [dateSelected, setDateSelected] = useState<string>("");
  const [orderInUse, setOrderInUse] = useState<orderToSupplyType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);
  const [showModalOS, setShowModalOS] = useState(false);

  const [orderFiltered, setOrderFiltered] = useState<orderToSupplyType[]>([]);
  const [modalEditSupply, setModalEditSupply] = useState<Partial<supplyProps> | null>(null);

  const getOrderByIdSystem = (id: number) => {
    const encontrados = orderFiltered.filter((o) => Number((o as any).treasury) === Number(id));
    setOrdersSelected(encontrados);

    if (encontrados.length > 0) setOrderInUse(encontrados[0]);
    else setOrderInUse(null);
  };

  const getOrderByTreasuryDestin = (ordersArr: orderToSupplyType[], id: number) => {
    return ordersArr.find((order) => Number((order as any).treasury) === Number(id)) || null;
  };

  // saldo atual (já descontando suppliesSelected)
  function handleGenerateEmTesouraria(valorTesouraria: number, typeCassete: number) {
    let valor = 0;

    if (suppliesSelected.length > 0) {
      suppliesSelected.forEach((supply) => {
        switch (typeCassete) {
          case 10:
            valor += Number((supply as any).cassete_A ?? 0);
            break;
          case 20:
            valor += Number((supply as any).cassete_B ?? 0);
            break;
          case 50:
            valor += Number((supply as any).cassete_C ?? 0);
            break;
          case 100:
            valor += Number((supply as any).cassete_D ?? 0);
            break;
        }
      });

      return valorTesouraria - valor;
    }

    return valorTesouraria;
  }

  const availableA = Math.max(0, handleGenerateEmTesouraria((orderInUse as any)?.cassete_a ?? 0, 10));
  const availableB = Math.max(0, handleGenerateEmTesouraria((orderInUse as any)?.cassete_b ?? 0, 20));
  const availableC = Math.max(0, handleGenerateEmTesouraria((orderInUse as any)?.cassete_c ?? 0, 50));
  const availableD = Math.max(0, handleGenerateEmTesouraria((orderInUse as any)?.cassete_d ?? 0, 100));

  // o que aparece no “Em Tesouraria” enquanto digita a OS nova
  const displayA = Math.max(0, availableA - (valueA ?? 0));
  const displayB = Math.max(0, availableB - (valueB ?? 0));
  const displayC = Math.max(0, availableC - (valueC ?? 0));
  const displayD = Math.max(0, availableD - (valueD ?? 0));

  const getTreasuriesInorder = async () => {
    setLoading(true);
    setValueA(0);
    setValueB(0);
    setValueC(0);
    setValueD(0);
    setTrocaTotal(false);

    if (!dateSelected || dateSelected === "") {
      setOrders(null);
      setAtmsTreasurySelected([]);
      setOrderInUse(null);
      toast.error("Selecione uma data válida para buscar os pedidos.");
      setLoading(false);
      return;
    }

    if (isValidDateString(dateSelected) === false) {
      setOrders(null);
      setAtms(null);
      setOrderInUse(null);
      setAtmsTreasurySelected([]);
      toast.error("Data inválida, verifique o formato (DD/MM/YYYY).");
      setLoading(false);
      return;
    }

    const ordersBack = await getOrderForDay(dateSelected);
    if (ordersBack.data.orders.length === 0) {
      setOrders(null);
      setAtms(null);
      setOrderInUse(null);
      setAtmsTreasurySelected([]);
      toast.error("Nenhum pedido encontrado para a data selecionada.");
      setLoading(false);
      return;
    }

    const or = ordersBack.data.orders ?? [];
    setOrders(ordersBack.data.orders);

    const supplyBack = await getSuppliesForDay({ date: dateSelected });
    setSuplies((supplyBack.data.supply ?? []) as any);

    const su = supplyBack.data.supply ?? [];
    const ordersComRestante = or.map((order: orderToSupplyType) => {
      const suppliesDaOrder = su.filter(
        (s: any) =>
          Number(s.id_order) === Number((order as any).id_order) &&
          Number(s.id_treasury) === Number((order as any).treasury)
      );

      const sum = suppliesDaOrder.reduce(
        (acc: any, s: any) => {
          acc.a += Number(s.cassete_A ?? 0);
          acc.b += Number(s.cassete_B ?? 0);
          acc.c += Number(s.cassete_C ?? 0);
          acc.d += Number(s.cassete_D ?? 0);
          return acc;
        },
        { a: 0, b: 0, c: 0, d: 0 }
      );

      const rest = {
        a: Number((order as any).cassete_a ?? 0) - sum.a,
        b: Number((order as any).cassete_b ?? 0) - sum.b,
        c: Number((order as any).cassete_c ?? 0) - sum.c,
        d: Number((order as any).cassete_d ?? 0) - sum.d,
      };

      return {
        ...order,
        supplies: suppliesDaOrder,
        supply_sum: sum,
        restante: rest,
      } as any;
    });

    setOrderFiltered(ordersComRestante as any);

    setAtms(null);
    setLoading(false);
  };

  const treasuryOptions = useMemo<{ id: number; name: string }[]>(() => {
    const map = new Map<number, string>();
    for (const o of orderFiltered) {
      const id = Number((o as any).treasury);
      const name = String((o as any).treasury_name ?? "").trim();
      if (!map.has(id)) map.set(id, name || `Tesouraria ${id}`);
    }
    return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) => a.id - b.id);
  }, [orderFiltered]);

  const atmOptions = useMemo<{ id_system: number; name: string }[]>(() => {
    const treasuryId = Number(idTreasury);
    if (!treasuryId || treasuryId === 0) return [];

    const ordersDaTesouraria = orderFiltered.filter((o) => Number((o as any).treasury) === treasuryId);
    const map = new Map<number, string>();

    for (const o of ordersDaTesouraria) {
      for (const a of ((o as any).atm ?? []) as any[]) {
        const id = Number(a.id_system);
        const name = String(a.name ?? "").trim();
        if (!map.has(id)) map.set(id, name || `ATM ${id}`);
      }
    }

    return Array.from(map, ([id, name]) => ({ id_system: id, name })).sort(
      (a, b) => a.id_system - b.id_system
    );
  }, [orderFiltered, idTreasury]);

  // ✅ mapa: tesouraria -> tem sobra?
  const treasuryHasSobraMap = useMemo(() => {
    const m = new Map<number, boolean>();

    for (const o of orderFiltered as any[]) {
      const tid = Number(o.treasury);
      const r = o.restante ?? { a: 0, b: 0, c: 0, d: 0 };

      const has =
        Number(r.a ?? 0) > 0 ||
        Number(r.b ?? 0) > 0 ||
        Number(r.c ?? 0) > 0 ||
        Number(r.d ?? 0) > 0;

      if (!m.has(tid)) m.set(tid, has);
      else if (has) m.set(tid, true);
    }

    return m;
  }, [orderFiltered]);

  const selectedTreasuryHasSobra = useMemo(() => {
    const tid = Number(idTreasury);
    if (!tid) return false;
    return treasuryHasSobraMap.get(tid) ?? false;
  }, [idTreasury, treasuryHasSobraMap]);

  // Mapas para ModalOS (nomes vindos das ORDERS)
  const treasuryMap = useMemo(() => {
    const m = new Map<number, string>();
    for (const o of orders ?? []) {
      const id = Number((o as any).treasury);
      const name = String((o as any).treasury_name ?? "").trim();
      if (id) m.set(id, name || `Tesouraria ${id}`);
    }
    return m;
  }, [orders]);

  const atmMap = useMemo(() => {
    const m = new Map<number, string>();
    for (const o of orders ?? []) {
      for (const a of (((o as any).atm ?? []) as any[])) {
        const id = Number(a.id_system);
        const name = String(a.short_name ?? a.name ?? "").trim();
        if (id) m.set(id, name || `ATM ${id}`);
      }
    }
    return m;
  }, [orders]);

  // auto-select 1ª tesouraria
  useEffect(() => {
    if (treasuryOptions.length === 0) return;

    const firstId = String(treasuryOptions[0].id);
    const currentValid = treasuryOptions.some((t) => String(t.id) === String(idTreasury));

    if (!currentValid || idTreasury === "0") {
      setIdTreasury(firstId);

      const treasuryIdNum = Number(firstId);
      getOrderByIdSystem(treasuryIdNum);

      const newOrder = getOrderByTreasuryDestin(orderFiltered, treasuryIdNum);
      setOrderInUse(newOrder);

      setSuppliesSelected([]);
      setIdAtm("0");
    }
  }, [treasuryOptions, orderFiltered]); // eslint-disable-line react-hooks/exhaustive-deps

  // auto-select 1º ATM
  useEffect(() => {
    if (atmOptions.length === 0) return;
    const firstAtm = String(atmOptions[0].id_system);
    const currentValid = atmOptions.some((a) => String(a.id_system) === String(idAtm));
    if (!currentValid || idAtm === "0") setIdAtm(firstAtm);
  }, [atmOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  // mantém suppliesSelected sincronizado (dia + tesouraria + lote)
  useEffect(() => {
    if (!orderInUse) {
      setSuppliesSelected([]);
      return;
    }

    const list = suplies ?? [];
    const selecionados = list.filter(
      (s: any) =>
        Number(s.id_treasury) === Number(idTreasury) &&
        Number(s.id_order) === Number((orderInUse as any).id_order)
    );

    setSuppliesSelected(selecionados);
  }, [suplies, orderInUse, idTreasury]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const onlyDigits = raw.replace(/\D/g, "");
    const next = onlyDigits === "" ? "0" : onlyDigits;

    setIdTreasury(next);

    const treasuryIdNum = Number(next);
    const exists = treasuryOptions.some((t) => Number(t.id) === treasuryIdNum);
    if (exists) {
      getOrderByIdSystem(treasuryIdNum);
      const newOrder = getOrderByTreasuryDestin(orderFiltered, treasuryIdNum);
      setOrderInUse(newOrder);

      setIdAtm("0");
      setValueA(0);
      setValueB(0);
      setValueC(0);
      setValueD(0);
      setTrocaTotal(false);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const treasuryId = Number(event.target.value);

    setIdTreasury(String(treasuryId));
    getOrderByIdSystem(treasuryId);

    const newOrder = getOrderByTreasuryDestin(orderFiltered, treasuryId);
    setOrderInUse(newOrder);

    setIdAtm("0");
    setValueA(0);
    setValueB(0);
    setValueC(0);
    setValueD(0);
    setTrocaTotal(false);
  };

  const handleSelectChangeAtm = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIdAtm(event.target.value);
  };

  const handleInputChangeAtm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const onlyDigits = raw.replace(/\D/g, "");
    setIdAtm(onlyDigits === "" ? "0" : onlyDigits);
  };

  const handleSelectChangeOrder = (id: number) => {
    if (!ordersSelected) return;

    const encontrado = ordersSelected.find((o: any) => Number(o.id_order) === Number(id)) ?? null;

    if (encontrado) {
      setOrderInUse(encontrado);

      setValueA(0);
      setValueB(0);
      setValueC(0);
      setValueD(0);
      setTrocaTotal(false);
    } else {
      setOrderInUse(null);
      setSuppliesSelected([]);
    }
  };

  const handleButtonDivider = () => {
    setLoading(true);
    const qtAtms = atmsTreasurySelected?.length ?? 1;

    const vA =
      (orderInUse as any)?.confirmed_value_A > 0
        ? (orderInUse as any)?.confirmed_value_A
        : (orderInUse as any)?.requested_value_A;
    const vB =
      (orderInUse as any)?.confirmed_value_B > 0
        ? (orderInUse as any)?.confirmed_value_B
        : (orderInUse as any)?.requested_value_B;
    const vC =
      (orderInUse as any)?.confirmed_value_C > 0
        ? (orderInUse as any)?.confirmed_value_C
        : (orderInUse as any)?.requested_value_C;
    const vD =
      (orderInUse as any)?.confirmed_value_D > 0
        ? (orderInUse as any)?.confirmed_value_D
        : (orderInUse as any)?.requested_value_D;

    if (qtAtms > 1) {
      if (isPar(vA as number) && isPar(vB as number) && isPar(vC as number) && isPar(vD as number)) {
        if (validatorDate(dateForOS)) {
          setShowModal(true);
        } else {
          toast.error("Digite uma data válida para conntinuar!");
          setLoading(false);
          return;
        }
      } else {
        toast.error("Os valores precisam ser par para essa função!");
        return;
      }
    }
  };

  const handleChangeSuplies = (e: React.ChangeEvent<HTMLInputElement>, type: number) => {
    const digitado = parseInt(e.target.value !== "" ? e.target.value : "0", 10);

    if (type === 10) {
      if (digitado > availableA) return toast.error("Valor digitado maior que o disponível em tesouraria.");
      setValueA(digitado);
      return;
    }
    if (type === 20) {
      if (digitado > availableB) return toast.error("Valor digitado maior que o disponível em tesouraria.");
      setValueB(digitado);
      return;
    }
    if (type === 50) {
      if (digitado > availableC) return toast.error("Valor digitado maior que o disponível em tesouraria.");
      setValueC(digitado);
      return;
    }
    if (type === 100) {
      if (digitado > availableD) return toast.error("Valor digitado maior que o disponível em tesouraria.");
      setValueD(digitado);
      return;
    }
  };

  const handleSaveIndovidual = async () => {
    setLoading(true);

    if (!orderInUse) {
      toast.error("Selecione um lote para continuar!");
      setLoading(false);
      return;
    }

    if (valueA === 0 && valueB === 0 && valueC === 0 && valueD === 0) {
      toast.error("Preencha pelo menos um valor para continuar!");
      setLoading(false);
      return;
    }

    if (!validatorDate(dateForOS)) {
      toast.error("Digite uma data válida para conntinuar!");
      setLoading(false);
      return;
    }

    const payload: Partial<supplyProps> = {
      id_order: Number((orderInUse as any).id_order),
      id_treasury: Number(idTreasury),
      id_atm: Number(idAtm),
      cassete_A: valueA ?? 0,
      cassete_B: valueB ?? 0,
      cassete_C: valueC ?? 0,
      cassete_D: valueD ?? 0,
      date_on_supply: dateForOS,
      total_exchange: trocaTotal,
      date: (orderInUse as any).date_order as any,
      name: "",
      short_name: "",
    };

    const saveSupply = await saveIndividualSupply(payload);

    if (saveSupply.status === 400 || saveSupply.status === 500 || saveSupply.status === 300) {
      toast.error(saveSupply.message);
      setLoading(false);
      return;
    }

    const createdRaw: any = (saveSupply as any)?.data?.supply ?? (saveSupply as any)?.data ?? payload;

    const created: Partial<supplyProps> = {
      ...payload,
      ...createdRaw,
      id: createdRaw?.id ?? payload.id,
      id_treasury: Number(createdRaw?.id_treasury ?? payload.id_treasury),
      id_order: Number(createdRaw?.id_order ?? payload.id_order),
      id_atm: Number(createdRaw?.id_atm ?? payload.id_atm),
      cassete_A: Number(createdRaw?.cassete_A ?? payload.cassete_A ?? 0),
      cassete_B: Number(createdRaw?.cassete_B ?? payload.cassete_B ?? 0),
      cassete_C: Number(createdRaw?.cassete_C ?? payload.cassete_C ?? 0),
      cassete_D: Number(createdRaw?.cassete_D ?? payload.cassete_D ?? 0),
      total_exchange: Boolean(createdRaw?.total_exchange ?? payload.total_exchange ?? false),
      date_on_supply: createdRaw?.date_on_supply ?? payload.date_on_supply,
    };

    setSuplies((prev) => {
      const list = prev ?? [];
      const id = (created as any).id;
      if (id && list.some((x: any) => Number(x.id) === Number(id))) return list;
      return [created as any, ...list];
    });

    const same =
      Number((created as any).id_treasury) === Number(idTreasury) &&
      Number((created as any).id_order) === Number((orderInUse as any).id_order);

    if (same) {
      setSuppliesSelected((prev) => {
        const list = prev ?? [];
        const id = (created as any).id;
        if (id && list.some((x: any) => Number((x as any).id) === Number(id))) return list;
        return [created as any, ...list];
      });
    }

    setValueA(0);
    setValueB(0);
    setValueC(0);
    setValueD(0);
    setTrocaTotal(false);

    toast.success("Abastecimento adicionado com sucesso!");
    setLoading(false);
  };

  const handleSetDateForOs = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDateForOS(e.target.value);
  };

  const handleCloseModal = () => {
    setLoading(false);
    setShowModal(false);
    getTreasuriesInorder();
  };

  const handleDelSupply = async (id: number) => {
    const ok = window.confirm("Tem certeza que deseja excluir esta OS?");
    if (!ok) return;

    setLoading(true);

    const del = await delIndividualSupply(id);

    if (del.status === 400 || del.status === 500 || del.status === 300) {
      toast.error(del.message);
      setLoading(false);
      return;
    }
    setSuplies((prev) => (prev ?? []).filter((s: any) => Number(s.id) !== Number(id)));
    setSuppliesSelected((prev) => (prev ?? []).filter((s: any) => Number((s as any).id) !== Number(id)));

    toast.success("Abastecimento excluído com sucesso!");
    setLoading(false);
  };

  const handleCleanButton = () => {
    setValueA(0);
    setValueB(0);
    setValueC(0);
    setValueD(0);
    setTrocaTotal(false);
  };

  const handleGenerateOS = () => {
    setLoading(true);
    setShowModalOS(true);
  };

  const handleCloseModalOS = () => {
    setLoading(false);
    setShowModalOS(false);
  };

  const handleCloseModalEditSupply = () => {
    setModalEditSupply(null);
  };

  const handleOpenEditSupply = (s: Partial<supplyProps>) => {
    setModalEditSupply(s);
  };

  const handleApplySupplyUpdate = (updated: Partial<supplyProps>) => {
    const id = Number((updated as any).id);
    if (!id) {
      setModalEditSupply(null);
      return;
    }

    setSuplies((prev) => {
      const list = prev ?? [];
      return list.map((s: any) => (Number(s.id) === id ? ({ ...s, ...updated } as any) : s));
    });

    setSuppliesSelected((prev) => {
      const list = prev ?? [];
      return list.map((s: any) => (Number(s.id) === id ? ({ ...s, ...updated } as any) : s));
    });

    setModalEditSupply(null);
  };

  return (
    <Page>
      <TitlePages linkBack="/supply" icon={faParachuteBox}>
        Adicionar Abastecimento
      </TitlePages>

      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-5 max-w-[300px]">
            <label className="uppercase leading-3 font-bold">Data do Pedido</label>
            <input
              color="#DDDD"
              className="border border-gray-300 rounded p-2 w-full text-black text-center max-w-[300px]"
              placeholder="(DD/MM/YYYY)"
              type="date"
              value={dateSelected}
              onChange={(e) => setDateSelected(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-5 max-w-[300px]">
            <Button
              color="#2E8B57"
              variant="primary"
              textColor="white"
              onClick={getTreasuriesInorder}
              size="medium"
            >
              Pesquisar
            </Button>
          </div>

          {orders && orders.length > 0 && (
            <div className="w-full flex-col gap-4flex p-2 border-t-2 border-zinc-400">
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-row justify-between gap-10">
                  {/* campos de ajuste */}
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-5">
                      <label className="uppercase leading-3 font-bold">Transportadora</label>
                      <div className="flex gap-2">
                        <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
                          <input
                            value={idTreasury}
                            onChange={handleInputChange}
                            className="m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                          />
                        </div>

                        {/* ✅ BORDA VERDE SE TEM SOBRA / VERMELHA SE NÃO TEM */}
                        <div
                          className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 w-80 h-11 text-lg ${selectedTreasuryHasSobra ? "border-green-600" : "border-red-600"
                            }`}
                        >
                          <select
                            className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm"
                            value={idTreasury}
                            onChange={handleSelectChange}
                          >
                            {treasuryOptions.map((t) => (
                              <option
                                key={t.id}
                                value={String(t.id)}
                                className="uppercase bg-slate-700 text-white"
                              >
                                {t.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-5">
                      <label className="uppercase leading-3 font-bold">Atms</label>
                      <div className="flex gap-2">
                        <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
                          <input
                            value={idAtm}
                            onChange={handleInputChangeAtm}
                            className="m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                          />
                        </div>
                        <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-80 h-11 text-lg">
                          <select
                            className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm"
                            value={idAtm}
                            onChange={handleSelectChangeAtm}
                          >
                            {atmOptions.map((atm) => (
                              <option
                                key={atm.id_system}
                                value={String(atm.id_system)}
                                className="uppercase bg-slate-700 text-white"
                              >
                                {atm.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="font-bold text-xl uppercase">Lote: </div>
                      <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-full h-11 text-lg">
                        <select
                          className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm"
                          onChange={(e) => handleSelectChangeOrder(parseInt(e.target.value))}
                        >
                          {ordersSelected?.map((order: any) => (
                            <option
                              key={order.id_order}
                              value={order.id_order}
                              className="uppercase bg-slate-700 text-white"
                            >
                              {order.id_order}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-5">
                      <label className="font-bold text-xl uppercase">Data para atendimento</label>
                      <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-full text-lg">
                        <input
                          type="date"
                          className="m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                          value={dateForOS}
                          onChange={handleSetDateForOs}
                        />
                      </div>
                    </div>
                  </div>

                  {/* campos do pedido */}
                  <div className="flex flex-row items-center flex-1">
                    <div className="w-[300px] flex flex-col gap-5 justify-center items-center border-2 border-zinc-600 rounded-md pr-2 pl-2">
                      <h4 className="font-bold text-xl uppercase">Em Tesouraria</h4>

                      <div className="flex gap-2 p-1 justify-between bg-zinc-800 w-full">
                        <div className="text-xl flex-1">R$ 10,00</div>
                        <div className="text-xl text-center flex-1">{displayA}</div>
                        <div className="text-xl flex-1">{generateReal(displayA, 10)}</div>
                      </div>

                      <div className="flex gap-2 p-0.5 justify-between w-full">
                        <div className="text-xl flex-1">R$ 20,00</div>
                        <div className="text-xl text-center flex-1">{displayB}</div>
                        <div className="text-xl flex-1">{generateReal(displayB, 20)}</div>
                      </div>

                      <div className="flex gap-2 p-0.5 justify-between bg-zinc-800 w-full">
                        <div className="text-xl flex-1">R$ 50,00</div>
                        <div className="text-xl text-center flex-1">{displayC}</div>
                        <div className="text-xl flex-1">{generateReal(displayC, 50)}</div>
                      </div>

                      <div className="flex gap-2 p-0.5 justify-between w-full">
                        <div className="text-xl flex-1">R$ 100,00</div>
                        <div className="text-xl text-center flex-1">{displayD}</div>
                        <div className="text-xl flex-1">{generateReal(displayD, 100)}</div>
                      </div>

                      <div className="flex gap-2 p-0.5 justify-between bg-zinc-800 w-full font-bold">
                        <div className="text-xl">TOTAL</div>
                        <div className="text-xl">
                          {(displayA * 10 + displayB * 20 + displayC * 50 + displayD * 100).toLocaleString(
                            "pt-BR",
                            { style: "currency", currency: "BRL" }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* campos observação */}
                  <div className="flex flex-col items-center flex-1 p-3 gap-2 border border-zinc-400 rounded-md">
                    <label className="font-bold text-xl uppercase">Obs. para atendimento</label>
                    <textarea
                      className="flex-1 w-full outline-none border-2 border-zinc-600 bg-zinc-700 p-2 rounded-md font-bold text-white"
                      readOnly
                      value={(orderInUse as any)?.observation ?? "Sem observação!"}
                    />
                  </div>

                  {/* campos abastecimento */}
                  <div className="flex flex-row items-center flex-1">
                    <div className="w-[300px] flex flex-col gap-5 justify-center items-center border-2 border-zinc-600 rounded-md pr-2 pl-2">
                      <h4 className="font-bold text-xl uppercase">Abastecimento</h4>

                      <div className="flex gap-2 p-1 items-center bg-zinc-800 w-full">
                        <input
                          type="checkbox"
                          checked={trocaTotal}
                          onChange={(e) => setTrocaTotal(e.target.checked)}
                        />
                        <label className="uppercase text-sm">Troca total</label>
                      </div>

                      <div className="flex gap-2 p-1 justify-between bg-zinc-800 w-full">
                        <div className="text-xl">R$ 10,00</div>
                        <input
                          className="text-xl h-8 w-[100px] rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center"
                          value={valueA}
                          max={availableA}
                          onChange={(e) => handleChangeSuplies(e, 10)}
                        />
                        <div className="text-xl">{generateReal(valueA as number, 10)}</div>
                      </div>

                      <div className="flex gap-2 p-0.5 justify-between w-full">
                        <div className="text-xl">R$ 20,00</div>
                        <input
                          className="text-xl h-8 w-[100px] rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center"
                          value={valueB}
                          max={availableB}
                          onChange={(e) => handleChangeSuplies(e, 20)}
                        />
                        <div className="text-xl">{generateReal(valueB as number, 10)}</div>
                      </div>

                      <div className="flex gap-2 p-0.5 justify-between bg-zinc-800 w-full">
                        <div className="text-xl">R$ 50,00</div>
                        <input
                          className="text-xl h-8 w-[100px] rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center"
                          value={valueC}
                          max={availableC}
                          onChange={(e) => handleChangeSuplies(e, 50)}
                        />
                        <div className="text-xl">{generateReal(valueC as number, 10)}</div>
                      </div>

                      <div className="flex gap-2 p-0.5 justify-between w-full">
                        <div className="text-xl">R$ 100,00</div>
                        <input
                          className="text-xl h-8 w-[100px] rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center"
                          value={valueD}
                          max={availableD}
                          onChange={(e) => handleChangeSuplies(e, 100)}
                        />
                        <div className="text-xl">{generateReal(valueD as number, 10)}</div>
                      </div>

                      <div className="flex gap-2 p-0.5 justify-between bg-zinc-800 w-full font-bold">
                        <div className="text-xl">TOTAL</div>
                        <div className="text-xl">
                          {generateFullReal(valueA * 10 + valueB * 20 + valueC * 50 + valueD * 100)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* linha de botões */}
                <div className="flex flex-row justify-center gap-5">
                  {atmsTreasurySelected.length > 1 && (
                    <ButtonScreenOrder
                      size="btn-icon-text"
                      color="#1E3A8A"
                      secondaryColor="#3B82F6"
                      textColor="white"
                      onClick={handleButtonDivider}
                      icon={faDivide}
                    >
                      Dividir
                    </ButtonScreenOrder>
                  )}

                  <ButtonScreenOrder
                    size="btn-icon-text"
                    color="#1E3A8A"
                    secondaryColor="#3B82F6"
                    textColor="white"
                    onClick={handleSaveIndovidual}
                    icon={faSave}
                  >
                    Salvar
                  </ButtonScreenOrder>

                  <ButtonScreenOrder
                    size="btn-icon-text"
                    color="#1E3A8A"
                    secondaryColor="#3B82F6"
                    textColor="white"
                    onClick={handleCleanButton}
                    icon={faBroom}
                  >
                    Limpar
                  </ButtonScreenOrder>

                  <ButtonScreenOrder
                    size="btn-icon-text"
                    color="#22C55E"
                    secondaryColor="#15803D"
                    textColor="white"
                    onClick={handleGenerateOS}
                    icon={faTable}
                  >
                    Gerar Oss
                  </ButtonScreenOrder>
                </div>
              </div>

              {/* OSs abertas */}
              {suppliesSelected.length > 0 && (
                <div className="flex-1 w-full border-t-4 border-zinc-600 mt-2 p-2">
                  <div>
                    <input type="checkbox" className="mr-2" />
                    <label className="font-bold text-lg">Ver todas</label>
                  </div>
                  <div>
                    <table className="w-full border border-gray-300 text-left">
                      <thead className="bg-gray-800 text-center">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2">ID</th>
                          <th className="border border-gray-300 px-4 py-2">Lote</th>
                          <th className="border border-gray-300 px-4 py-2">Terminal</th>
                          <th className="border border-gray-300 px-4 py-2">Troca total</th>
                          <th className="border border-gray-300 px-4 py-2">Data</th>
                          <th className="border border-gray-300 px-4 py-2">R$ 10,00</th>
                          <th className="border border-gray-300 px-4 py-2">R$ 20,00</th>
                          <th className="border border-gray-300 px-4 py-2">R$ 50,00</th>
                          <th className="border border-gray-300 px-4 py-2">R$ 100,00</th>
                          <th className="border border-gray-300 px-4 py-2">Total</th>
                          <th className="border border-gray-300 px-4 py-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suppliesSelected.map((supply: any, index) => (
                          <tr key={index} className="text-center hover:bg-zinc-800">
                            <td className="border border-gray-300 px-2 py-1">{supply.id}</td>
                            <td className="border border-gray-300 px-2 py-1">{supply.id_order}</td>
                            <td className="border border-gray-300 px-2 py-1">{supply.id_atm}</td>
                            <td className="border border-gray-300 px-2 py-1">
                              {supply.total_exchange === true ? "Sim" : "Nao"}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {formatDateToString(String(supply.date_on_supply))}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">{supply.cassete_A}</td>
                            <td className="border border-gray-300 px-2 py-1">{supply.cassete_B}</td>
                            <td className="border border-gray-300 px-2 py-1">{supply.cassete_C}</td>
                            <td className="border border-gray-300 px-2 py-1">{supply.cassete_D}</td>
                            <td className="border border-gray-300 px-2 py-1">
                              {generateRealTotal(
                                supply.cassete_A ?? 0,
                                supply.cassete_B ?? 0,
                                supply.cassete_C ?? 0,
                                supply.cassete_D ?? 0
                              )}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 flex items-center justify-center gap-4">
                              <ButtonScreenOrder
                                size="btn-icon"
                                color="#1E3A8A"
                                secondaryColor="#3B82F6"
                                textColor="white"
                                onClick={() => handleOpenEditSupply(supply)}
                                icon={faEdit}
                              />

                              <ButtonScreenOrder
                                size="btn-icon"
                                color="#DC2626"
                                secondaryColor="#F87171"
                                textColor="white"
                                onClick={() => handleDelSupply(supply.id as number)}
                                icon={faTrashCan}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ModalTrocaTotal
          dateForOS={dateForOS}
          atmsSelected={atmsTreasurySelected}
          orderUsed={orderInUse}
          onClose={handleCloseModal}
          treasuries={treasuries}
          changeTreasuries={setTreasuries}
        />
      )}

      {showModalOS && (
        <ModalOS
          close={handleCloseModalOS}
          data={(suplies ?? []) as any}
          atmMap={atmMap}
          treasuryMap={treasuryMap}
        />
      )}

      {modalEditSupply && (
        <ModalEditSupply
          supply={modalEditSupply}
          saldo={{ a: availableA, b: availableB, c: availableC, d: availableD }}
          onApply={handleApplySupplyUpdate}
          onClose={handleCloseModalEditSupply}
        />
      )}

      {loading && <Loading />}
    </Page>
  );
}