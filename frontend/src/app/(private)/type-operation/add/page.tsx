"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/type-operation";
import { validateField } from "@/app/utils/validateField";
import { faAdd, faLandmark, faVault, faReceipt, faListOl } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function TypeOperationAdd() {

  const router = useRouter()

  const [idSystemTypeOperation, setIdSystemTypeOperation] = useState('')
  const [nameTypeOperation, setNameTypeOperation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const addTypeOperation = async () => {
    setError('')
    setLoading(true)
    if(!validateField(nameTypeOperation) || idSystemTypeOperation === ''){
      setError('Favor preencher todos os campos corretamente!')
      setLoading(false)
      return
    }
    let data = {
      id_system : parseInt(idSystemTypeOperation),
      name : nameTypeOperation.toUpperCase()
    }
     const newTypeOperation = await add(data)
    if(newTypeOperation.data.typeOperation.id){
      setLoading(false)
      router.push('/type-operation')
      return
    }else{
      setLoading(false)
      setError("Erro ao salvar!")
      return
    }
  }

  return (
    <Page>
      <TitlePages linkBack="/type-operation" icon={faAdd} >Adicionar Tipo de Operação</TitlePages>
      <div className="flex flex-col gap-8 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Id</label>
          <Input color="#DDDD" placeholder="Digite o nome Id no sistema" size="extra-large" value={idSystemTypeOperation} onChange={setIdSystemTypeOperation} icon={faReceipt} />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input color="#DDDD" placeholder="Digite o nome do Tipo de Operação" size="extra-large" value={nameTypeOperation} onChange={setNameTypeOperation} icon={faLandmark} />
        </div>
        <div className="flex flex-col gap-5" >
          <Button color="#2E8B57" onClick={addTypeOperation} size="meddium" textColor="white" secondaryColor="#81C784">Cadastrar</Button>
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
