"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {  faLandmark, faReceipt, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


export default function TypeOperationEdit() {

    const [idSystemTypeOperation, setIdSystemTypeOperation] = useState('')
    const [nameTypeOperation, setNameTypeOperation] = useState('')
    const [statusTypeOperation, setStatusTypeOperation] = useState('')

  return (
    <Page>
        <TitlePages linkBack="/type-operation" icon={faPenToSquare} >Editar Tipo de Operação</TitlePages>
        <div className="flex flex-col gap-8 p-5 w-full">
          <div className="flex flex-col gap-5">
                <label className="uppercase leading-3 font-bold">Id</label>
                <Input color="#DDDD" placeholder="Digite o nome Id no sistema" size="extra-large" value={idSystemTypeOperation} onChange={setIdSystemTypeOperation} icon={faReceipt} />
           </div>
           <div className="flex flex-col gap-5">
                <label className="uppercase leading-3 font-bold">Nome</label>
                <Input color="#DDDD" placeholder="Digite o nome do Tipo de Operação" size="extra-large" value={nameTypeOperation} onChange={setNameTypeOperation} icon={faLandmark} />
           </div>
           <div className="flex flex-col gap-5">
               <label className="uppercase leading-3 font-bold">Status</label>
               <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                    <select 
                         className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg" 
                         value={statusTypeOperation} 
                         onChange={e => setStatusTypeOperation(e.target.value)}
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
           <div  className="flex flex-col gap-5" >
               <Button color="#2E8B57" onClick={()=>{}} size="meddium"  textColor="white" secondaryColor="#81C784">Cadastrar</Button>
           </div>
        </div>
    </Page>
  );
}
