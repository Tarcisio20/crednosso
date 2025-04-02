"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getTypeOperationForId, update } from "@/app/service/type-operation";
import { validateField } from "@/app/utils/validateField";
import { typeOperationType } from "@/types/typeOperationType";
import {
  faLandmark,
  faReceipt,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TypeOperationEdit() {

     const { id } = useParams()
     const router = useRouter()

     const [typeOperation, setTypeOperation] = useState<typeOperationType>()
     const [idSystemTypeOperation, setIdSystemTypeOperation] = useState('')
     const [nameTypeOperation, setNameTypeOperation] = useState('')
     const [statusTypeOperation, setStatusTypeOperation] = useState(true)
     const [error, setError] = useState('')
     const [loading, setLoading] = useState(false)

  useEffect(() => {
     document.title = "Tipo Operação - Edit | CredNosso";
    getTypeOperation();
  }, [id]);

  const getTypeOperation = async () => {
    setError("");
    setLoading(false);
    setLoading(true);
    const getTypeOperationOne = await getTypeOperationForId(id as string);
    if (getTypeOperationOne.data.typeOperation.id) {
      setTypeOperation(getTypeOperationOne.data.typeOperation);
      setIdSystemTypeOperation(
        getTypeOperationOne.data.typeOperation.id_system
      );
      setNameTypeOperation(getTypeOperationOne.data.typeOperation.name);
      setStatusTypeOperation(getTypeOperationOne.data.typeOperation.status);
      setLoading(false);
      return;
    } else {
      setError("Nada a mostrar!");
      setLoading(false);
      return;
    }
  };

     const editTypeOperation = async () => {
          setError('')
          setLoading(false)
          setLoading(true)
          if( idSystemTypeOperation === '' ||  !validateField(nameTypeOperation)){
               setError("Prrencha todos os campos corretamente")
               setLoading(false)
               return
          }
          let data = {
               id_system : parseInt(idSystemTypeOperation),
               name : nameTypeOperation.toUpperCase(),
               status : statusTypeOperation 
          }
          const editedTypeOperation = await update(parseInt(id as string), data) 
          if(editedTypeOperation.data.typeOperation.id){
               setLoading(false)
               getTypeOperation()
               return
          }else {
               setError("Erro ao alterar");
               setLoading(false)
               return
          }
     }

     return (
          <Page>
               <TitlePages linkBack="/type-operation" icon={faPenToSquare} >Editar Tipo de Operação</TitlePages>
               <div className="flex flex-col gap-8 p-5 w-full">
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Id</label>
                         <Input color="#DDDD" placeholder="Digite o nome Id no sistema" size="extra-large" 
                         value={idSystemTypeOperation} onChange={(e)=>setIdSystemTypeOperation(e.target.value)} icon={faReceipt} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Nome</label>
                         <Input color="#DDDD" placeholder="Digite o nome do Tipo de Operação" size="extra-large"
                         value={nameTypeOperation} onChange={(e)=>setNameTypeOperation(e.target.value)} icon={faLandmark} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Status</label>
                         <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                              <select
                                   className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg uppercase"
                                   value={statusTypeOperation ? "true" : "false"}
                                   onChange={e => setStatusTypeOperation(e.target.value === "true")}
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
