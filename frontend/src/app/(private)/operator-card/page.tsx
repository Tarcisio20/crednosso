"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faCreditCard, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OperatorCard() {

    const router = useRouter()

    const [treasury, setTreasury] = useState('')

    const handleAdd = () => {
        router.push('/operator-card/add')
    }
  return (
    <Page>
        <TitlePages linkBack="/" icon={faCreditCard} >Cartão Operador</TitlePages>
        <div className="flex flex-col gap-4 p-5 w-full">
            <div className='flex flex-col gap-3 items-center justify-center mb-4'>
                <Button color='#2E8B57' secondaryColor='#81C784' textColor='white' onClick={handleAdd} size='meddium'>Adicionar</Button>
            </div>

            <div className='flex flex-row gap-2'>
                    <div className='flex flex-col gap-2'>
                        <label className="uppercase leading-3 font-bold">Transportadora</label>
                        <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                            <select 
                                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg" 
                                value={treasury} 
                                onChange={e => setTreasury(e.target.value)}
                            >

                                <option value="0"></option>
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
                <div className='flex flex-col justify-end'>
                        <Button color='#1E90FF ' onClick={()=>{}} secondaryColor='#87CEFA ' size='small' textColor='white' >Pesquisar</Button>
                </div>
               </div>

            <table className="flex-1 text-center p-3" width="100%">
                <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl" >
                    <tr >
                        <th>ID</th>
                        <th>Transportadora</th>
                        <th>N° Cartão</th>
                        <th>Ativo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody className=" text-xl">
                    <tr className="h-12">
                        <td>1</td>
                        <td>Transportadora</td>
                        <td>0000 0000 0000 0000</td>
                        <td>Ativo</td>
                        <td className='flex justify-center items-center gap-4 h-12'>
                            <Link href={`/operator-card/edit/1`}>
                                <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                            </Link>
                            <Link href={`/operator-card/del/1`}>
                                <FontAwesomeIcon icon={faTrash} size="1x" color="#BF6C6C" />
                            </Link>
                        </td>
                    </tr>
                    <tr className="bg-zinc-700 h-12">
                        <td>2</td>
                        <td>Transportadora</td>
                        <td>0000 0000 0000 0000</td>
                        <td>Inativo</td>
                        <td className='flex justify-center items-center gap-4 h-12'>
                            <Link href={`/operator-card/edit/2`}>
                                <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                            </Link>
                            <Link href={`/operator-card/del/2`}>
                                <FontAwesomeIcon icon={faTrash} size="1x" color="#BF6C6C" />
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Page>
  );
}
