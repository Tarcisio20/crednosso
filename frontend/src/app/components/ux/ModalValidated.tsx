"use client"

import { generateFullReal } from "@/app/utils/generateFullReal";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { generateCurrency } from "@/app/utils/generateCurrency";
import { orderType } from "@/types/orderType";
import { treasuryType } from "@/types/treasuryType";
import { useEffect, useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { addRattedsOrder, getConfirmationByIdOrder } from "@/app/service/money-split";
import { addRefund } from "@/app/service/money-split-refund";
import { Loading } from "./Loading";
import { alterOrderById, delOrderById, getOrderById } from "@/app/service/order";
import { generateBills } from "@/app/utils/generateBills";

type ModalValidatedType = {
  data: orderType;
  treasuries: treasuryType[];
  onClose: () => void;
}

export const ModalValidated = ({ data, treasuries, onClose }: ModalValidatedType) => {

  useEffect(() => {
    handleGetConfirmations()
  }, [])


  const [totalConfirmed, setTotalConfirmed] = useState("0")
  const [total, setTotal] = useState("0")
  const [valueTotalOrder, setValueTotalOrder] = useState("")
  const [valueForTreasury, setValueForTreasury] = useState("")
  const [valueTotalConfirmed, setValueTotalConfirmed] = useState(false)
  const [idTreasury, setIdTreasury] = useState("")
  const [listConfirmed, setListConfirmed] = useState<{ id_order: number, id_treasury_origin: number, id_treasury_rating: number, value: number }[]>([])
  const [confimations, setConfirmations] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGetConfirmations = async () => {
    setError("")
    setLoading(true)
    const confirmationById = await getConfirmationByIdOrder(data.id as number)
    if (confirmationById.status === 300 || confirmationById.status === 400 || confirmationById.status === 500) {
      setError("Erro ao buscar confirmação")
      setLoading(false)
      return
    }
    if (confirmationById.data !== undefined && confirmationById.data.moneySplit.length > 0) {
      setConfirmations(confirmationById.data.moneySplit)
      let vt = 0
      confirmationById.data.moneySplit.map((item: any) => (
        vt += item.value
      ))
      setTotalConfirmed(vt.toString())
      if (vt > 0) {
        setTotal(generateFullReal(vt))
      } else {
        setTotal(generateRealTotal(
          data.requested_value_A,
          data.requested_value_B,
          data.requested_value_C,
          data.requested_value_D))
      }
    } else {
      setTotal(generateRealTotal(
        data.requested_value_A,
        data.requested_value_B,
        data.requested_value_C,
        data.requested_value_D))
    }

    setValueTotalOrder(generateRealTotal(
      data.requested_value_A,
      data.requested_value_B,
      data.requested_value_C,
      data.requested_value_D))
    setIdTreasury(treasuries[0].id_system.toString())
    setLoading(false)
  }

  const handleSave = async () => {
    setError("")
    setLoading(true)
    if (listConfirmed.length === 0) {
      setError("Nenhum valor foi confirmado")
      setLoading(false)
      return
    }
    let vc = 0
    listConfirmed.map((item) => (
      vc += item.value
    ))
    if (vc === generateCurrency(valueTotalOrder)) {
      const addRatted = await addRattedsOrder(listConfirmed)
      if (addRatted.status === 300 || addRatted.status === 400 || addRatted.status === 500) {
        setError("Erro ao salvar")
        setLoading(false)
        return
      }
      if (addRatted.data === undefined && addRatted.data.moneySplit.length === 0) {
        setError("Erro ao salvar")
        setLoading(false)
        return
      }

      const order = await getOrderById(data.id as number)
      if (order.status === 300 || order.status === 400 || order.status === 500) {
        setError("Erro ao buscar pedido")
        setLoading(false)
        return
      }

      const generateValue = {
        confirmed_value_A: order.data.order[0].requested_value_A,
        confirmed_value_B: order.data.order[0].requested_value_B,
        confirmed_value_C: order.data.order[0].requested_value_C,
        confirmed_value_D: order.data.order[0].requested_value_D,
        composition_change: true,
        status_order: 2,
      }
      const a = await alterOrderById(data.id as number, generateValue)
    } else if (vc < generateCurrency(valueTotalOrder)) {
      const addRatted = await addRattedsOrder(listConfirmed)
      if (addRatted.status === 300 || addRatted.status === 400 || addRatted.status === 500) {
        setError("Erro ao salvar")
        setLoading(false)
        return
      }
      if (addRatted.data === undefined && addRatted.data.moneySplit.length === 0) {
        setError("Erro ao salvar")
        setLoading(false)
        return
      }
      let vEstorno = generateCurrency(valueTotalOrder) - vc
      const dataEstorno = {
        id_order: data.id as number,
        id_treasury_origin: data.id_treasury_destin,
        value: vEstorno,
      }
      const addEstorno = await addRefund(dataEstorno)
      if (addEstorno.status === 300 || addEstorno.status === 400 || addEstorno.status === 500) {
        setError("Erro ao estornar")
        setLoading(false)
        return
      }
      if (addEstorno.data === undefined && addEstorno.data.moneySplitRefund.length === 0) {
        setError("Erro ao estornar")
        setLoading(false)
        return
      }

      const order = await getOrderById(data.id as number)

      if (order.status === 300 || order.status === 400 || order.status === 500) {
        setError("Erro ao buscar pedido")
        setLoading(false)
        return
      }
      if (order.data === undefined && order.data.order.length === 0) {
        setError("Erro ao buscar pedido")
        setLoading(false)
        return
      }

      const generateValue = generateCurrency(generateRealTotal(
        order.data.order[0].requested_value_A,
        order.data.order[0].requested_value_B,
        order.data.order[0].requested_value_C,
        order.data.order[0].requested_value_D
      ))
   
      const bills = generateBills((generateValue - vEstorno))
      if (bills) {
        const newBills = {
          confirmed_value_A: bills.bills_10,
          confirmed_value_B: bills.bills_20,
          confirmed_value_C: bills.bills_50,
          confirmed_value_D: bills.bills_100,
          composition_change: true,
          status_order: 3,
        }
        await alterOrderById(data.id as number, newBills)
      }
      vEstorno = 0
    }
     setLoading(false)
      handleClose()

  }

  const handleClose = () => {
    setTotalConfirmed("0")
    setTotal("0")
    setValueTotalOrder("")
    setValueForTreasury("")
    setValueTotalConfirmed(false)
    setIdTreasury("")
    onClose()
  }


  const addValueForTreasury: () => void = async () => {
    setError("");
    setLoading(true)
    const ValorCampo = generateCurrency(valueForTreasury);
    const totalDisponivel = generateCurrency(total);
    const numericTotalConfirmed = generateCurrency(totalConfirmed);

    const valorAcumulado = totalDisponivel - ValorCampo
    if (!ValorCampo || ValorCampo === 0) {
      setError("Valor não pode ser vazio ou 0");
      setLoading(false)
      return;
    }
    if (ValorCampo > totalDisponivel) {
      setError("Valor maior que o total do pedido");
      setLoading(false)
      return;
    }
    if (ValorCampo < 0) {
      setError("Valor menor que 0");
      setLoading(false)
      return;
    }


    const confirmAlter = window.confirm(`Deseja confirmar o valor ${valueForTreasury} para a transportadora ${idTreasury}?`);
    if (!confirmAlter) {
      setError("Cancelada a operação");
      setLoading(false)
      return;
    }


    const newConfirmed = numericTotalConfirmed + ValorCampo;

    setTotal(generateFullReal(valorAcumulado).toString());
    setTotalConfirmed(newConfirmed.toString());

    const dataItems = {
      id_order: data.id as number,
      id_treasury_origin: data.id_treasury_destin,
      id_treasury_rating: parseInt(idTreasury),
      value: ValorCampo,
    };
    setListConfirmed(prevList => [...prevList, dataItems]);
    setValueForTreasury(""); // limpa input só aqui
    if (valorAcumulado === 0) {
      setValueTotalConfirmed(true)
    }


    setLoading(false)
  };


  const handleInputChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueForTreasury(event.target.value)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value) || "";
    setIdTreasury(value.toString());
  };

  // Atualiza o estado ao selecionar no select
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIdTreasury(event.target.value.toString());
  };

  const handleDeleteIndividual = (id: number, value: number) => {
    const totalDisponivel = generateCurrency(total);
    const numericTotalConfirmed = generateCurrency(totalConfirmed);
    const newList = listConfirmed.filter((item) => item.id_treasury_rating !== id);
    setListConfirmed(newList)
    let acumulado = totalDisponivel + value
    setTotal(generateFullReal(acumulado).toString());
    const newConfirmed = numericTotalConfirmed - value;
    setTotalConfirmed(newConfirmed.toString());
  }

  return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="font-bold mb-4 text-black text-center uppercase text-4xl">
        Ratear Pedido
      </h2>
      <p className="text-black text-center">ID Pedido: {data.id}</p>
      <p className="text-black text-center">ID Tranportadora: {data.id_treasury_destin}</p>
      <p className="text-black text-center">Total Pedido: {valueTotalOrder}</p>
      <p className="text-black text-center">Total Confirmado: {generateFullReal(parseInt(totalConfirmed))}</p>
      <p className="text-black text-center">Total Disponivel: {total}</p>
      <div className="w-full  flex justify-center items-center mt-2 mb-2">
        <div className="w-full h-1 bg-zinc-600 rounded"></div>
      </div>
      <div className="mb-4 flex flex-col w-full h-full gap-4 text-black">
        {!valueTotalConfirmed &&
          <div className="flex flex-col justify-center items-center gap-4">
            <label className="text-black uppercase text-xl">Selecione a Transportadora e coloque o valor</label>

            <div className="flex flex-col gap-2">
              <label className="uppercase leading-3 font-bold">
                Transportadora
              </label>
              <div className="flex gap-2">
                <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
                  <input
                    value={idTreasury}
                    onChange={handleInputChange}
                    className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                  />
                </div>
                <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-80 h-11 text-lg`} >
                  <select
                    className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                    value={idTreasury}
                    onChange={handleSelectChange}
                  >
                    {treasuries.map((treasury) => (
                      <option key={treasury.id} value={treasury.id_system} className="uppercase bg-slate-700 text-white">
                        {treasury.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>


            <div className="flex flex-col gap-2">
              <label className="uppercase leading-3 font-bold">Valor</label>
              <Input
                color="#DDDD"
                placeholder="Digite o valor para essa transportadora"
                size="extra-large"
                value={valueForTreasury}
                onChange={handleInputChangeValue}
                mask="currency"
              />
            </div>

            <div className="flex flex-col gap-5">
              <Button
                color="#2E8B57"
                onClick={addValueForTreasury}
                size="medium"
                textColor="white"
                disabled={loading}
              >
                Salvar
              </Button>
            </div>
            {error &&
              <div className="flex flex-col gap-2">
                <p className="text-red-500 text-center">{error}</p>
              </div>
            }
          </div>
        }
        {valueTotalConfirmed &&
          <p className="text-black text-center">Valor alcançado</p>
        }
      </div>
      <div className="w-full  flex justify-center items-center mt-2 mb-2">
        <div className="w-full h-1 bg-zinc-600 rounded"></div>
      </div>
      {listConfirmed && listConfirmed.length > 0 &&
        <>
          <div className="w-full  flex justify-center items-center mt-2 mb-2">
            <div className="flex flex-col gap-2">
              <label className="uppercase leading-3 font-bold text-center text-zinc-700">Valores Confirmados</label>
              {listConfirmed.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <p className="text-black font-xl">{`Transportadora: ${item.id_treasury_rating} - Valor: ${generateFullReal(item.value)}`}</p>
                  <button className="bg-red-600 pl-1 pr-1 rounded-full" onClick={() => handleDeleteIndividual(item.id_treasury_rating, item.value)} >X</button>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full  flex justify-center items-center mt-2 mb-2">
            <div className="w-full h-1 bg-zinc-600 rounded"></div>
          </div>
        </>
      }

      <div className="flex justify-center gap-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={loading}
        >
          Confirmar Total
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </div>
    {loading && <Loading />}
  </div>
}