"use client"

import { Page } from "@/app/components/ux/Page";
import { faCheck, faCheckDouble, faCodeCompare, faEnvelope, faEye, faFileExport, faL, faMagnifyingGlass, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { TitlePages } from "@/app/components/ux/TitlePages";
import { useEffect, useState } from "react";
import { Loading } from "@/app/components/ux/Loading";
import { getAll } from "@/app/service/type-operation";
import { getAll as getAllTypeOrder } from "@/app/service/type-order";
import { getAll as getAllTreasury } from "@/app/service/treasury";
import { typeOperationType } from "@/types/typeOperationType";
import { treasuryType } from "@/types/treasuryType";
import { typeOrderType } from "@/types/typeOrderType";
import { useRouter } from "next/navigation";
import { ButtonScreenOrder } from "@/app/components/ui/ButtonScreenOrder";
import { alterValueOrder, getOrderById, searchOrdersForDate } from "@/app/service/order";
import { orderType } from "@/types/orderType";
import { formatDateToString } from "@/app/utils/formatDateToString";
import { returnNameTreasury } from "@/app/utils/returnNameTreasury";
import { generateValueTotal } from "@/app/utils/generateValueTotal";
import { generateReal } from "@/app/utils/generateReal";
import { generateRealTotal } from "@/app/utils/generateRealTotal";


export default function Order() {

  const router = useRouter()

  const [typeOperations, setTypeOperations] = useState<typeOperationType[]>([])
  const [treasuries, setTreasuries] = useState<treasuryType[]>([])
  const [typeOrders, setTypeOrders] = useState<typeOrderType[]>([])
  const [orders, setOrders] = useState<orderType[]>([])

  const [itemsChecks, setItemsChecks] = useState<{ id: number, status: boolean }[]>([])
  const [toggleChecks, setToggleChecks] = useState(false)

  const [idTypeOperation, setIdTypeOperation] = useState('')
  const [idTreasuryOrigin, setIdTreasuryOrigin] = useState('')
  const [idTreasuryDestin, setIdTreasuryDestin] = useState('')
  const [idTypeOrder, setIdTypeOrder] = useState('')

  const [dateInitial, setDateInitial] = useState('')
  const [dateFinal, setDateFinal] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [modalViewOrder, setModalViewOrder] = useState(false)

  const [orderIndivudual, setOrderIndividual] = useState<orderType>()

  const [valueAddA, setValueAddA] = useState(0)
  const [valueAddB, setValueAddB] = useState(0)
  const [valueAddC, setValueAddC] = useState(0)
  const [valueAddD, setValueAddD] = useState(0)

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
    const orderSarch = await searchOrdersForDate(data)
    if (orderSarch.status === 300 || orderSarch.status === 400 || orderSarch.status === 500) {
      setError("Erro de requisição")
      setLoading(false)
      return
    }
    if (orderSarch.data.order && orderSarch.data.order[0]?.id) {
      setOrders(orderSarch.data.order)
      let elements: any = []
      orderSarch.data.order.forEach((item: any) => (
        elements.push({
          id: item.id,
          status: false
        })
      ))
      setItemsChecks(elements)
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
    console.log(itemsChecks)
  }

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
        item.id === id ? { ...item, status: !item.status } : item
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
    const orderSelectedOne = orders.filter(item => item.id === itemsSelected[0].id)
    console.log(orderSelectedOne[0])

    if (orderSelectedOne[0] && orderSelectedOne[0]?.id) {
      setOrderIndividual(orderSelectedOne[0])
      setValueAddA(orderSelectedOne[0].requested_value_A)
      setValueAddB(orderSelectedOne[0].requested_value_B)
      setValueAddC(orderSelectedOne[0].requested_value_C)
      setValueAddD(orderSelectedOne[0].requested_value_D)
      setModalViewOrder(true)
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


  const saveOneOrder = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    let data = {
      requested_value_A : valueAddA,
      requested_value_B : valueAddB,
      requested_value_C : valueAddC,
      requested_value_D : valueAddD,
    }
    const orderSave = await alterValueOrder(orderIndivudual?.id as number, data) 
    if(orderSave.status === 300 || orderSave.status === 400 || orderSave === 500){
      setError('Erro na requisição')
      setLoading(false)
      return
    }
    if(orderSave.data.order && orderSave.data.order?.id){
      handleSearch()
      setError('')
      setLoading(false)
      setModalViewOrder(false)
      return
    }
  }
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
          <ButtonScreenOrder color="#415eff" onClick={view} size="btn-icon-text"
            textColor="white" secondaryColor="#546bec" icon={faCheckDouble}
          >Confirmar Total</ButtonScreenOrder>
          <ButtonScreenOrder color="#415eff" onClick={view} size="btn-icon-text"
            textColor="white" secondaryColor="#546bec" icon={faCheck}
          >Confirmar Parcial</ButtonScreenOrder>
          <ButtonScreenOrder color="#415eff" onClick={view} size="btn-icon-text"
            textColor="white" secondaryColor="#546bec" icon={faFileExport}
          >Gerar Lançamento</ButtonScreenOrder>
          <ButtonScreenOrder color="#415eff" onClick={view} size="btn-icon-text"
            textColor="white" secondaryColor="#546bec" icon={faFileExport}
          >Gerar Pagamento</ButtonScreenOrder>
          <ButtonScreenOrder color="#415eff" onClick={view} size="btn-icon-text"
            textColor="white" secondaryColor="#546bec" icon={faFileExport}
          >Gerar Relatório</ButtonScreenOrder>
          <ButtonScreenOrder color="#415eff" onClick={view} size="btn-icon-text"
            textColor="white" secondaryColor="#546bec" icon={faCodeCompare}
          >Relançar Pedido</ButtonScreenOrder>
          <ButtonScreenOrder color="#415eff" onClick={view} size="btn-icon-text"
            textColor="white" secondaryColor="#546bec" icon={faEnvelope}
          >Enviar E-mail</ButtonScreenOrder>
          <ButtonScreenOrder color="#415eff" onClick={viewOrder} size="btn-icon-text"
            textColor="white" secondaryColor="#546bec" icon={faEye}
          >Visualizar</ButtonScreenOrder>
          <ButtonScreenOrder color="#a62a12" onClick={view} size="btn-icon-text"
            textColor="white" secondaryColor="#ff0000" icon={faTrashCan}
          >Excluir</ButtonScreenOrder>
        </div>
        <div className="h-1 bg-zinc-500 w-full"></div>
        <div className="flex gap-2 items-center" >
          <input
            type="checkbox"
            className="w-4 h-4 outline-none"
            checked={toggleChecks}
            onChange={handleToggleSelect}
          />
          <label>{toggleChecks ? 'Desmarcar' : 'Selecionar'} tudo</label>
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
                  <input
                    type="checkbox"
                    className="w-4 h-4 outline-none"
                    id={item.id?.toString()}
                    value=""
                    onChange={() => handleIndividualCheck(item.id as number)}
                    checked={
                      itemsChecks.find(i => i.id === item.id)?.status || false
                    }
                  />
                </td>
                <td>{item.id_type_operation}</td>
                <td>{returnNameTreasury(treasuries, item.id_treasury_origin)}</td>
                <td>{item.id_treasury_origin}</td>
                <td>{returnNameTreasury(treasuries, item.id_treasury_destin)}</td>
                <td>{item.id_treasury_destin}</td>
                <td>{formatDateToString(item.date_order)}</td>
                <td>{generateValueTotal(
                  item.requested_value_A as number, item.requested_value_B as number,
                  item.requested_value_C as number, item.requested_value_D as number
                )}</td>
                <td>{item.status_order}</td>
                <td>{generateValueTotal(
                  item.confirmed_value_A as number, item.confirmed_value_B as number,
                  item.confirmed_value_C as number, item.confirmed_value_D as number
                )}</td>
                <td>{item.observation}</td>
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
              {generateValueTotal(
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
    </Page>

  )
}