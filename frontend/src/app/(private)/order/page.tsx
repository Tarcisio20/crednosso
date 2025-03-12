"use client"

import { Page } from "@/app/components/ux/Page";
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { TitlePages } from "@/app/components/ux/TitlePages";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Loading } from "@/app/components/ux/Loading";
import { getAll } from "@/app/service/type-operation";
import { getAll as getAllTypeOrder } from "@/app/service/type-order";
import { getAll as getAllTreasury } from "@/app/service/treasury";
import { typeOperationType } from "@/types/typeOperationType";
import { treasuryType } from "@/types/treasuryType";
import { typeOrderType } from "@/types/typeOrderType";
import { generateReal } from "@/app/utils/generateReal";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { add } from "@/app/service/order";
import { useRouter } from "next/navigation";

export default function Order() {

  const router = useRouter()

  const [typeOperations, setTypeOperations] = useState<typeOperationType[]>([])
  const [treasuries, setTreasuries] = useState<treasuryType[]>([])
  const [treasuriesFormatted, setTreasuriesFormatted] = useState([])
  const [typeOrders, setTypeOrders] = useState<typeOrderType[]>([])

  const [idTypeOperation, setIdTypeOperation] = useState('')
  const [idTreasuryOrigin, setIdTreasuryOrigin] = useState('')
  const [idTreasuryDestin, setIdTreasuryDestin] = useState('')
  const [idTypeOrder, setIdTypeOrder] = useState('')

  const [dateOrder, setDateOrder] = useState('')
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
    console.log(t.data.treasury[0].id_system)
    if (t.data.treasury && t.data.treasury[0]?.id > 0) {
      setTreasuries(t.data.treasury)
      setIdTreasuryOrigin(t.data.treasury[0].id_system)
      setIdTreasuryDestin(t.data.treasury[0].id_system)
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

  const saveOrder = async () => {
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
  }

  const searchOrder = () => {
    router.push('/order/search')
    return
  }

  const handleFilterByIdSystemOrigin = () => {
    const searchId = parseInt(idTreasuryOrigin);


    return treasuries.filter(treasury =>
      !isNaN(searchId) && treasury.id_system === searchId
    );
  }

  const handleFilterByIdSystemDestin = () => {
    const searchId = parseInt(idTreasuryDestin);


    return treasuries.filter(treasury =>
      !isNaN(searchId) && treasury.id_system === searchId
    );
  }

  const handleInputChangeOrigin = (e: ChangeEvent<HTMLInputElement>) => {
    setIdTreasuryOrigin(e.target.value);
  };

  const handleInputChangeDestin = (e: ChangeEvent<HTMLInputElement>) => {
    setIdTreasuryDestin(e.target.value);
  };

  return (
    <Page>
      <TitlePages linkBack="/" icon={faCoins} >Pedidos</TitlePages>
      <div className="flex flex-row gap-4 p-5 w-full">
        <div className="flex flex-col gap-5 w-1/3">
          <label className="uppercase leading-3 font-bold">Tipo de Operação</label>
          <div className="flex gap-2">
            <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
              <input
                value={idTypeOperation}
                onChange={e => setIdTypeOperation(e.target.value)}
                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
              />
            </div>
            <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
              <select
                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                value={idTypeOperation}
                onChange={e => setIdTypeOperation(e.target.value)}
              >
                {typeOperations && typeOperations.map((item, index) => (
                  <option
                    className="uppercase bg-slate-700 text-white"
                    value={item.id} key={index} >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="uppercase leading-3 font-bold">Transportadora Origem</label>
          <div className="flex gap-2">
            <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
              <input
                value={idTreasuryOrigin}
                onChange={handleInputChangeOrigin}
                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
              />
            </div>
            <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
              <select
                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                value={idTreasuryOrigin}
                onChange={e => setIdTreasuryOrigin(e.target.value)}
              >
                {handleFilterByIdSystemOrigin().length > 0 ? (
                  handleFilterByIdSystemOrigin().map(treasury => (
                    <option key={treasury.id} value={treasury.id} className="uppercase bg-slate-700 text-white">
                      {treasury.name}
                    </option>
                  ))
                ) : (
                  <option value="">Nenhum tesouro encontrado</option>
                )}

              </select>
            </div>
          </div>
          {idTypeOperation !== "2" &&
            <>
              <label className="uppercase leading-3 font-bold">Transportadora Destino</label>
              <div className="flex gap-2">
                <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
                  <input
                    value={idTreasuryDestin}
                    onChange={handleInputChangeDestin}
                    className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                  />
                </div>
                <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                  <select
                    className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                    value={idTreasuryDestin}
                    onChange={e => setIdTreasuryDestin(e.target.value)}
                  >
                    {handleFilterByIdSystemDestin().length > 0 ? (
                      handleFilterByIdSystemDestin().map(treasury => (
                        <option key={treasury.id} value={treasury.id} className="uppercase bg-slate-700 text-white">
                          {treasury.name}
                        </option>
                      ))
                    ) : (
                      <option value="">Nenhum tesouro encontrado</option>
                    )}

                  </select>
                </div>
              </div>
            </>
          }
          <label className="uppercase leading-3 font-bold">Data</label>
          <div className="flex gap-2">
            <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-4/6 text-lg">
              <input
                type="date"
                value={dateOrder}
                onChange={e => setDateOrder(e.target.value)}
                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
              />
            </div>
          </div>


          <label className="uppercase leading-3 font-bold">Tipo de Pedido</label>
          <div className="flex gap-2">
            <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
              <input
                value={idTypeOrder}
                onChange={e => setIdTypeOrder(e.target.value)}
                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
              />
            </div>
            <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
              <select
                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                value={idTypeOrder}
                onChange={e => setIdTypeOrder(e.target.value)}
              >
                {typeOrders && typeOrders.map((item, index) => (
                  <option
                    className="uppercase bg-slate-700 text-white"
                    value={item.id} key={index} >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
        <div className="flex flex-col gap-5 w-1/3">
          <label className="uppercase leading-3 font-bold">Valor Solicitação</label>
          <div className="flex gap-3 items-center">
            <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-40 text-lg flex justify-center items-center" >R$ 10,00</label>
            <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-28 text-lg">
              <input
                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full flex justify-center items-center"
                value={valueA}
                onChange={(e) => {
                  const inputValueA = e.target.value
                  setValueA(inputValueA === "" ? 0 : parseInt(inputValueA))
                }}
              />
            </div>
            <label
              className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 flex-1 text-lg flex justify-center items-center">
              {generateReal(valueA, 10)}
            </label>
          </div>

          <div className="flex gap-3 items-center">
            <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-40 text-lg flex justify-center items-center" >R$ 20,00</label>
            <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-28 text-lg">
              <input
                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full flex justify-center items-center"
                value={valueB}
                onChange={(e) => {
                  const inputValueB = e.target.value
                  setValueB(inputValueB === "" ? 0 : parseInt(inputValueB))
                }}
              />
            </div>
            <label
              className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 flex-1 text-lg flex justify-center items-center">
              {generateReal(valueB, 20)}
            </label>
          </div>

          <div className="flex gap-3 items-center">
            <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-40 text-lg flex justify-center items-center" >R$ 50,00</label>
            <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-28 text-lg">
              <input
                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full flex justify-center items-center"
                value={valueC}
                onChange={(e) => {
                  const inputValueC = e.target.value
                  setValueC(inputValueC === "" ? 0 : parseInt(inputValueC))
                }}
              />
            </div>
            <label
              className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 flex-1 text-lg flex justify-center items-center">
              {generateReal(valueC, 50)}
            </label>
          </div>

          <div className="flex gap-3 items-center">
            <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-40 text-lg flex justify-center items-center" >R$ 100,00</label>
            <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-28 text-lg">
              <input
                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full flex justify-center items-center"
                value={valueD}
                onChange={(e) => {
                  const inputValueD = e.target.value
                  setValueD(inputValueD === "" ? 0 : parseInt(inputValueD))
                }}
              />
            </div>
            <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 flex-1 text-lg flex justify-center items-center">
              {generateReal(valueD, 100)}
            </label>
          </div>
          <div className="flex gap-3 items-center justify-center border-2 border-zinc-500 rounded-lg">
            <div className="text-4xl">{generateRealTotal(valueA, valueB, valueC, valueD)}</div>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-1/3">
          <label className="uppercase leading-3 font-bold">Observações</label>
          <textarea
            className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 outline-none border-slate-600 h-5 flex-1 text-lg flex justify-center items-center"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="mt-5 flex flex-row gap-3">
        <Button color="#2E8B57" onClick={saveOrder} size="large" textColor="white" secondaryColor="#81C784"  >Salvar</Button>
        <Button color="#2E8B57" onClick={searchOrder} size="large" textColor="white" secondaryColor="#81C784"  >Pesquisar</Button>
      </div>
      <div className="mt-5 flex flex-row gap-3">
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
