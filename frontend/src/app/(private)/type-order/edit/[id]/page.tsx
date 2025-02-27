"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getTypeOrderForId, update } from "@/app/service/type-order";
import { validateField } from "@/app/utils/validateField";
import { typeOrderType } from "@/types/typeOrderType";
import { faAdd, faLandmark, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function TypeOrderEdit() {

     const { id } = useParams()
     const router = useRouter()

     const [typeOrders, setTypeOrders] = useState<typeOrderType>()
     const [idSystemTypeOrder, setIdSystemTypeOrder] = useState('')
     const [nameTypeOrder, setNameTypeOrder] = useState('')
     const [statusTypeOrder, setStatusTypeOrder] = useState('1')
     const [error, setError] = useState('')
     const [loading, setLoading] = useState(false)

     useEffect(() => {
          getTyepOrderById()
     }, [id])


     const getTyepOrderById = async () => {
          setError('')
          setLoading(false)
          setLoading(true)
          const tOrders = await getTypeOrderForId(id as string)
          if (tOrders.data.typeOrder.id) {
               setTypeOrders(tOrders.data.typeOrder)
               setIdSystemTypeOrder(tOrders.data.typeOrder.id_system)
               setNameTypeOrder(tOrders.data.typeOrder.name)
               setStatusTypeOrder(tOrders.data.typeOrder.status)
               setError('')
               setLoading(false)
               return
          } else {
               setError("Erro ao retornar")
               setLoading(false)
               return
          }
     }

     const editTypeOrder = async () => {
          setError('')
          setLoading(false)
          setLoading(true)
          if(idSystemTypeOrder === '' || !validateField(nameTypeOrder)){
               setError("Preencher todos os campos!")
               setLoading(false)
               return
          }
          let  data = {
               id_system : parseInt(idSystemTypeOrder),
               name : nameTypeOrder,
               status : statusTypeOrder === "0" ? false : true
          }

          const editedTypeOrder = await update(parseInt(id as string), data)
          if(editedTypeOrder.data.typeOrder.id){
               setError('')
               setLoading(false)
               getTyepOrderById()
               return
          }else{
               setError("Erro ao editar")
               setLoading(false)
               return
          }
     }

     return (
          <Page>
               <TitlePages linkBack="/type-operation" icon={faAdd} >Adicionar Tipo de Pedido</TitlePages>
               <div className="flex flex-col gap-8 p-5 w-full">
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Id</label>
                         <Input color="#DDDD" placeholder="Digite o nome Id no sistema" size="extra-large" value={idSystemTypeOrder} onChange={setIdSystemTypeOrder} icon={faReceipt} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Nome</label>
                         <Input color="#DDDD" placeholder="Digite o nome do Tipo de Pedido" size="extra-large" value={nameTypeOrder} onChange={setNameTypeOrder} icon={faLandmark} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Status</label>
                         <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                              <select
                                   className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                                   value={statusTypeOrder}
                                   onChange={e => setStatusTypeOrder(e.target.value)}
                              >
                                   <option
                                        className="uppercase bg-slate-700 text-white"
                                        value="1" >
                                        Ativo
                                   </option>
                                   <option
                                        className="uppercase bg-slate-700 text-white"
                                        value="0" >
                                        Inativo
                                   </option>
                              </select>
                         </div>
                    </div>
                    <div className="flex flex-col gap-5" >
                         <Button color="#2E8B57" onClick={editTypeOrder} size="meddium" textColor="white" secondaryColor="#81C784">Editar</Button>
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
