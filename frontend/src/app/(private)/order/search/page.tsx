"use client"

import { Page } from "@/app/components/ux/Page";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { TitlePages } from "@/app/components/ux/TitlePages";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Loading } from "@/app/components/ux/Loading";
import { getAll } from "@/app/service/type-operation";
import { getAll as getAllTypeOrder } from "@/app/service/type-order";
import { getAll as getAllTreasury } from "@/app/service/treasury";
import { typeOperationType } from "@/types/typeOperationType";
import { treasuryType } from "@/types/treasuryType";
import { typeOrderType } from "@/types/typeOrderType";
import { useRouter } from "next/navigation";
import { ButtonScreenOrder } from "@/app/components/ui/ButtonScreenOrder";
import { searchOrdersForDate } from "@/app/service/order";
import { orderType } from "@/types/orderType";
import { formatDateToString } from "@/app/utils/formatDateToString";
import { returnNameTreasury } from "@/app/utils/returnNameTreasury";


export default function Order() {

  const router = useRouter()

  const [typeOperations, setTypeOperations] = useState<typeOperationType[]>([])
  const [treasuries, setTreasuries] = useState<treasuryType[]>([])
  const [typeOrders, setTypeOrders] = useState<typeOrderType[]>([])
  const [orders, setOrders] = useState<orderType[]>([])

  const [items, setItems] = useState<{id : number, status : boolean}[]>([])
  const [toggleChecks, setToggleChecks] = useState(false)

  const [idTypeOperation, setIdTypeOperation] = useState('')
  const [idTreasuryOrigin, setIdTreasuryOrigin] = useState('')
  const [idTreasuryDestin, setIdTreasuryDestin] = useState('')
  const [idTypeOrder, setIdTypeOrder] = useState('')

  const [dateInitial, setDateInitial] = useState('')
  const [dateFinal, setDateFinal] = useState('')
  const [valueA, setValueA] = useState(0)
  const [valueB, setValueB] = useState(0)
  const [valueC, setValueC] = useState(0)
  const [valueD, setValueD] = useState(0)
  const [obs, setObs] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    allLoading()
  }, [])

  const allLoading = async () => {
    await typeOperationFunction()
    await treasuriesFunction()
    await typeOrderFunction()
  }

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
    if (tOperation.data.typeOperation && tOperation.data.typeOperation[0]?.id) {
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
    if (t.data.treasury && t.data.treasury[0]?.id) {
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
    if (tOrder.data.typeOrder && tOrder.data.typeOrder[0]?.id) {
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

  /*const saveOrder = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    if (
      idTypeOperation === '' || idTreasuryOrigin === '' || idTreasuryDestin === '' || idTypeOrder === '' ||
      dateOrder === ''
    ) {
      setError("Preencher todos os dados!")
      setLoading(false)
      return
    }

    let data = {
      id_type_operation: parseInt(idTypeOperation),
      id_treasury_origin: parseInt(idTreasuryOrigin),
      id_treasury_destin: idTypeOperation === '2' ? parseInt(idTreasuryOrigin) : parseInt(idTreasuryDestin),
      date_order: dateOrder,
      id_type_order: parseInt(idTypeOrder),
      requested_value_A: valueA,
      requested_value_B: valueB,
      requested_value_C: valueC,
      requested_value_D: valueD,
      status_order: 1,
      observation: obs
    }
    const newOrder = await add(data)
    if (newOrder.status === 300 || newOrder.status === 400 || newOrder.status === 500) {
      setError("Erro de requisição!")
      setLoading(false)
      return
    }
    if (newOrder.data.order && newOrder.data.order?.id) {
      await allLoading()
      setIdTypeOperation('1')
      setIdTreasuryOrigin('1')
      setIdTreasuryDestin('1')
      setIdTypeOrder('1')
      setValueA(0)
      setValueB(0)
      setValueC(0)
      setValueD(0)
      setObs('')
      setError('')
      setLoading(false)
      return
    } else {
      setError("Erro ao salvar!")
      setLoading(false)
      return
    }
  }*/

  const handleSearch = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    if (dateInitial === '') {
      setError('Preencher ao menos o campo de Data Inicial')
      setLoading(false)
      return
    }

    let data = {
      date_initial: dateInitial,
      date_final: dateFinal === '' ? dateInitial : dateFinal
    }
    console.log()
    const orderSarch = await searchOrdersForDate(data)
    if (orderSarch.status === 300 || orderSarch.status === 400 || orderSarch.status === 500) {
      setError("Erro de requisição")
      setLoading(false)
      return
    }
    if (orderSarch.data.order && orderSarch.data.order[0]?.id) {
      setOrders(orderSarch.data.order)
      let elements : any = []
      orderSarch.data.order.forEach((item : any) => (
        elements.push({
          id : item.id,
          status : false
        })
      ))
      setItems(elements)
      setError('')
      setLoading(false)
      return
    } else {
      setError('Sem dados a mostrar!')
      setLoading(false)
      return
    }
  }

  const view = () => {
    console.log(items)
  }

  const handleToggleSelect = () => {
    const newState = !toggleChecks
    setToggleChecks(newState)
  }

  const newCheckedItems: any = [];
    items.forEach((item) => {
      newCheckedItems.push({
        item.status = toggleChecks
      })
    });
    setItems(newCheckedItems);

  return (
    <Page>
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
          <Button color="" onClick={view} size="small" textColor="" secondaryColor="" >Confirmar</Button>
          <Button color="" onClick={() => { }} size="small" textColor="" secondaryColor="" >Confirmar</Button>
          <Button color="" onClick={() => { }} size="small" textColor="" secondaryColor="" >Confirmar</Button>
          <Button color="" onClick={() => { }} size="small" textColor="" secondaryColor="" >Confirmar</Button>
          <Button color="" onClick={() => { }} size="small" textColor="" secondaryColor="" >Confirmar</Button>
          <Button color="" onClick={() => { }} size="small" textColor="" secondaryColor="" >Confirmar</Button>
        </div>
        <div className="h-1 bg-zinc-500 w-full"></div>
        <div className="flex gap-2 items-center" >
        <input type="checkbox" className="w-4 h-4 outline-none" value={toggleChecks} onChange={handleToggleSelect }  />
        <label>Selecionar tudo</label>
        </div>
        <table className="flex-1 text-center p-3" width="100%">
          <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-xl">
            <tr>
              <th>#</th>
              <th>T. Operação</th>
              <th>Cod. Origem</th>
              <th>Trans. Origem</th>
              <th>Cod. Destino</th>
              <th>Trans. Destino</th>
              <th>Data</th>
              <th>Solicitado</th>
              <th>Status</th>
              <th>Realizado</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody className=" text-xl">
            {orders && orders.map((item, index) => (
              <tr className="h-12" key={index} >
                <td>
                  <input type="checkbox" className="w-4 h-4 outline-none" id={item.id?.toString()} value="" onChange={() => { }} />
                </td>
                <td>{item.id_type_operation}</td>
                <td>{ returnNameTreasury(treasuries, item.id_treasury_origin)}</td>
                <td>{item.id_treasury_origin}</td>
                <td>{ returnNameTreasury(treasuries, item.id_treasury_destin)}</td>
                <td>{item.id_treasury_destin}</td>
                <td>{ formatDateToString(item.date_order)}</td>
                <td>R$ 18.000,00</td>
                <td>{item.status_order}</td>
                <td>R$ 00,00</td>
                <td>{item?.observation}</td>
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
    </Page>
  );
}
