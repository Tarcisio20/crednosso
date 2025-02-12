"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faBoxOpen, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Atm() {

    const router = useRouter()

    const handleAdd = () => {
        router.push('/atm/add')
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
                    <tr className="h-12">
                        <td>1</td>
                        <td>Nome</td>
                        <td>Nome Red.</td>
                        <td>Tranportadora 1</td>
                        <td>Padrão</td>
                        <td>Ativo</td>
                        <td className='flex justify-center items-center gap-4 h-12'>
                            <Link href={`/atm/edit/1`}>
                                <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                            </Link>
                            <Link href={`/atm/del/1`}>
                                <FontAwesomeIcon icon={faTrash} size="1x" color="#BF6C6C" />
                            </Link>
                        </td>
                    </tr>
                    <tr className="bg-zinc-700 h-12">
                        <td>2</td>
                        <td>Nome 1</td>
                        <td>Nome Red. 1</td>
                        <td>Tranportadora 2</td>
                        <td>Cpnfig. CD</td>
                        <td>Inativo</td>
                        <td className='flex justify-center items-center gap-4 h-12'>
                            <Link href={`/atm/edit/2`}>
                                <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                            </Link>
                            <Link href={`/atm/del/2`}>
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
