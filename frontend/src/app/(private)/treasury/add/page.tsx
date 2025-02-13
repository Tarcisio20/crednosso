"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {  faAdd, faLandmark, faVault, faReceipt, faListOl } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


export default function TreasuryAdd() {

    const [idSystemTreasury, setIdSystemTreasury] = useState('')
    const [nameTreasury, setNameTreasury] = useState('')
    const [nameRedTreasury, setNameRedTreasury] = useState('')
    const [numContaTreasury, setNumContaTreasury] = useState('')

  return (
    <Page>
        <TitlePages linkBack="/treasury" icon={faAdd} >Adicionar Tesouraria</TitlePages>
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
           <div>
           <div className="flex flex-col gap-5 mb-4">
                <label className="uppercase leading-3 font-bold">Contatos (E-mail)</label>
               <textarea 
                    className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-30 text-lg"
                    placeholder="Todos os contatos da tesouraria"
               ></textarea>
          </div>
            <Button color="#2E8B57" onClick={()=>{}} size="meddium"  textColor="white" secondaryColor="#81C784">Cadastrar</Button>
           </div>
        </div>
    </Page>
  );
}
