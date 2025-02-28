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

export default function TypeSupply() {

    const router = useRouter()

    const [treasuries, setTreasuries] = useState<treasuryType[]>()
    const [error, setError] = useState('')

    useEffect(()=>{
         getAllTreasury()
    },[])

    const handleAdd = () => {
        router.push('/type-supply/add')
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
            <TitlePages linkBack="/" icon={faSackDollar} >Tipo de Abastecimento</TitlePages>
            <div className="flex flex-col gap-4 p-5 w-full">
                <div className='flex flex-col gap-3 items-center justify-center mb-4'>
                    <Button color='#2E8B57' secondaryColor='#81C784' textColor='white' onClick={handleAdd} size='meddium'>Adicionar</Button>
                </div>
                <table className="flex-1 text-center p-3" width="100%">
                    <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl" >
                        <tr >
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody className=" text-xl">
                        {treasuries?.map((item, key) => (
                             <tr key={key} className="h-12">
                                <td>1</td>
                                <td>Nome 1</td>
                                <td>Ativo</td>
                                <td className='flex justify-center items-center gap-4 h-12'>
                                    <Link href={`/type-supply/edit/${item.id}`}>
                                        <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                                    </Link>
                                    <Link href={`/type-supply/del/${item.id}`}>
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
