"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/type-order";
import { validateField } from "@/app/utils/validateField";
import { faAdd, faLandmark, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function TypeOrderAdd() {
  useEffect(() => {
    document.title = "Tipo Pedido - Add | CredNosso";
  }, []);

  const router = useRouter()

  const [idSystemTypeOrder, setIdSystemTypeOrder] = useState('')
  const [nameTypeOrder, setNameTypeOrder] = useState('')
  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false)

  const addTypeOrder = async () => {
    setLoading(true)
    if (idSystemTypeOrder === '' || !validateField(nameTypeOrder)) {
      setLoading(false)
      toast.error('Para continuar, preencha todos os campos corretamente!')
      return
    }
    let data = {
      id_system: parseInt(idSystemTypeOrder),
      name: nameTypeOrder.toUpperCase()
    }
    const newTypeOrder = await add(data)
    if (newTypeOrder.data.typeOrder.id) {
      setIdSystemTypeOrder("")
      setNameTypeOrder("")
      setLoading(false)
      toast.success('Tipo de Pedido salvo com sucesso!');
      return
    } else {
      setLoading(false)
      toast.error('Erro ao salvar, tente novamente!')
      return
    }
  }

  return (
    <Page>
      <TitlePages linkBack="/type-order" icon={faAdd} >Adicionar Tipo de Pedido</TitlePages>
      <div className="flex flex-col gap-8 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Id</label>
          <Input color="#DDDD" placeholder="Digite o nome Id no sistema" size="extra-large" value={idSystemTypeOrder} onChange={(e) => setIdSystemTypeOrder(e.target.value)} icon={faReceipt} />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input color="#DDDD" placeholder="Digite o nome do Tipo de Pedido" size="extra-large" value={nameTypeOrder} onChange={(e) => setNameTypeOrder(e.target.value)} icon={faLandmark} />
        </div>
        <div className="flex flex-col gap-5" >
          <Button color="#2E8B57" onClick={addTypeOrder} size="meddium" textColor="white" secondaryColor="#81C784">Cadastrar</Button>
        </div>
        {error.messege && (
          <Messeger type={error.type} title={error.title} messege={error.messege} />
        )}
        {loading &&
          <Loading />
        }
      </div>
    </Page>
  );
}
