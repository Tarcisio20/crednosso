"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  faGears,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { typeOperationType } from "@/types/typeOperationType";
import { Loading } from "@/app/components/ux/Loading";
import { getAll } from "@/app/service/type-operation";
import { generateStatus } from "@/app/utils/generateStatus";

export default function TypeOperation() {
  const router = useRouter();

  const [typeOperations, setTypeOperations] = useState<typeOperationType[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllTypeOperations();
  }, []);

    const getAllTypeOperations = async () => {
        setError('')
        setLoading(true)
        const tOperations = await getAll()
        if(tOperations.data.typeOperation && tOperations.data.typeOperation[0]?.id){
            setTypeOperations(tOperations.data.typeOperation)
            setLoading(false)
            return
        }else{
            setError('Nada a mostrar')
            setLoading(false)
            return
        }
       
    }

    const handleAdd = () => {
        router.push('/type-operation/add')
        return
    }
    return (
        <Page>
            <TitlePages linkBack="/" icon={faGears} >Tipo de Operação</TitlePages>
            <div className="flex flex-col gap-4 p-5 w-full">
                <div className='flex flex-col gap-3 items-center justify-center mb-4'>
                    <Button color='#2E8B57' secondaryColor='#81C784' textColor='white' onClick={handleAdd} size='meddium'>Adicionar</Button>
                </div>
                <table className="flex-1 text-center p-3" width="100%">
                    <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl" >
                        <tr >
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Ativo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody className=" text-xl">
                        {typeOperations && typeOperations?.map((item, index) => (
                             <tr className="h-12" key={index}>
                                <td>{item.id_system}</td>
                                <td>{item.name}</td>
                                <td>{generateStatus(item.status as Boolean)}</td>
                                <td className='flex justify-center items-center gap-4 h-12'>
                                <Link href={`/type-operation/edit/${item.id}`}>
                                    <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                                </Link>
                                <Link href={`/type-operation/del/${item.id}`}>
                                    <FontAwesomeIcon icon={faTrash} size="1x" color="#BF6C6C" />
                                </Link>
                            </td>
                             </tr>
                        ))}
                    </tbody>
                </table>
                {error &&
                    <div className="text-white">
                        {error}
                    </div>
                }
                {loading &&
                    <Loading />
                }
            </div>
        </Page>
    );
}
