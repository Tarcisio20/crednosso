"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faSackDollar, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { treasuryType } from '@/types/treasuryType';
import { getAll } from '@/app/service/treasury';
import { generateValueTotal } from '@/app/utils/generateValueTotal';
import { generateStatus } from '@/app/utils/generateStatus';

export default function Treasury() {

    const router = useRouter()

    const [treasuries, setTreasuries] = useState<treasuryType[]>()
    const [error, setError] = useState('')

    useEffect(()=>{
         getAllTreasury()
    },[])

    const handleAdd = () => {
        router.push('/treasury/add')
    }

    const getAllTreasury =  async () => {
        const treasury =  await getAll()
        console.log(treasury.data.treasury.length)
       if(treasury.data.treasury.length > 0){
        setTreasuries(treasury.data.treasury)
        return
       }else{
        setError("Sem dados a mostrar")
       }
       return
    }

    return (
        <Page>
            <TitlePages linkBack="/" icon={faSackDollar} >Tesouraria</TitlePages>
            <div className="flex flex-col gap-4 p-5 w-full">
                <div className='flex flex-col gap-3 items-center justify-center mb-4'>
                    <Button color='#2E8B57' secondaryColor='#81C784' textColor='white' onClick={handleAdd} size='meddium'>Adicionar</Button>
                </div>
                <table className="flex-1 text-center p-3" width="100%">
                    <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl" >
                        <tr >
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Nome Reduzido</th>
                            <th>N Conta</th>
                            <th>GMCore</th>
                            <th>Saldo</th>
                            <th>Ativo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody className=" text-xl">
                        {treasuries?.map((item, key) => (
                             <tr key={key} className="h-12">
                                <td>{item.id_system}</td>
                                <td>{item.name}</td>
                                <td>{item.short_name}</td>
                                <td>{item.account_number}</td>
                                <td>{item.gmcore_number}</td>
                                <td>{generateValueTotal(item?.bills_10, item.bills_20, item.bills_50, item.bills_100)}</td>
                                <td>{generateStatus(item?.status)}</td>
                                <td className='flex justify-center items-center gap-4 h-12'>
                                    <Link href={`/treasury/edit/${item.id_system}`}>
                                        <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                                    </Link>
                                    <Link href={`/treasury/del/${item.id_system}`}>
                                        <FontAwesomeIcon icon={faTrash} size="1x" color="#BF6C6C" />
                                    </Link>
                                </td>
                             </tr>
                        ))}
                    </tbody>
                </table>
                {error &&
                    <div>
                        <p className='text-white'>Sem dados a mostrar</p>
                    </div>
                }
            </div>
        </Page>
    );
}
