"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {  faPenToSquare, faLandmark, faVault, faReceipt, faSquareCheck, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


export default function TreasuryEdit() {

    const [idSystemTreasury, setIdSystemTreasury] = useState('')
    const [nameTreasury, setNameTreasury] = useState('')
    const [nameRedTreasury, setNameRedTreasury] = useState('')
    const [numContaTreasury, setNumContaTreasury] = useState('')
    const [saldoTreasury, setSaldoTreasury] = useState('0')
    const [statusTreasury, setStatusTreasury] = useState('0')

  return (
    <Page>
        <TitlePages linkBack="/" icon={faPenToSquare} >Editar Tesouraria</TitlePages>
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
                <Input color="#DDDD" placeholder="Digite o nome reduzido da Transportadora" size="extra-large" value={numContaTreasury} onChange={setNumContaTreasury} icon={faVault} />
           </div>
           <div className="flex flex-col gap-5">
                <label className="uppercase leading-3 font-bold">Saldo</label>
                <div className="flex flex-row gap-1">
                    <Input readonly color="#DDDD" placeholder="R$ 00,00" size="extra-large" value={saldoTreasury} onChange={setSaldoTreasury} icon={faDollarSign} />
                    <Button color="" onClick={()=>{}} size="small" secondaryColor="" textColor="white">Add Saldo</Button>
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
            <Button color="#2E8B57" onClick={()=>{}} size="meddium"  textColor="white" secondaryColor="#81C784">Alterar</Button>
           </div>
        </div>
    </Page>
  );
}
