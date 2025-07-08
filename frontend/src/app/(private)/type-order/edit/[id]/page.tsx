"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getTypeOrderForId, update } from "@/app/service/type-order";
import { validateField } from "@/app/utils/validateField";
import { typeOrderType } from "@/types/typeOrderType";
import {
  faAdd,
  faLandmark,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TypeOrderEdit() {

  const { id } = useParams()
  const router = useRouter()

  const [typeOrders, setTypeOrders] = useState<typeOrderType>()
  const [idSystemTypeOrder, setIdSystemTypeOrder] = useState('')
  const [nameTypeOrder, setNameTypeOrder] = useState('')
  const [statusTypeOrder, setStatusTypeOrder] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = "Tipo Pedido - Edit | CredNosso";
    getTypeOrderById()
  }, [id])


  const getTypeOrderById = async () => {
    setLoading(true)
    const tOrders = await getTypeOrderForId(id as string)
    if (tOrders.data.typeOrder.id) {
      setTypeOrders(tOrders.data.typeOrder)
      setIdSystemTypeOrder(tOrders.data.typeOrder.id_system)
      setNameTypeOrder(tOrders.data.typeOrder.name)
      setStatusTypeOrder(tOrders.data.typeOrder.status)
      setLoading(false)
      return
    } else {
      setLoading(false)
      toast.error('Erro ao retornar dados, tente novamente!')
      return
    }
  }

  const editTypeOrder = async () => {
    setLoading(true)
    if (idSystemTypeOrder === '' || !validateField(nameTypeOrder)) {
      setLoading(false)
      toast.error('Para continuar, preencha todos os campos corretamente!')
      return
    }
    let data = {
      id_system: parseInt(idSystemTypeOrder),
      name: nameTypeOrder.toUpperCase(),
      status: statusTypeOrder
    }
    const editedTypeOrder = await update(parseInt(id as string), data)
    if (editedTypeOrder.data.typeOrder && editedTypeOrder.data.typeOrder?.id) {
      setLoading(false)
      getTypeOrderById()
      return
    } else {
      setLoading(false)
      toast.error('Erro ao alterar, tente novamente!')
      return
    }
  }

  return (
    <Page>
      <TitlePages linkBack="/type-operation" icon={faAdd} >Adicionar Tipo de Pedido</TitlePages>
      <div className="flex flex-col gap-8 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Id</label>
          <Input color="#DDDD" placeholder="Digite o nome Id no sistema" size="extra-large"
            value={idSystemTypeOrder} onChange={(e) => setIdSystemTypeOrder(e.target.value)} icon={faReceipt} />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input color="#DDDD" placeholder="Digite o nome do Tipo de Pedido" size="extra-large"
            value={nameTypeOrder} onChange={(e) => setNameTypeOrder(e.target.value)} icon={faLandmark} />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Status</label>
          <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm  uppercase"
              value={statusTypeOrder ? "true" : "false"}
              onChange={e => setStatusTypeOrder(e.target.value === "true")}
            >
              <option
                className="uppercase bg-slate-700 text-white"
                value="true" >
                Ativo
              </option>
              <option
                className="uppercase bg-slate-700 text-white"
                value="false" >
                Inativo
              </option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-[300px]" >
          <Button color="#2E8B57" onClick={editTypeOrder} size="medium" textColor="white" variant={"primary"}>Editar</Button>
        </div>
        {error &&
          <div className="text-white">
            {error}
          </div>
        }
        {loading &&
          <Loading />
        }
      </div>
    </Page>
  );
}
