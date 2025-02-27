"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getAtmFronId, update } from "@/app/service/atm";
import { getAll } from "@/app/service/treasury";
import { validateField } from "@/app/utils/validateField";
import { atmType } from "@/types/atmType";
import { treasuryType } from "@/types/treasuryType";
import { faPenToSquare, faLandmark, faVault, faReceipt, faDollarSign, faListOl } from '@fortawesome/free-solid-svg-icons';
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function AtmEdit() {

     const { id } = useParams()
     const router = useRouter()

     useEffect(() => {
          getAtmById()
     }, [id])

     const [atms, setAtms] = useState<atmType>()
     const [treasuries, setTreasuries] = useState<treasuryType[]>()
     const [idSystemAtm, setIdSystemAtm] = useState('')
     const [nameAtm, setNameAtm] = useState('')
     const [nameRedAtm, setNameRedAtm] = useState('')
     const [idTreasutyAtm, setIdTreasutyAtm] = useState('')
     const [statusAtm, setStatusAtm] = useState('0')
     const [casseteAAtm, setCasseteAAtm] = useState('10')
     const [casseteBAtm, setCasseteBAtm] = useState('20')
     const [casseteCAtm, setCasseteCAtm] = useState('50')
     const [casseteDAtm, setCasseteDAtm] = useState('100')

     const [error, setError] = useState('')
     const [loading, setLoading] = useState(false)

     const getAtmById = async () => {
          setError('')
          setLoading(false)
          setLoading(true)
          const atmOne = await getAtmFronId(id as string)
          const t = await getAll()
          setLoading(false)
          if (atmOne.data.atm.id) {
               setAtms(atmOne.data.atm)
               setIdSystemAtm(atmOne.data.atm.id_system)
               setNameAtm(atmOne.data.atm.name)
               setNameRedAtm(atmOne.data.atm.short_name)
               setIdTreasutyAtm(atmOne.data.atm.id_treasury)
               setStatusAtm(atmOne.data.atm.Status)
               setIdTreasutyAtm(atmOne.data.atm.id_treasury)
               setCasseteAAtm(atmOne.data.atm.cassete_A)
               setCasseteBAtm(atmOne.data.atm.cassete_B)
               setCasseteCAtm(atmOne.data.atm.cassete_C)
               setCasseteDAtm(atmOne.data.atm.cassete_D)
               setTreasuries(t.data.treasury)
               return
          } else {
               setError('Nada a mostrar')
               return
          }
     }

     const updateAtm = async () => {
          setError('')
          setLoading(false)
          if (idSystemAtm === '' || !validateField(nameAtm) || !validateField(nameRedAtm) || idTreasutyAtm === '0') {
               console.log("Dentro do erro")
               setError('Prencher todos os campos')
               return
          }

          let data = {
               id_system: parseInt(idSystemAtm),
               name: nameAtm,
               short_name: nameRedAtm,
               id_treasury: parseInt(idTreasutyAtm),
               status : statusAtm === "0" ? false : true,
               cassete_A: parseInt(casseteAAtm),
               cassete_B: parseInt(casseteBAtm),
               cassete_C: parseInt(casseteCAtm),
               cassete_D: parseInt(casseteDAtm),
          }
          setLoading(true)
          const editedAtm = await update(parseInt(id as string), data)
          setLoading(false)
     }


     return (
          <Page>
               <TitlePages linkBack="/atm" icon={faPenToSquare} >Editar Atm</TitlePages>
               <div className="flex flex-col gap-8 p-5 w-full">
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Id</label>
                         <Input color="#DDDD" placeholder="Digite o Id no sistema" size="extra-large" value={idSystemAtm} onChange={setIdSystemAtm} icon={faReceipt} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Nome</label>
                         <Input color="#DDDD" placeholder="Digite o nome do Terminal" size="extra-large" value={nameAtm} onChange={setNameAtm} icon={faLandmark} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Nome Reduzido</label>
                         <Input color="#DDDD" placeholder="Digite o nome reduzido Terminal" size="extra-large" value={nameRedAtm} onChange={setNameRedAtm} icon={faVault} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Transportadora</label>
                         <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                              <select
                                   className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                                   value={idTreasutyAtm}
                                   onChange={e => setIdTreasutyAtm(e.target.value)}
                              >
                                   {treasuries && treasuries?.map((item, index) => (
                                        <option
                                             className="uppercase bg-slate-700 text-white"
                                             value={item.id} key={index} >
                                             {item.name}
                                        </option>
                                   ))}
                              </select>
                         </div>
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Status</label>
                         <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                              <select
                                   className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                                   value={statusAtm}
                                   onChange={e => setStatusAtm(e.target.value)}
                              >
                                   <option
                                        className="uppercase bg-slate-700 text-white"
                                        value="0" >
                                        Ativo
                                   </option>
                                   <option
                                        className="uppercase bg-slate-700 text-white"
                                        value="1" >
                                        Inativo
                                   </option>
                              </select>
                         </div>
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Configuração de cassetes</label>
                         <div className="flex flex-col gap-5">
                              <div className="flex flex-col gap-2">
                                   <label>CASSETE A</label>
                                   <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                                        <select
                                             className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                                             value={casseteAAtm}
                                             onChange={e => setCasseteAAtm(e.target.value)}
                                        >
                                             <option className="uppercase bg-slate-700 text-white" value="10" selected >R$ 10,00</option>
                                             <option className="uppercase bg-slate-700 text-white" value="20" >R$ 20,00</option>
                                             <option className="uppercase bg-slate-700 text-white" value="50" >R$ 50,00</option>
                                             <option className="uppercase bg-slate-700 text-white" value="100" >R$ 100,00</option>
                                        </select>
                                   </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                   <label>CASSETE B</label>
                                   <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                                        <select
                                             className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                                             value={casseteBAtm}
                                             onChange={e => setCasseteBAtm(e.target.value)}
                                        >
                                             <option className="uppercase bg-slate-700 text-white" value="10"  >R$ 10,00</option>
                                             <option className="uppercase bg-slate-700 text-white" value="20" selected >R$ 20,00</option>
                                             <option className="uppercase bg-slate-700 text-white" value="50"  >R$ 50,00</option>
                                             <option className="uppercase bg-slate-700 text-white" value="100"  >R$ 100,00</option>
                                        </select>
                                   </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                   <label>CASSETE C</label>
                                   <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                                        <select
                                             className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                                             value={casseteCAtm}
                                             onChange={e => setCasseteCAtm(e.target.value)}
                                        >
                                             <option className="uppercase bg-slate-700 text-white" value="10"  >R$ 10,00</option>
                                             <option className="uppercase bg-slate-700 text-white" value="20"  >R$ 20,00</option>
                                             <option className="uppercase bg-slate-700 text-white" value="50" selected >R$ 50,00</option>
                                             <option className="uppercase bg-slate-700 text-white" value="100"  >R$ 100,00</option>
                                        </select>
                                   </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                   <label>CASSETE D</label>
                                   <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                                        <select
                                             className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                                             value={casseteDAtm}
                                             onChange={e => setCasseteDAtm(e.target.value)}
                                        >
                                             <option className="uppercase bg-slate-700 text-white" value="10" >R$ 10,00</option>
                                             <option className="uppercase bg-slate-700 text-white" value="20" >R$ 20,00</option>
                                             <option className="uppercase bg-slate-700 text-white" value="50" >R$ 50,00</option>
                                             <option className="uppercase bg-slate-700 text-white" value="100" selected >R$ 100,00</option>
                                        </select>
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div>
                         <Button color="#2E8B57" onClick={updateAtm} size="meddium" textColor="white" secondaryColor="#81C784">Alterar</Button>
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
