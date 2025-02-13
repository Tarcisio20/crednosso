"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {  faAdd, faLandmark, faVault, faReceipt, faListOl } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


export default function AtmAdd() {

    const [idSystemAtm, setIdSystemAtm] = useState('')
    const [nameAtm, setNameAtm] = useState('')
    const [nameRedAtm, setNameRedAtm] = useState('')
    const [treasuryTreasury, setTreasuryTreasury] = useState('')
    const [casseteAAtm, setCasseteAAtm] = useState('10')
    const [casseteBAtm, setCasseteBAtm] = useState('20')
    const [casseteCAtm, setCasseteCAtm] = useState('50')
    const [casseteDAtm, setCasseteDAtm] = useState('100')

  return (
    <Page>
          <TitlePages linkBack="/atm" icon={faAdd} >Adicionar Atm</TitlePages>
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
                    <Input color="#DDDD" placeholder="Digite o nome reduzido do Terminal" size="extra-large" value={nameRedAtm} onChange={setNameRedAtm} icon={faVault} />
               </div>
               <div className="flex flex-col gap-5">
                    <label className="uppercase leading-3 font-bold">Transportadora</label>
                    <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                         <select 
                              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg" 
                              value={treasuryTreasury} 
                              onChange={e => setTreasuryTreasury(e.target.value)}
                         >
                              <option 
                                   className="uppercase bg-slate-700 text-white"
                                   value="1" >
                                        Transportadora 1
                              </option>
                              <option 
                                   className="uppercase bg-slate-700 text-white"
                                   value="2" >
                                        Transportadora 2
                              </option>
                              <option 
                                   className="uppercase bg-slate-700 text-white"
                                   value="3" >
                                        Transportadora 3
                              </option>
                              <option 
                                   className="uppercase bg-slate-700 text-white"
                                   value="4" >
                                        Transportadora 4
                              </option>
                              <option 
                                   className="uppercase bg-slate-700 text-white"
                                   value="5" >
                                        Transportadora 5
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
                                        <option   className="uppercase bg-slate-700 text-white" value="10"  >R$ 10,00</option>
                                        <option   className="uppercase bg-slate-700 text-white" value="20" >R$ 20,00</option>
                                        <option   className="uppercase bg-slate-700 text-white" value="50" >R$ 50,00</option>
                                        <option   className="uppercase bg-slate-700 text-white" value="100" >R$ 100,00</option>
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
                                        <option   className="uppercase bg-slate-700 text-white" value="10"  >R$ 10,00</option>
                                        <option   className="uppercase bg-slate-700 text-white" value="20"  >R$ 20,00</option>
                                        <option   className="uppercase bg-slate-700 text-white" value="50"  >R$ 50,00</option>
                                        <option   className="uppercase bg-slate-700 text-white" value="100"  >R$ 100,00</option>
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
                                        <option   className="uppercase bg-slate-700 text-white" value="10"  >R$ 10,00</option>
                                        <option   className="uppercase bg-slate-700 text-white" value="20"  >R$ 20,00</option>
                                        <option   className="uppercase bg-slate-700 text-white" value="50"   >R$ 50,00</option>
                                        <option   className="uppercase bg-slate-700 text-white" value="100"  >R$ 100,00</option>
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
                                        <option   className="uppercase bg-slate-700 text-white"  value="10" >R$ 10,00</option>
                                        <option   className="uppercase bg-slate-700 text-white"  value="20" >R$ 20,00</option>
                                        <option   className="uppercase bg-slate-700 text-white"  value="50" >R$ 50,00</option>
                                        <option   className="uppercase bg-slate-700 text-white"  value="100"  >R$ 100,00</option>
                                   </select>
                              </div>
                         </div>
                    </div>
               </div>
               <div className="flex flex-col gap-5">
                    <Button color="#2E8B57" onClick={()=>{}} size="meddium"  textColor="white" secondaryColor="#81C784">Cadastrar</Button>
               </div>
          </div>
    </Page>
  );
}
