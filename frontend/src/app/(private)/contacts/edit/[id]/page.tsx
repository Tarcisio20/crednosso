"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faIdCardClip, faMobile, faIdBadge, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/app/components/ui/Input';

export default function ContactsEdit() {

    const router = useRouter()

    const [treasury, setTreasury] = useState('')
    const [nameContact, setNameContact] = useState('')
    const [phoneContact, setPhoneContact] = useState('')
    const [emailContact, setEmailContact] = useState('')
    const [statusContact, setStatusContact] = useState('')

    const handleAdd = () => {
        router.push('/contacts/add')
    }
  return (
    <Page>
        <TitlePages linkBack="/contacts" icon={faIdCardClip} >Editar Contato</TitlePages>
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
                <label className="uppercase leading-3 font-bold">Nome</label>
               <Input color="#DDDD" placeholder="Digite o nome do Contato" size="extra-large" value={nameContact} onChange={setNameContact} icon={faIdBadge} />
            </div>
            <div className="flex flex-col gap-5">
                <label className="uppercase leading-3 font-bold">Telefone</label>
               <Input color="#DDDD" placeholder="Digite o telefone do Contato" size="extra-large" value={phoneContact} onChange={setPhoneContact} icon={faMobile} />
            </div>
            <div className="flex flex-col gap-5">
                <label className="uppercase leading-3 font-bold">E-mail</label>
               <Input color="#DDDD" placeholder="Digite o telefone do Contato" size="extra-large" value={emailContact} onChange={setEmailContact} icon={faEnvelope} />
            </div>
            <div className="flex flex-col gap-5">
               <label className="uppercase leading-3 font-bold">Status</label>
               <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                    <select 
                         className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg" 
                         value={statusContact} 
                         onChange={e => setStatusContact(e.target.value)}
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
                <Button color="#2E8B57" onClick={()=>{}} size="meddium"  textColor="white" secondaryColor="#81C784">Editar</Button>
           </div>
        </div>
    </Page>
  );
}
