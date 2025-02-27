"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/type-order";
import { validateField } from "@/app/utils/validateField";
import { faAdd, faLandmark, faVault, faReceipt, faListOl } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function TypeOrderAdd() {

  const router = useRouter()

  const [idSystemTypeOrder, setIdSystemTypeOrder] = useState('')
  const [nameTypeOrder, setNameTypeOrder] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const addTypeOrder = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    if (idSystemTypeOrder === '' || !validateField(nameTypeOrder)) {
      setError('Preencher todos os dados!')
      setLoading(false)
      return
    }
    let data = {
      id_system : parseInt(idSystemTypeOrder),
      name : nameTypeOrder.toUpperCase()
    }
    const newTypeOrder = await add(data)
    if(newTypeOrder.data.typeOrder.id){
      setLoading(false)
      setError('')
      router.push('/type-order')
      return
    }else{
      setError("Erro ao salvar!")
      setLoading(false)
      return
    }
  }

  return (
    <Page>
      <TitlePages linkBack="/type-order" icon={faAdd} >Adicionar Tipo de Pedido</TitlePages>
      <div className="flex flex-col gap-8 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Id</label>
          <Input color="#DDDD" placeholder="Digite o nome Id no sistema" size="extra-large" value={idSystemTypeOrder} onChange={setIdSystemTypeOrder} icon={faReceipt} />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input color="#DDDD" placeholder="Digite o nome do Tipo de Pedido" size="extra-large" value={nameTypeOrder} onChange={setNameTypeOrder} icon={faLandmark} />
        </div>
        <div className="flex flex-col gap-5" >
          <Button color="#2E8B57" onClick={addTypeOrder} size="meddium" textColor="white" secondaryColor="#81C784">Cadastrar</Button>
        </div>
        {error &&
          <div>
            <p className="text-white">{error}</p>
          </div>
        }
        {loading &&
          <Loading />
        }
      </div>
    </Page>
  );
}
