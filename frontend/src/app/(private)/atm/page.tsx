"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faBoxOpen, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { atmType } from '@/types/atmType';
import { getAll } from '@/app/service/atm';
import { getAll as gtTreasury } from '@/app/service/treasury';
import { Loading } from '@/app/components/ux/Loading';
import { treasuryType } from '@/types/treasuryType';
import { returnNameTreasury } from '@/app/utils/returnNameTreasury';
import { returnDefault } from '@/app/utils/returnDefault';

export default function Atm() {

    const router = useRouter()

    useEffect(() => {
        getAllAtms()
    }, [])

    const [atms, setAtms] = useState<atmType[]>()
    const [treasuries, setTreasuries] = useState<treasuryType[]>()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleAdd = () => {
        router.push('/atm/add')
    }


    const getAllAtms = async () => {
        setError('')
        setLoading(false)
        setLoading(true)
        const allAtms = await getAll()
        const allTreasury= await gtTreasury()
        setLoading(false)
        if (allAtms.data.atm[0].id) {
            setAtms(allAtms.data.atm)
            setTreasuries(allTreasury.data.treasury)
            
        } else {
            setError('Sem dados a carregar!')
            
        }
    }

    return (
        <Page>
            <TitlePages linkBack="/" icon={faBoxOpen} >Atm</TitlePages>
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
                            <th>Transportadora</th>
                            <th>Config Cassetes</th>
                            <th>Ativo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody className=" text-xl">
                        {atms && atms.map((item, index) => (
                             <tr className="h-12" key={index}>
                                <td>{item.id_system}</td>
                                <td>{item.name}</td>
                                <td>{item.short_name}</td>
                                <td>{ returnNameTreasury(treasuries, item.id_treasury)}</td>
                                <td>{returnDefault({ cassete_A : item.cassete_A, cassete_B : item.cassete_B, cassete_C : item.cassete_C, cassete_D : item.cassete_D })}</td>
                                <td>Ativo</td>
                                <td className='flex justify-center items-center gap-4 h-12'>
                                <Link href={`/atm/edit/${item.id}`}>
                                    <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                                </Link>
                                <Link href={`/atm/del/${item.id}`}>
                                    <FontAwesomeIcon icon={faTrash} size="1x" color="#BF6C6C" />
                                </Link>
                            </td>
                             </tr>
                        ))}
                    </tbody>
                </table>
                {error &&
                    <div>
                        <p className="text-white">{error}</p>
                    </div>
                }
                {loading &&
                    <Loading />
                }
            </div>
        </Page>
    );
}
