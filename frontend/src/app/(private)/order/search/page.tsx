"use client"

import { Page } from "@/app/components/ux/Page";
import { faCheck, faCheckDouble, faCodeCompare, faEnvelope, faEye, faFileExport, faMagnifyingGlass, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { TitlePages } from "@/app/components/ux/TitlePages";
import { useEffect, useState } from "react";
import { Loading } from "@/app/components/ux/Loading";
import { getAll } from "@/app/service/type-operation";
import { getAll as getAllTypeOrder } from "@/app/service/type-order";
import { getAll as getAllTreasury } from "@/app/service/treasury";
import { typeOperationType } from "@/types/typeOperationType";
import { treasuryType } from "@/types/treasuryType";
import { typeOrderType } from "@/types/typeOrderType";
import { ButtonScreenOrder } from "@/app/components/ui/ButtonScreenOrder";
import { alterDateInOrder, alterValueOrder, ConfirmOrderById, confirmPartialOrderById, delOrderById, genreratePaymmentById, genrerateRelaseById, getInfosOrder, getOrderByIdForReport, searchOrdersForDate } from "@/app/service/order";
import { orderType } from "@/types/orderType";
import { getAll as getAllStatusOrder } from "@/app/service/status-order";
import { formatDateToString } from "@/app/utils/formatDateToString";
import { returnNameTreasury } from "@/app/utils/returnNameTreasury";
import { generateValueTotal } from "@/app/utils/generateValueTotal";
import { generateReal } from "@/app/utils/generateReal";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { statusOrderType } from "@/types/statusOrder";
import { returnNameStatus } from "@/app/utils/returnNameStatus";
import { ModalConfirmPartial } from "@/app/components/ux/ModalConfirmPartial";
import { ModalRelaunchOrder } from "@/app/components/ux/ModalRelaunchOrder";
import { PdfGenerator } from "@/app/components/ux/PdfGenerator";
import { PdfGeneratorPayment } from "@/app/components/ux/PdfGeneratorPayment";
import { pdfGeneratorReleaseType } from "@/types/pdfGeneratorReleaseType";
import { returnNameTypeOperation } from "@/app/utils/returnNameTypeOperation";
import { generateTotalInReal } from "@/app/utils/generateTotalinReal";
import { returnIfMateus } from "@/app/utils/returnIfMateus";
import { pdfGeneratorPaymentType } from "@/types/pdfGeneratorPaymentType";
import { sendEmailToOrder } from "@/app/service/email";
import { generateMultiTableExcel } from "@/app/utils/generateMultiTableExcel";
import { ModalMessege } from "@/app/components/ux/ModalMessege";
import { getTextColorLine } from "@/app/utils/getTextColorLine";
import { bankType } from "@/types/bankType";
import { getAllBanks } from "@/app/service/bank";
import { ModalValidated } from "@/app/components/ux/ModalValidated";

type OrderType = orderType & {
  confirmed_total?: number;
  requested_total?: number;
}

export default function Order() {

  const [typeOperations, setTypeOperations] = useState<typeOperationType[]>([])
  const [treasuries, setTreasuries] = useState<treasuryType[]>([])
  const [, setTypeOrders] = useState<typeOrderType[]>([])
  const [statusOrder, setStatusOrder] = useState<statusOrderType[]>([])
  const [orders, setOrders] = useState<OrderType[]>([])
  const [banks, setBanks] = useState<bankType[]>([])

  const [itemsChecks, setItemsChecks] = useState<{ id_type_operation: Number, id_order: number, id: number, status: boolean }[]>([])
  const [toggleChecks, setToggleChecks] = useState(false)

  const [, setIdTypeOperation] = useState('')
  const [, setIdTreasuryOrigin] = useState('')
  const [, setIdTreasuryDestin] = useState('')
  const [, setIdTypeOrder] = useState('')

  const [dateInitial, setDateInitial] = useState('')
  const [dateFinal, setDateFinal] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [modalViewOrder, setModalViewOrder] = useState(false)
  const [modalOrderConfirmPartial, setModalOrderConfirmPartial] = useState(false)
  const [modalRelauchOrder, setModalRelaunchOrder] = useState(false)

  const [orderIndivudual, setOrderIndividual] = useState<orderType>()

  const [valueAddA, setValueAddA] = useState(0)
  const [valueAddB, setValueAddB] = useState(0)
  const [valueAddC, setValueAddC] = useState(0)
  const [valueAddD, setValueAddD] = useState(0)
  const [obs, setObs] = useState("")
  const [dateAlter, setDateAlter] = useState('')

  const [elementRelaease, setElementRelease] = useState<pdfGeneratorReleaseType[]>([])
  const [elementPayment, setElementPayment] = useState<pdfGeneratorPaymentType[]>([])
  const [modalGenerateRealse, setModalGenerateRelease] = useState(false)
  const [modalGeneratePayment, setModalGeneratePayment] = useState(false)

  const [totalOrder, setTotalOrder] = useState(0)
  const [totalOrderMateus, setTotalOrderMateus] = useState(0)
  const [totalOrderPosterus, setTotalOrderPOsterus] = useState(0)
  const [totalOrderConfirmmed, setTotalOrderConfirmmed] = useState(0)

  const [modalError, setModalError] = useState(false)

  const [sortColumn, setSortColumn] = useState<keyof OrderType | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isUserSorting, setIsUserSorting] = useState(false); // <- este é o segredo

  const [validated, setValidated] = useState<OrderType>()
  const [modalValidated, setModalValidated] = useState(false)


  useEffect(() => {
    document.title = "Pedidos - Visualizar | CredNosso";
  })

  useEffect(() => {

    const allLoading = async () => {
      await typeOperationFunction()
      await treasuriesFunction()
      await typeOrderFunction()
      await statusOderFunction()
      await getAllBanksF()
    }

    allLoading()
  }, [orders])

  const typeOperationFunction = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const tOperation = await getAll()
    if (tOperation.status === 300 || tOperation.status === 400 || tOperation.status === 500) {
      setError("Erro na requisição!")
      setLoading(false)
      return
    }
    if (tOperation.data !== undefined && tOperation.data.typeOperation[0]?.id) {
      setTypeOperations(tOperation.data.typeOperation)
      setIdTypeOperation(tOperation.data.typeOperation[0].id)
      setLoading(false)
      return
    } else {
      setError('Sem dados a carregar')
      setLoading(false)
      return
    }
  }

  const treasuriesFunction = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const t = await getAllTreasury()
    if (t.status === 300 || t.status === 400 || t.status === 500) {
      setError('Erro na requisição')
      setLoading(false)
      return
    }
    if (t.data !== undefined && t.data.treasury[0]?.id) {
      setTreasuries(t.data.treasury)
      setIdTreasuryOrigin(t.data.treasury[0].id)
      setIdTreasuryDestin(t.data.treasury[0].id)
      setLoading(false)
      return
    } else {
      setError("Sem dados a retornar!")
      setLoading(false)
      return
    }
  }

  const typeOrderFunction = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const tOrder = await getAllTypeOrder()
    if (tOrder.status === 300 || tOrder.status === 400 || tOrder.status === 500) {
      setError('Erro na requisição')
      setLoading(false)
      return
    }
    if (tOrder.data !== undefined && tOrder.data.typeOrder[0]?.id) {
      setTypeOrders(tOrder.data.typeOrder)
      setIdTypeOrder(tOrder.data.typeOrder[0].id)
      setLoading(false)
      return
    } else {
      setError("Sem dados a mostrar")
      setLoading(false)
      return
    }
  }

  const statusOderFunction = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const sOrder = await getAllStatusOrder()
    if (sOrder.status === 300 || sOrder === 400 || sOrder === 500) {
      setError("Erro de requisição")
      setLoading(false)
      return
    }
    if (sOrder.data !== undefined && sOrder.data.statusOrder[0].id) {
      setStatusOrder(sOrder.data.statusOrder)
      setLoading(false)
      return
    }
    setError("Sem dados!")
    setLoading(false)
    return
  }

  const handleSearch = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    if (dateInitial === '') {
      setError('Preencher ao menos o campo de Data Inicial')
      setLoading(false)
      return
    }
    setOrders([])
    const data = {
      date_initial: dateInitial,
      date_final: dateFinal === '' ? dateInitial : dateFinal,
    }
    // const orderSarch = await searchOrdersForDatePagination(data, currentPage, pageSize)
    const orderSarch = await searchOrdersForDate(data)

    if (orderSarch.status === 300 || orderSarch.status === 400 || orderSarch.status === 500) {
      setError("Erro de requisição")
      setLoading(false)
      return
    }
    if (orderSarch.data !== undefined && orderSarch.data.order.length > 0) {
      setOrders(orderSarch.data.order)
      const elements: any = []
      let sum = 0
      let sumConfirmmed = 0
      let sumMateus = 0
      let sumPosterus = 0
      orderSarch.data.order.forEach((item: orderType) => {
        let value = 0
        let valueConfirmmed = 0
        elements.push({
          id_type_operation: item.id_type_operation,
          id_order: item.id,
          id: item.id_treasury_destin,
          status: false
        })
        value = (item.requested_value_A * 10) + (item.requested_value_B * 20) + (item.requested_value_C * 50) + (item.requested_value_D * 100)
        valueConfirmmed = (
          (item?.confirmed_value_A as number) * 10) + ((item.confirmed_value_B as number) * 20) +
          ((item.confirmed_value_C as number) * 50) + ((item.confirmed_value_D as number) * 100)
        sumConfirmmed = sumConfirmmed + valueConfirmmed
        sum = sum + value
        if (returnIfMateus(treasuries, item.id_treasury_origin)) {
          sumMateus = sumMateus + value
          setTotalOrderMateus(sumMateus)
        } else {
          sumPosterus = sumPosterus + value
          setTotalOrderPOsterus(sumPosterus)
        }
        setTotalOrderConfirmmed(sumConfirmmed)
        setTotalOrder(sum)
        setSortColumn(null);
        setIsUserSorting(false); // ← importante!
      })
      setItemsChecks(elements)
      setError('')
      setLoading(false)
      return
    }
    setError('Sem dados a mostrar!')
    setLoading(false)
    return

  }


  const getSortedOrders = () => {
    if (!isUserSorting || !sortColumn) return orders;

    const calculateRequestedTotal = (item: OrderType) => (
      (item.requested_value_A ?? 0) * 10 +
      (item.requested_value_B ?? 0) * 20 +
      (item.requested_value_C ?? 0) * 50 +
      (item.requested_value_D ?? 0) * 100
    );

    const calculateConfirmedTotal = (item: OrderType) => (
      (item.confirmed_value_A ?? 0) * 10 +
      (item.confirmed_value_B ?? 0) * 20 +
      (item.confirmed_value_C ?? 0) * 50 +
      (item.confirmed_value_D ?? 0) * 100
    );

    return [...orders].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      if (sortColumn === "requested_total") {
        valueA = calculateRequestedTotal(a);
        valueB = calculateRequestedTotal(b);
      } else if (sortColumn === "confirmed_total") {
        valueA = calculateConfirmedTotal(a);
        valueB = calculateConfirmedTotal(b);
      } else {
        valueA = a[sortColumn];
        valueB = b[sortColumn];
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }

      return sortDirection === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  };

  const getAllBanksF = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const gBanks = await getAllBanks()
    if (gBanks.status === 300 || gBanks.status === 400 || gBanks.status === 500) {
      setError("Erro de requisição")
      setLoading(false)
      return
    }
    if (gBanks.data !== undefined && gBanks.data.bank.length > 0) {
      setBanks(gBanks.data.bank)
      setLoading(false)
      return
    }
    setError("Sem dados!")
    setLoading(false)
    return
  }

  const sortedOrders = getSortedOrders();


  const handleSort = (column: keyof OrderType) => {
    if (sortColumn === column) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setIsUserSorting(true); // <- aqui a gente ativa a ordenação
  };

  const handleToggleSelect = () => {
    const newValue = !toggleChecks
    setToggleChecks(newValue)
    itemsChecks.forEach((item, index) => {
      item.status = newValue
    })
  }

  const handleIndividualCheck = (id: number) => {
    setItemsChecks(
      itemsChecks.map((item) => (
        item.id_order === id ? { ...item, status: !item.status } : item
      ))
    )
  }

  const viewOrder = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const countTrue = itemsChecks.filter(item => item.status === true).length
    if (countTrue === 0) {
      setError("Selecione um item para continuar")
      setLoading(false)
      return
    }
    if (countTrue > 1) {
      setError("Para essa ação só pode haver 1 item selecionado")
      setLoading(false)
      return
    }
    const itemsSelected = itemsChecks.filter(item => item.status === true)
    const orderSelectedOne = orders.filter(item => item.id === itemsSelected[0].id_order)
    if (orderSelectedOne[0] && orderSelectedOne[0]?.id) {

      let totalConfirmed = (orderSelectedOne[0].confirmed_value_A ?? 0 * 10) + (orderSelectedOne[0].confirmed_value_B ?? 0 * 20) +
        (orderSelectedOne[0].confirmed_value_C ?? 0 * 50) + (orderSelectedOne[0].confirmed_value_D ?? 0 * 100)

      if (totalConfirmed > 0) {
        setValueAddA(orderSelectedOne[0].confirmed_value_A ?? 0)
        setValueAddB(orderSelectedOne[0].confirmed_value_B ?? 0)
        setValueAddC(orderSelectedOne[0].confirmed_value_C ?? 0)
        setValueAddD(orderSelectedOne[0].confirmed_value_D ?? 0)
      } else {
        setValueAddA(orderSelectedOne[0].requested_value_A)
        setValueAddB(orderSelectedOne[0].requested_value_B)
        setValueAddC(orderSelectedOne[0].requested_value_C)
        setValueAddD(orderSelectedOne[0].requested_value_D)
      }
      setOrderIndividual(orderSelectedOne[0])
      setModalViewOrder(true)
      setObs(orderSelectedOne[0].observation)
      setError('')
      setLoading(false)
      return
    } else {
      setError("Erro ao carregar dados, tentar novamente!")
      setLoading(false)
      return
    }
  }

  const closeModalViewOrder = () => {
    setValueAddA(0)
    setValueAddB(0)
    setValueAddC(0)
    setValueAddD(0)
    setModalViewOrder(false)
  }

  const closeModalConfirmPartial = () => {
    setValueAddA(0)
    setValueAddB(0)
    setValueAddC(0)
    setValueAddD(0)
    handleSearch()
    setModalOrderConfirmPartial(false)
  }

  const closeModalRelauchOrder = () => {
    setError('')
    setLoading(false)
    setDateAlter('')
    setModalRelaunchOrder(false)
  }

  const saveOneOrder = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const data = {
      requested_value_A: valueAddA,
      requested_value_B: valueAddB,
      requested_value_C: valueAddC,
      requested_value_D: valueAddD,
      observation: obs
    }
    const orderSave = await alterValueOrder(orderIndivudual?.id as number, data)
    if (orderSave.status === 300 || orderSave.status === 400 || orderSave === 500) {
      setError('Erro na requisição')
      setLoading(false)
      return
    }
    if (orderSave.data.order && orderSave.data.order?.id) {
      handleSearch()
      setError('')
      setLoading(false)
      setModalViewOrder(false)
      return
    }
  }

  const saveConfirmPartialOneOrder = async () => {
    setError("")
    setLoading(false)
    setLoading(true)
    const countTrue = itemsChecks.filter(item => item.status === true).length
    if (countTrue === 0) {
      setError("Selecione um item para continuar")
      setLoading(false)
      return
    }
    if (countTrue > 1) {
      setError("Para essa ação só pode haver 1 item selecionado")
      setLoading(false)
      return
    }
    closeModalConfirmPartial()
    const data = {
      confirmed_value_A: valueAddA,
      confirmed_value_B: valueAddB,
      confirmed_value_C: valueAddC,
      confirmed_value_D: valueAddD,
      status_order: 3,
      composition_change: true
    }

    const orderConfirmPartialReturn = await confirmPartialOrderById(orderIndivudual?.id as number, data)
    if (orderConfirmPartialReturn.status === 300 || orderConfirmPartialReturn.status === 400 || orderConfirmPartialReturn.status === 500) {
      setError("Erro na requisição!")
      setLoading(false)
      return
    }
    if (orderConfirmPartialReturn.data.order && orderConfirmPartialReturn.data.order?.id > 0) {
      setError('')
      setLoading(false)
      handleSearch()
      return
    }
    setError('Erro ao editar')
    return
  }

  const handleDelOrders = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const countTrue = itemsChecks.filter(item => item.status === true).length
    if (countTrue === 0) {
      setError("Selecione um item para continuar")
      setLoading(false)
      return
    }
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir este(s) item(ns)?
        ${itemsChecks
        .filter(item => item.status === true)
        .map(item => item.id)
        .join(',')}
      `);
    if (!confirmDelete) {
      setError("Cancelado a exclusão")
      setLoading(false)
      return
    }
    const itemsSelected = itemsChecks.filter(item => item.status === true)
    for (let x = 0; itemsSelected.length > x; x++) {
      let chech = false
      let count = 0
      while (!chech && count < 8) {
        ++count
        const iSelectedAlter = await delOrderById(itemsSelected[x].id_order)
        if (iSelectedAlter.status === 300 || iSelectedAlter.status === 400 || iSelectedAlter.status === 500) {
          console.log(iSelectedAlter[0])
          if (!iSelectedAlter[0] || !iSelectedAlter[0].id) {
            return
          }
        } else {
          chech = true
        }
      }
    }
    handleSearch()
    setError('')
    setLoading(false)
    return

  }

  const handleConfirmTotal = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const countTrue = itemsChecks.filter(item => item.status === true).length
    if (countTrue === 0) {
      setError("Selecione um item para continuar")
      setLoading(false)
      return
    }
    if (countTrue > 1) {
      setError("Para essa ação só pode haver 1 item selecionado")
      setLoading(false)
      return

    }
    const confirmAlter = window.confirm(`Tem certeza que deseja Confirmar total este(s) id(s)?
        ${itemsChecks
        .filter(item => item.status === true)
        .map(item => item.id)
        .join(',')}
      `);
    if (!confirmAlter) {
      setError("Cancelado a operção")
      setLoading(false)
      return
    }
    const id_operation = itemsChecks.filter(item => item.status === true).map(item => item.id_type_operation)
    const idsSelected = itemsChecks.filter(item => item.status === true).map(item => item.id_order)
    const idSelected = itemsChecks.filter(item => item.status === true).map(item => item.id)
    if (id_operation[0] === 1 && idSelected[0] === 9) {
      const rValue = await getInfosOrder(idsSelected[0])
      if (rValue.status === 300 || rValue.status === 400 || rValue.status === 500) {
        setError("Erro na requisição!")
        setLoading(false)
        return
      }
      if (rValue.data.order && rValue.data.order?.id > 0) {
        setValidated(rValue.data.order)
        setModalValidated(true)
      }

    } else if(id_operation[0] === 3){
      setError("Tipo de operação não necessita de confirmação!")
      setLoading(false)
      return
    } else {
      const iSelectedAlter = await ConfirmOrderById(idsSelected)
      if (iSelectedAlter.status === 300 || iSelectedAlter === 400 || iSelectedAlter === 500) {
        setError('Erro na requisição!')
        setLoading(false)
        return
      }
    }
    handleSearch()
    setError('')
    setLoading(false)
    return
  }

  const handleConfirmPartial = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const countTrue = itemsChecks.filter(item => item.status === true).length
    if (countTrue === 0) {
      setError("Selecione um item para continuar")
      setLoading(false)
      return
    }
    if (countTrue > 1) {
      setError("Para essa ação só pode haver 1 item selecionado")
      setLoading(false)
      return
    }
    const itemsSelected = itemsChecks.filter(item => item.status === true)
    const orderSelectedOne = orders.filter(item => item.id === itemsSelected[0].id_order)
    if (orderSelectedOne[0]?.id && orderSelectedOne[0]?.id > 0) {
      setOrderIndividual(orderSelectedOne[0])
      setModalOrderConfirmPartial(true)
      setLoading(false)
      return
    }
    setError("Erro ao gerar tela, tentar novamente!")
    setLoading(false)
    return

  }

  const relaunchOrder = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const countTrue = itemsChecks.filter(item => item.status === true).length
    if (countTrue === 0) {
      setError("Selecione um item para continuar")
      setLoading(false)
      return
    }
    if (countTrue > 1) {
      setError("Para essa ação só pode haver 1 item selecionado")
      setLoading(false)
      return
    }
    const confirmRelauchDate = window.confirm(`Tem certeza que deseja mudar a data do pedido de ID?
      ${itemsChecks
        .filter(item => item.status === true)
        .map(item => item.id_order)
        .join(',')}
    `);
    if (!confirmRelauchDate) {
      setError("Cancelado o relançamento")
      setLoading(false)
      return
    }
    const itemsSelected = itemsChecks.filter(item => item.status === true)
    const orderSelectedOne = orders.filter(item => item.id === itemsSelected[0].id_order)
    setOrderIndividual(orderSelectedOne[0])
    setModalRelaunchOrder(true)
    setError('')
    setLoading(false)
  }

  const handleSaveRelaunchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateAlter(e.target.value);
  }

  const handleDateAlter = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    if (dateAlter === '') {
      setError('Prrencha o campo de data')
      setLoading(false)
      return
    }
    const data = {
      date_order: dateAlter
    }
    const orderAlterForDate = await alterDateInOrder(orderIndivudual?.id as number, data)
    if (orderAlterForDate.status === 300 || orderAlterForDate === 400 || orderAlterForDate === 500) {
      setError("Erro de Requisição, tente novamente")
      setLoading(false)
      return
    }
    if (orderAlterForDate.data.order && orderAlterForDate.data.order?.id > 0) {
      setDateAlter('')
      setError('')
      setModalRelaunchOrder(false)
      setLoading(false)
      handleSearch()
      return
    } else {
      setError('Erro ao alterar a data')
      setLoading(false)
      return
    }

  }

  const generateRelease = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const countTrue = itemsChecks.filter(item => item.status === true).length
    if (countTrue === 0) {
      setError("Selecione ao menos um item para continuar")
      setLoading(false)
      return
    }
    const idsSelected = itemsChecks.filter(item => item.status === true).map(item => item.id_order)
    const gRelease = await genrerateRelaseById(idsSelected)

    if (gRelease.status === 300 || gRelease.status === 400 || gRelease.status === 500) {
      setError("Erro na requisição!")
      setLoading(false)
      return
    }

    setElementRelease(gRelease.data.order)
    setModalGenerateRelease(true)
    setError('')
    setLoading(false)
  }

  const generatePayment = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const countTrue = itemsChecks.filter(item => item.status === true).length
    if (countTrue === 0) {
      setError("Selecione ao menos um item para continuar")
      setLoading(false)
      return
    }

    const idsSelected = itemsChecks.filter(item => item.status === true).map(item => item.id_order)
    const gPayment = await genreratePaymmentById(idsSelected)
    if (gPayment.status === 300 || gPayment.status === 400 || gPayment.status === 500) {
      setError("Erro na requisição!")
      setLoading(false)
      return
    }
    setElementPayment(gPayment.data.order)
    setModalGeneratePayment(true)
    setError('')
    setLoading(false)
  }

  const sendEmail = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const countTrue = itemsChecks.filter(item => item.status === true).length
    if (countTrue === 0) {
      setError("Selecione um item para continuar")
      setLoading(false)
      return
    }
    const confirmAlter = window.confirm(`Tem certeza que deseja Confirmar total este(s) id(s)?
        ${itemsChecks
        .filter(item => item.status === true)
        .map(item => item.id)
        .join(',')}
      `);
    if (!confirmAlter) {
      setError("Cancelado a operção")
      setLoading(false)
      return
    }
    const idsSelected = itemsChecks.filter(item => item.status === true).map(item => item.id_order)
    const emails = await sendEmailToOrder(idsSelected)
    if (emails.status === 300 || emails.status === 400 || emails.status === 500) {
      setError("Erro na requisição!")
      setLoading(false)
      return
    }
    if (emails.data.email) {
      setLoading(false)
      setError('E-mail enviado com sucesso')
      return
    }
    setError("Erro ao Enviar e-mail!!")
    setLoading(false)
    return
  }

  const generateReport = async () => {
    setError('')
    setLoading(true)
    const countTrue = itemsChecks.filter(item => item.status === true).length
    if (countTrue === 0) {
      setError("Selecione um item para continuar")
      setLoading(false)
      return
    }
    const confirmAlter = window.confirm(`Tem certeza que deseja Confirmar gerar o relatório?`);
    if (!confirmAlter) {
      setError("Cancelado a operção")
      setLoading(false)
      return
    }
    const idsSelected = itemsChecks.filter(item => item.status === true).map(item => item.id_order)
    const orders = await getOrderByIdForReport(idsSelected)
    if (orders.status === 300 || orders.status === 400 || orders.status === 500) {
      setError("Erro na requisição")
      setLoading(false)
      return
    }
    if (orders.data !== undefined && orders.data.order.length > 0) {
      const excel = await generateMultiTableExcel(orders.data.order)
      if (excel) {
        setError('')
        setLoading(false)
        return
      }
    }
    setError('Erro ao gerar Excel')
    setLoading(false)
    return
  }

  const handleCloseModalMessege = () => {
    setModalError(false)
  }

  const closeGenerateModalRelease = () => {
    setModalGenerateRelease(!modalGenerateRealse)
  }

  const closeGenerateMOdalPayment = () => {
    handleSearch()
    setModalGeneratePayment(!modalGeneratePayment)
  }

  const handleCloseModalValidated = () => {
    setLoading(false)
    setError('')
    setModalValidated(false)
    handleSearch()
  }

  return <Page>
    <TitlePages linkBack="/order" icon={faMagnifyingGlass} >Pesquisar Pedidos</TitlePages>
    <div className="flex flex-col gap-4 p-5 w-full">
      <div className="flex flex-col gap-2">
        <label className="uppercase font-bold text-2xl">Pesquisa por data</label>
        <div className="flex gap-4 items-center">
          <input
            type="date"
            value={dateInitial}
            onChange={(e) => setDateInitial(e.target.value)}
            className="w-72 h-10 outline-none rounded-md text-black text-center uppercase"
          />
          <div className="uppercase text-lg font-bold">até</div>
          <input
            type="date"
            value={dateFinal}
            onChange={(e) => setDateFinal(e.target.value)}
            className="w-72 h-10 outline-none rounded-md text-black text-center uppercase"
          />
          <ButtonScreenOrder
            color="#32c015"
            onClick={handleSearch}
            size="btn-icon"
            textColor="white"
            icon={faMagnifyingGlass}
            secondaryColor="#318c1e"></ButtonScreenOrder>
        </div>
      </div>
      <div className="h-1 bg-zinc-500 w-full"></div>
      <div className="flex flex-row gap-2 flex-wrap">
        <ButtonScreenOrder color="#415eff" onClick={handleConfirmTotal} size="btn-icon-text"
          textColor="white" secondaryColor="#546bec" icon={faCheckDouble}
        >Confirmar Total</ButtonScreenOrder>
        <ButtonScreenOrder color="#415eff" onClick={handleConfirmPartial} size="btn-icon-text"
          textColor="white" secondaryColor="#546bec" icon={faCheck}
        >Confirmar Parcial</ButtonScreenOrder>
        <ButtonScreenOrder color="#415eff" onClick={generateRelease} size="btn-icon-text"
          textColor="white" secondaryColor="#546bec" icon={faFileExport}
        >Gerar Lançamento</ButtonScreenOrder>
        <ButtonScreenOrder color="#415eff" onClick={generatePayment} size="btn-icon-text"
          textColor="white" secondaryColor="#546bec" icon={faFileExport}
        >Gerar Pagamento</ButtonScreenOrder>
        <ButtonScreenOrder color="#415eff" onClick={generateReport} size="btn-icon-text"
          textColor="white" secondaryColor="#546bec" icon={faFileExport}
        >Gerar Relatório</ButtonScreenOrder>
        <ButtonScreenOrder color="#415eff" onClick={relaunchOrder} size="btn-icon-text"
          textColor="white" secondaryColor="#546bec" icon={faCodeCompare}
        >Relançar Pedido</ButtonScreenOrder>
        <ButtonScreenOrder color="#415eff" onClick={sendEmail} size="btn-icon-text"
          textColor="white" secondaryColor="#546bec" icon={faEnvelope}
        >Enviar E-mail</ButtonScreenOrder>
        <ButtonScreenOrder color="#415eff" onClick={viewOrder} size="btn-icon-text"
          textColor="white" secondaryColor="#546bec" icon={faEye}
        >Visualizar</ButtonScreenOrder>
        <ButtonScreenOrder color="#a62a12" onClick={handleDelOrders} size="btn-icon-text"
          textColor="white" secondaryColor="#ff0000" icon={faTrashCan}
        >Excluir</ButtonScreenOrder>
      </div>
      <div className="h-1 bg-zinc-500 w-full"></div>
      <div className="flex flex-row gap-2 items-center justify-between pr-6" >
        <div >
          <input
            type="checkbox"
            className="w-4 h-4 outline-none"
            checked={toggleChecks}
            onChange={handleToggleSelect}
          />
          <label>{toggleChecks ? 'Desmarcar' : 'Selecionar'} tudo</label>
        </div>

        <div className="flex flex-row gap-3">
          <div className="bg-[#c3d2ea] p-1 text-black font-bold rounded-md">
            <label>TOTAL PEDIDO: {generateTotalInReal(totalOrder)}</label>
          </div>
          <div className="bg-[#c3d2ea] p-1 text-black font-bold rounded-md">
            <label>PEDIDO MATEUS: {generateTotalInReal(totalOrderMateus)}</label>
          </div>
          <div className="bg-[#c3d2ea] p-1 text-black font-bold rounded-md">
            <label>PEDIDO POSTEUS: {generateTotalInReal(totalOrderPosterus)}</label>
          </div>
          <div className="bg-[#c3d2ea] p-1 text-black font-bold rounded-md">
            <label>TOTAL REALIZADO: {generateTotalInReal(totalOrderConfirmmed)}</label>
          </div>
        </div>

      </div>
      <table className="flex-1 text-center p-3 table-fixed w-full">
        <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-xl text-center">
          <tr className="flex">
            <th className="w-[2%] border-b-2 border-b-zinc-500 uppercase pb-2 text-xl " >#</th>
            <th className="w-[3%] border-b-2 border-b-zinc-500 uppercase pb-2 text-xl cursor-pointer"
              onClick={() => handleSort("id")}>Id {sortColumn === "id" && (sortDirection === "asc" ? "↑" : "↓")}</th>
            <th className="w-[12%] border-b-2 border-b-zinc-500 uppercase pb-2 text-xl" >T. Operação</th>
            <th className="w-[8%] border-b-2 bocalcrder-b-zinc-500 uppercase pb-2 text-xl  cursor-pointer"
              onClick={() => handleSort("id_treasury_origin")}
            >Cod. Origem {sortColumn === "id_treasury_origin" && (sortDirection === "asc" ? "↑" : "↓")}</th>
            <th className="w-[12%] border-b-2 border-b-zinc-500 uppercase pb-2 text-xl">Trans. Origem</th>
            <th className="w-[8%] border-b-2 border-b-zinc-500 uppercase pb-2 text-xl"
              onClick={() => handleSort("id_treasury_destin")}
            >Cod. Destino {sortColumn === "id_treasury_destin" && (sortDirection === "asc" ? "↑" : "↓")}</th>
            <th className="w-[12%] border-b-2 border-b-zinc-500 uppercase pb-2 text-xl" >Trans. Destino</th>
            <th className="w-[8%] border-b-2 border-b-zinc-500 uppercase pb-2 text-xl" >Data</th>
            <th className="w-[8%] border-b-2 border-b-zinc-500 uppercase pb-2 text-xl cursor-pointer"
              onClick={() => handleSort("requested_total")}
            >Solicitado  {sortColumn === "requested_total" && (sortDirection === "asc" ? "↑" : "↓")}</th>
            <th className="w-[8%] border-b-2 border-b-zinc-500 uppercase pb-2 text-xl cursor-pointer"
              onClick={() => handleSort("status_order")}
            >Status {sortColumn === "status_order" && (sortDirection === "asc" ? "↑" : "↓")}</th>
            <th className="w-[4%] border-b-2 border-b-zinc-500 uppercase pb-2 text-xl cursor-pointer"
              onClick={() => handleSort("confirmed_total")}
            >Realizado  {sortColumn === "confirmed_total" && (sortDirection === "asc" ? "↑" : "↓")}</th>
            <th className="w-[15%] border-b-2 border-b-zinc-500 uppercase pb-2 text-xl" >Observação</th>
          </tr>
        </thead>
        <tbody className="block text-xl overflow-y-auto max-h-[500px] text-center">
          {sortedOrders && sortedOrders.map((item, index) => (
            <tr className={`h-12 hover:bg-zinc-400 hover:text-black 
            ${index % 2 === 0 ? "bg-slate-800" : "bg-transparent"} ${getTextColorLine(item.status_order)} `} key={index} >
              <td className="w-[2%]" >
                <input
                  type="checkbox"
                  className="w-4 h-4 outline-none"
                  id={item.id?.toString()}
                  value=""
                  onChange={() => handleIndividualCheck(item.id as number)}
                  checked={
                    itemsChecks.find(i => i.id_order === item.id)?.status || false
                  }
                />
              </td>
              <td className="w-[3%]" >{item.id}</td>
              <td className="w-[12%] text-sm" >{returnNameTypeOperation(typeOperations, item.id_type_operation)}</td>
              <td className="w-[8%]" >{item.id_treasury_origin}</td>
              <td className="w-[12%]" >{returnNameTreasury(treasuries, item.id_treasury_origin)}</td>
              <td className="w-[8%]" >{item.id_treasury_destin}</td>
              <td className="w-[12%]" >{returnNameTreasury(treasuries, item.id_treasury_destin)}</td>
              <td className="w-[8%]" >{formatDateToString(item.date_order)}</td>
              <td className="w-[8%]" >{generateValueTotal(
                item.requested_value_A as number, item.requested_value_B as number,
                item.requested_value_C as number, item.requested_value_D as number
              )}</td>
              <td className="w-[8%] text-sm" >{returnNameStatus(statusOrder, item.status_order)}</td>
              <td className="w-[4%]" >{generateValueTotal(
                item.confirmed_value_A as number, item.confirmed_value_B as number,
                item.confirmed_value_C as number, item.confirmed_value_D as number
              )}</td>
              <td className="w-[15%]" > {item.observation}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {error &&
        <p className="text-white">{error}</p>
      }
      {loading &&
        <Loading />
      }
    </div>
    {modalViewOrder && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
          <h2 className="text-xl font-bold mb-4 text-black text-center uppercase">
            Visualizar Pedido
          </h2>
          <p className="text-black text-center">ID Pedido: {orderIndivudual?.id}</p>
          <p className="text-black text-xl text-center">
            Saldo Atual:{" "}

            {(
              (orderIndivudual?.confirmed_value_A ?? 0 * 10) + (orderIndivudual?.confirmed_value_B ?? 0 * 20) +
              (orderIndivudual?.confirmed_value_C ?? 0 * 50) + (orderIndivudual?.confirmed_value_D ?? 0 * 100)
            ) > 0 ?
              generateValueTotal(
                orderIndivudual?.confirmed_value_A as number, orderIndivudual?.confirmed_value_B as number,
                orderIndivudual?.confirmed_value_C as number, orderIndivudual?.confirmed_value_D as number
              )
              : generateValueTotal(
                orderIndivudual?.requested_value_A as number, orderIndivudual?.requested_value_B as number,
                orderIndivudual?.requested_value_C as number, orderIndivudual?.requested_value_D as number
              )}
          </p>
          <div className="w-full  flex justify-center items-center mt-2 mb-2">
            <div className="w-full h-1 bg-zinc-600 rounded"></div>
          </div>
          <div className="mb-4 flex flex-col w-full h-full gap-4 text-black">
            <div className="w-full flex items-center justify-center gap-2 ">
              <div className="w-20 text-center">R$ 10,00</div>
              <input
                className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                value={valueAddA}
                onChange={(e) => {
                  const inputValueA = e.target.value;
                  setValueAddA(
                    inputValueA === "" ? 0 : parseInt(inputValueA)
                  );
                }}
              />
              <div className="">{generateReal(valueAddA, 10)}</div>
            </div>

            <div className="w-full flex items-center justify-center gap-2 ">
              <div className="w-20 text-center">R$ 20,00</div>
              <input
                className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                value={valueAddB}
                onChange={(e) => {
                  const inputValueB = e.target.value;
                  setValueAddB(
                    inputValueB === "" ? 0 : parseInt(inputValueB)
                  );
                }}
              />
              <div>{generateReal(valueAddB, 20)}</div>
            </div>

            <div className="w-full flex items-center justify-center gap-2 ">
              <div className="w-20 text-center">R$ 50,00</div>
              <input
                className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                value={valueAddC}
                onChange={(e) => {
                  const inputValueC = e.target.value;
                  setValueAddC(
                    inputValueC === "" ? 0 : parseInt(inputValueC)
                  );
                }}
              />
              <div>{generateReal(valueAddD, 50)}</div>
            </div>

            <div className="w-full flex items-center justify-center gap-2 ">
              <div className="w-20 text-center">R$ 100,00</div>
              <input
                className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                value={valueAddD}
                onChange={(e) => {
                  const inputValueD = e.target.value;
                  setValueAddD(
                    inputValueD === "" ? 0 : parseInt(inputValueD)
                  );
                }}
              />
              <div>{generateReal(valueAddD, 100)}</div>
            </div>
          </div>
          <div className="text-black flex gap-2 justify-center items-center mb-2">
            <div className="w-80 border-2 border-zinc-700 rounded-lg h-14 flex justify-center items-center">
              {generateRealTotal(
                valueAddA,
                valueAddB,
                valueAddC,
                valueAddD
              )}
            </div>
          </div>
          <div className="w-full  flex justify-center items-center mt-2 mb-2">
            <div className="w-full h-1 bg-zinc-600 rounded"></div>
          </div>
          <div className="w-full  flex justify-center items-center mt-2 mb-2">
            <textarea className="text-black border-2 border-zinc-700 w-full h-52 p-3 rounded-md" value={obs} onChange={e => setObs(e.target.value)}></textarea>
          </div>
          <div className="w-full  flex justify-center items-center mt-2 mb-2">
            <div className="w-full h-1 bg-zinc-600 rounded"></div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={saveOneOrder}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Salvar
            </button>
            <button
              onClick={closeModalViewOrder}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Fechar Modal
            </button>
          </div>
        </div>
      </div>
    )}
    {modalOrderConfirmPartial &&
      <ModalConfirmPartial
        oIndividual={orderIndivudual as orderType}
        valueAdd={{
          a: valueAddA,
          b: valueAddB,
          c: valueAddC,
          d: valueAddD,
        }}
        setValueAddA={setValueAddA}
        setValueAddB={setValueAddB}
        setValueAddC={setValueAddC}
        setValueAddD={setValueAddD}
        onClose={closeModalConfirmPartial}
        onSave={saveConfirmPartialOneOrder}
        error={error}
      />
    }
    {modalRelauchOrder &&
      <ModalRelaunchOrder
        id={orderIndivudual?.id as number}
        value={dateAlter}
        onSetValue={handleSaveRelaunchValue}
        onConfirm={handleDateAlter}
        onClose={closeModalRelauchOrder}
        error={error}
      />
    }
    {modalGenerateRealse &&
      <PdfGenerator data={elementRelaease} onClose={closeGenerateModalRelease} />
    }
    {modalGeneratePayment &&
      <PdfGeneratorPayment data={elementPayment} banks={banks} onClose={closeGenerateMOdalPayment} />
    }
    {modalValidated &&
      <ModalValidated
        data={validated as orderType}
        onClose={handleCloseModalValidated}
        treasuries={treasuries}
      />
    }
    {modalError &&
      <ModalMessege type="" title="" messege="" onClose={handleCloseModalMessege} />
    }

  </Page>
}