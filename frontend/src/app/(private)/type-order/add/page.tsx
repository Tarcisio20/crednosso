"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {  faAdd, faLandmark, faVault, faReceipt, faListOl } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


export default function TypeOrderAdd() {


     const [idSystemTypeOrder, setIdSystemTypeOrder] = useState('')
     const [nameTypeOrder, setNameTypeOrder] = useState('')

  return (
    <Page>
        <TitlePages linkBack="/type-order" icon={faAdd} >Adicionar Tipo de Pedido</TitlePages>
        <div className="flex flex-col gap-8 p-5 w-full">
          <div className="flex flex-col gap-5">
                <label className="uppercase leading-3 font-bold">Id</label>
                <Input color="#DDDD" placeholder="Digite o nome Id no sistema" size="extra-large" value={idSystemTypeOrder} onChange={setIdSystemTypeOrder} icon={faReceipt} />
           </div>
           <div className="flex flex-col gap-5">
                <label className="uppercase leading-3 font-bold">Nome</label>
                <Input color="#DDDD" placeholder="Digite o nome do Tipo de Pedido" size="extra-large" value={nameTypeOrder} onChange={setNameTypeOrder} icon={faLandmark} />
           </div>
           <div  className="flex flex-col gap-5" >
               <Button color="#2E8B57" onClick={()=>{}} size="meddium"  textColor="white" secondaryColor="#81C784">Cadastrar</Button>
           </div>
        </div>
    </Page>
  );
}
