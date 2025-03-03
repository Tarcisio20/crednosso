"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getStatusOrderForId, update } from "@/app/service/status-order";
import { getTypeOperationForId } from "@/app/service/type-operation";
import { validateField } from "@/app/utils/validateField";
import { statusOrderType } from "@/types/statusOrder";
import { typeOperationType } from "@/types/typeOperationType";
import {
     faLandmark,
     faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TypeOperationEdit() {

     const { id } = useParams()
     const router = useRouter()

     if (!id) {
          router.push('/status-order')
          return
     }

     const [statusOrder, setStatusOrder] = useState<statusOrderType>()
     const [nameStatusOrder, setNameStatusOrder] = useState('')
     const [statusStatusOrder, setStatusStatusOrder] = useState(true)

     const [error, setError] = useState('')
     const [loading, setLoading] = useState(false)

     useEffect(() => {
          getStatusOrder();
     }, [id]);

     const getStatusOrder = async () => {
          setError("");
          setLoading(false);
          setLoading(true);
          const getSOrder = await getStatusOrderForId(id as string);
          if(getSOrder.status === 300 || getSOrder.status === 400 || getSOrder.status === 500){
               setError("Erro na requisição!");
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
               setError("Nada a mostrar!");
               setLoading(false);
               return;
          }
     };

     const editTypeOperation = async () => {
          setError('')
          setLoading(false)
          setLoading(true)
          if (!validateField(nameStatusOrder)) {
               setError("Prrencha todos os campos corretamente")
               setLoading(false)
               return
          }
          let data = {
               name: nameStatusOrder.toUpperCase(),
               status: statusStatusOrder
          }
          const editedStatusOrder = await update(parseInt(id as string), data)
          if(editedStatusOrder.status === 300 || editedStatusOrder.status === 400 || editedStatusOrder.status === 500){
               setError("Erro de requisição");
               setLoading(false)
               return   
          }
          if (editedStatusOrder.data.statusOrder && editedStatusOrder.data.statusOrder?.id) {
               setLoading(false)
               getStatusOrder()
               return
          } else {
               setError("Erro ao alterar");
               setLoading(false)
               return
          }
     }

     return (
          <Page>
               <TitlePages linkBack="/type-operation" icon={faPenToSquare} >Editar Status do Pedido</TitlePages>
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
