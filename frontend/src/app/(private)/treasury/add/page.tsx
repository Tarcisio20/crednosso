"use client"

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/ui/Input";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {  faAdd, faLandmark, faVault, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


export default function TreasuryAdd() {

    const [idSystemTreasury, setIdSystemTreasury] = useState('')
    const [nameTreasury, setNameTreasury] = useState('')
    const [nameRedTreasury, setNameRedTreasury] = useState('')

  return (
    <Page>
        <TitlePages linkBack="/" icon={faAdd} >Adicionar Tesouraria</TitlePages>
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
           <div>
            <Button color="#2E8B57" onClick={()=>{}} size="meddium"  textColor="white" secondaryColor="#81C784">Cadastrar</Button>
           </div>
        </div>
    </Page>
  );
}
