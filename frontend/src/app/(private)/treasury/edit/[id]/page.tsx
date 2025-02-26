"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faPenToSquare, faLandmark, faVault, faReceipt, faDollarSign, faListOl } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { treasuryType } from "@/types/treasuryType";
import { addSaldoTreasury, getByIdSystem, update } from "@/app/service/treasury";
import { generateValueTotal } from "@/app/utils/generateValueTotal";
import { generateReal } from "@/app/utils/generateReal";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { validateField } from "@/app/utils/validateField";
import { Loading } from "@/app/components/ux/Loading";



export default function TreasuryEdit() {

     const { id } = useParams()
     const router = useRouter()

     const [treasury, setTreasury] = useState<treasuryType>()
     const [idSystemTreasury, setIdSystemTreasury] = useState('')
     const [nameTreasury, setNameTreasury] = useState('')
     const [nameRedTreasury, setNameRedTreasury] = useState('')
     const [numContaTreasury, setNumContaTreasury] = useState('')
     const [numGMCoreTreasury, setNumGMCoreTreasury] = useState('')
     const [saldoTreasury, setSaldoTreasury] = useState('0')
     const [statusTreasury, setStatusTreasury] = useState('0')
     const [error, setError] = useState('')
     const [loading, setLoading] = useState(false)

     const [modal, setModal] = useState(false)
     const [valueA, setValueA] = useState(0)
     const [valueB, setValueB] = useState(0)
     const [valueC, setValueC] = useState(0)
     const [valueD, setValueD] = useState(0)
     const [valueAddA, setValueAddA] = useState(0)
     const [valueAddB, setValueAddB] = useState(0)
     const [valueAddC, setValueAddC] = useState(0)
     const [valueAddD, setValueAddD] = useState(0)



     if (!id) {
          router.push('/treasury')
          return
     }

     useEffect(() => {
          getTreasuryByIdSystem()
     }, [id])

     const getTreasuryByIdSystem = async () => {
          const treasuryOne = await getByIdSystem(id as string)
          if (treasuryOne.data.treasury.id) {
               setTreasury(treasuryOne.data.treasury)
               setIdSystemTreasury(treasuryOne.data.treasury.id_system)
               setNameTreasury(treasuryOne.data.treasury.name)
               setNameRedTreasury(treasuryOne.data.treasury.short_name)
               setNumContaTreasury(treasuryOne.data.treasury.account_number)
               setNumGMCoreTreasury(treasuryOne.data.treasury.gmcore_number)
               setSaldoTreasury(
                    generateValueTotal(treasuryOne.data.treasury.bills_10, treasuryOne.data.treasury.bills_20,
                         treasuryOne.data.treasury.bills_50, treasuryOne.data.treasury.bills_100)
               )
               setStatusTreasury(treasuryOne.data.treasury.status)
               setValueA(treasuryOne.data.treasury.bills_10)
               setValueB(treasuryOne.data.treasury.bills_20)
               setValueC(treasuryOne.data.treasury.bills_50)
               setValueD(treasuryOne.data.treasury.bills_100)
          } else {
               setError("Item não econtrado")
               return
          }
     }

     const addSaldo = () => {
          setModal(true)
     }

     const closeModal = () => {
          setValueAddA(0)
          setValueAddB(0)
          setValueAddC(0)
          setValueAddD(0)
          setModal(false)
     }

     const saveSaldo = async () => {
          const data = {
               bills_10: valueAddA,
               bills_20: valueAddB,
               bills_50: valueAddC,
               bills_100: valueAddD,
          }
          const saldo = await addSaldoTreasury(parseInt(id as string), data)
          if (!saldo.data.treasury) {
               setError("Erro ao salvar")
          }
          closeModal()
          await getTreasuryByIdSystem()
     }

     const alterTreasury = async () => {
          setError('')
          setLoading(false)
          if (
               idSystemTreasury === "" || !validateField(nameTreasury) ||
               !validateField(nameRedTreasury) || numContaTreasury === ""
          ) {
               setError('Preencher todos (exceto Numero GMCore se não houver) os campos, e os campos Nome, Nome Reduzido e Numero da conta o minimo é  de 3 catacteres.')
               return
          }

          let data = {
               id_system: parseInt(idSystemTreasury),
               name: nameTreasury,
               short_name: nameRedTreasury,
               account_number: numContaTreasury,
               gmcore_number: numGMCoreTreasury,
               bills_10: valueA,
               bills_20: valueB,
               bills_50: valueC,
               bills_100: valueD,
               status: statusTreasury === "0" ? false : true
          }

          setLoading(true)
          const editTreasury = await update(parseInt(id as string) , data)
          setLoading(false)
          if(editTreasury.data.lenght > 0){
               await getTreasuryByIdSystem()
          }else{
               setError("Erro ao Editar")
          }
     }

     return (
          <Page>
               <TitlePages linkBack="/treasury" icon={faPenToSquare} >Editar Tesouraria</TitlePages>
               <div className="flex flex-col gap-8 p-5 w-full">
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Id</label>
                         <Input color="#DDDD" placeholder="Digite o nome Id no sistema" size="extra-large" value={idSystemTreasury} onChange={setIdSystemTreasury} icon={faReceipt} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Nome</label>
                         <Input color="#DDDD" placeholder="Digite o nome da Transportadora" size="extra-large" value={nameTreasury} onChange={setNameTreasury} icon={faLandmark} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Nome Reduzido</label>
                         <Input color="#DDDD" placeholder="Digite o nome reduzido da Transportadora" size="extra-large" value={nameRedTreasury} onChange={setNameRedTreasury} icon={faVault} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">N° Conta</label>
                         <Input color="#DDDD" placeholder="Digite o numero da conta da  Transportadora" size="extra-large" value={numContaTreasury} onChange={setNumContaTreasury} icon={faListOl} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">N° GMCore</label>
                         <Input color="#DDDD" placeholder="Digite o numero do GMCore da  Transportadora" size="extra-large" value={numGMCoreTreasury} onChange={setNumGMCoreTreasury} icon={faListOl} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Saldo</label>
                         <div className="flex flex-row gap-1">
                              <Input readonly color="#DDDD" placeholder="R$ 00,00" size="extra-large" value={saldoTreasury} onChange={setSaldoTreasury} icon={faDollarSign} />
                              <Button color="" onClick={addSaldo} size="small" secondaryColor="" textColor="white">Add Saldo</Button>
                         </div>
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Contatos</label>
                         <textarea
                              className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-30 text-lg"
                              placeholder="Todos os contatos da tesouraria"
                         ></textarea>
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Status</label>
                         <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                              <select
                                   className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                                   value={statusTreasury}
                                   onChange={e => setStatusTreasury(e.target.value)}
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
                    <div>
                         <Button color="#2E8B57" onClick={alterTreasury} size="meddium" textColor="white" secondaryColor="#81C784">Alterar</Button>
                    </div>
                    {modal &&
                         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                              <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
                                   <h2 className="text-xl font-bold mb-4 text-black text-center uppercase">Adicioanar saldo</h2>
                                   <p className="text-black text-center">{nameRedTreasury}</p>
                                   <p className="text-black text-xl text-center">Saldo Atual: {generateValueTotal(valueA, valueB, valueC, valueD)}</p>
                                   <div className="w-full  flex justify-center items-center mt-2 mb-2">
                                        <div className="w-full h-1 bg-zinc-600 rounded"></div>
                                   </div>
                                   <div className="mb-4 flex flex-col w-full h-full gap-4 text-black">

                                        <div className="w-full flex items-center justify-center gap-2 ">
                                             <div className="w-20 text-center">R$ 10,00</div>
                                             <input
                                                  className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                                                  value={valueAddA} onChange={
                                                       e => {
                                                            const inputValueA = e.target.value
                                                            setValueAddA(inputValueA === "" ? 0 : parseInt(inputValueA))
                                                       }
                                                  }
                                             />
                                             <div className="">{generateReal(valueAddA, 10)}</div>
                                        </div>

                                        <div className="w-full flex items-center justify-center gap-2 ">
                                             <div className="w-20 text-center">R$ 20,00</div>
                                             <input
                                                  className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                                                  value={valueAddB}
                                                  onChange={e => {
                                                       const inputValueB = e.target.value
                                                       setValueAddB(inputValueB === "" ? 0 : parseInt(inputValueB))
                                                  }}
                                             />
                                             <div>{generateReal(valueAddB, 20)}</div>
                                        </div>

                                        <div className="w-full flex items-center justify-center gap-2 ">
                                             <div className="w-20 text-center">R$ 50,00</div>
                                             <input
                                                  className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                                                  value={valueAddC}
                                                  onChange={
                                                       e => {
                                                            const inputValueC = e.target.value
                                                            setValueAddC(inputValueC === "" ? 0 : parseInt(inputValueC))
                                                       }
                                                  }
                                             />
                                             <div>{generateReal(valueAddD, 50)}</div>
                                        </div>


                                        <div className="w-full flex items-center justify-center gap-2 ">
                                             <div className="w-20 text-center">R$ 100,00</div>
                                             <input className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                                                  value={valueAddD}
                                                  onChange={
                                                       e => {
                                                            const inputValueD = e.target.value
                                                            setValueAddD(inputValueD === "" ? 0 : parseInt(inputValueD))
                                                       }
                                                  }
                                             />
                                             <div>{generateReal(valueAddD, 100)}</div>
                                        </div>


                                   </div>
                                   <div className="text-black flex gap-2 justify-center items-center mb-2">
                                        <div className="w-80 border-2 border-zinc-700 rounded-lg h-14 flex justify-center items-center">
                                             {generateRealTotal(valueAddA, valueAddB, valueAddC, valueAddD)}
                                        </div>
                                   </div>
                                   <div className="w-full  flex justify-center items-center mt-2 mb-2">
                                        <div className="w-full h-1 bg-zinc-600 rounded"></div>
                                   </div>
                                   <div className="flex justify-center gap-4">
                                        <button
                                             onClick={saveSaldo}
                                             className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >Salvar</button>
                                        <button
                                             onClick={closeModal}
                                             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                             Fechar Modal
                                        </button>
                                   </div>
                              </div>
                         </div>
                    }
                    {error &&
                         <div>
                              <div className="text-white">{error}</div>
                         </div>
                    }
                    {loading &&
                         <Loading />
                    }
               </div>
          </Page>
     );
}
