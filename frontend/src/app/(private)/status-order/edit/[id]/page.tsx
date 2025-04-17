"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getStatusOrderForId, update } from "@/app/service/status-order";
import { validateField } from "@/app/utils/validateField";
import { statusOrderType } from "@/types/statusOrder";
import {
  faLandmark,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function StatusOrderEdit() {

  const { id } = useParams()
  const router = useRouter()

  if (!id) {
    router.push('/status-order')
    return
  }

  const [, setStatusOrder] = useState<statusOrderType>()
  const [nameStatusOrder, setNameStatusOrder] = useState('')
  const [statusStatusOrder, setStatusStatusOrder] = useState(true)

  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false)

  const getStatusOrder = useCallback(async () => {
    setError({ type: '', title: '', messege: '' })
    setLoading(false);
    setLoading(true);
    try {
      const getSOrder = await getStatusOrderForId(id as string);
      if (getSOrder.status === 300 || getSOrder.status === 400 || getSOrder.status === 500) {
        setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, tente novamente!' })
        setLoading(false);
        return;
      }
      if (getSOrder.data.statusOrder && getSOrder.data.statusOrder?.id) {
        setStatusOrder(getSOrder.data.statusOrder);
        setNameStatusOrder(getSOrder.data.statusOrder.name);
        setStatusStatusOrder(getSOrder.data.statusOrder.status);
        setLoading(false);
        return;
      } else {
        setError({ type: 'error', title: 'Error', messege: 'Nada a mostrar!' })
        setLoading(false);
        return;
      }
    } catch (error) {
      setError({ type: 'error', title: 'Error', messege: 'Erro ao carregar os dados!' });
    } finally {
      setLoading(false); // Sempre finaliza o loading, seja com sucesso ou erro
    }

  }, [id]);

  useEffect(() => {
    document.title = "Status Pedido - Edit | CredNosso";
    getStatusOrder();
  }, [id]);

  const editTypeOperation = async () => {
    setError({ type: '', title: '', messege: '' })
    setLoading(false)
    setLoading(true)
    if (!validateField(nameStatusOrder)) {
      setError({ type: 'error', title: 'Error', messege: 'Preencha todos os campos!' })
      setLoading(false)
      return
    }
    const data = {
      name: nameStatusOrder.toUpperCase(),
      status: statusStatusOrder
    }
    const editedStatusOrder = await update(parseInt(id as string), data)
    if (editedStatusOrder.status === 300 || editedStatusOrder.status === 400 || editedStatusOrder.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, tente novamente!' })
      setLoading(false)
      return
    }
    if (editedStatusOrder.data.statusOrder && editedStatusOrder.data.statusOrder?.id) {
      getStatusOrder()
      setError({ type: 'success', title: 'Success', messege: 'Alterado com sucesso!' })
      setLoading(false)
      return
    } else {
      setError({ type: 'error', title: 'Error', messege: 'Erro ao alterar, tente novamente!' })
      setLoading(false)
      return
    }
  }

  return (
    <Page>
      <TitlePages linkBack="/status-order" icon={faPenToSquare} >Editar Status do Pedido</TitlePages>
      <div className="flex flex-col gap-8 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input color="#DDDD" placeholder="Digite o nome do Tipo de Operação" size="extra-large"
            value={nameStatusOrder} onChange={(e) => setNameStatusOrder(e.target.value)} icon={faLandmark} />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Status</label>
          <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg uppercase"
              value={statusStatusOrder ? "true" : "false"}
              onChange={e => setStatusStatusOrder(e.target.value === "true")}
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
        <div className="flex flex-col gap-5" >
          <Button color="#2E8B57" onClick={editTypeOperation} size="meddium" textColor="white" secondaryColor="#81C784">Editar</Button>
        </div>
        {error.messege &&
          <Messeger type={error.type} title={error.title} messege={error.messege} />
        }
        {loading &&
          <Loading />
        }
      </div>
    </Page>
  );
}
