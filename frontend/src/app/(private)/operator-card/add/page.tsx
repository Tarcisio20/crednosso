"use client"

import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faIdBadge, faAdd } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/app/components/ui/Input';

export default function OperationCardAdd() {

    const router = useRouter()

    const [treasury, setTreasury] = useState('')
    const [numOperatorCard, setNumOperatorCard] = useState('')

    const handleAdd = () => {
        router.push('/contacts/add')
    }
  return (
    <Page>
        <TitlePages linkBack="/operator-card" icon={faAdd} >Adicionar Cartão Operador</TitlePages>
        <div className="flex flex-col gap-4 p-5 w-full">
            <div className="flex flex-col gap-5">
               <label className="uppercase leading-3 font-bold">Transportadora</label>
               <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                    <select 
                         className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg" 
                         value={treasury} 
                         onChange={e => setTreasury(e.target.value)}
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
                <label className="uppercase leading-3 font-bold">Número Cartão</label>
               <Input color="#DDDD" placeholder="Digite o número do cartão" size="extra-large" value={numOperatorCard} onChange={setNumOperatorCard} icon={faIdBadge} />
            </div>
            <div>
                <Button color="#2E8B57" onClick={()=>{}} size="meddium"  textColor="white" secondaryColor="#81C784">Adicionar</Button>
           </div>
        </div>
    </Page>
  );
}
