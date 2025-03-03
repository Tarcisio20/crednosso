"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faPenToSquare, faTrash, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateStatus } from "@/app/utils/generateStatus";
import { typeSupplyType } from "@/types/typeSupplyType";
import { Loading } from "@/app/components/ux/Loading";
import { getAll } from "@/app/service/status-order";
import { statusOrderType } from "@/types/statusOrder";

export default function TypeSupply() {

  const router = useRouter()

  const [statusOrders, setStatusOrders] = useState<statusOrderType[]>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    getAllStatusOrder();
  }, []);

  const handleAdd = () => {
    router.push('/status-order/add')
    return
  }


  const getAllStatusOrder = async () => {
    setError("");
    setLoading(false);
    setLoading(true);
    const statusOrder = await getAll();
    if(statusOrder.status === 300 || statusOrder.status === 400 || statusOrder.status === 500){
      setError("Erro de requisição");
      setLoading(false);
      return;
    }
    if (statusOrder.data.statusOrder && statusOrder.data.statusOrder[0]?.id) {
      setStatusOrders(statusOrder.data.statusOrder);
      setLoading(false);
      return;
    } else {
      setError("Sem dados a mostrar");
      setLoading(false);
      return;
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/" icon={faWandMagicSparkles} >Status do Pedido</TitlePages>
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
            {statusOrders && statusOrders?.map((item, key) => (
              <tr key={key} className="h-12">
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{generateStatus(item.status as Boolean)}</td>
                <td className='flex justify-center items-center gap-4 h-12'>
                  <Link href={`/status-order/edit/${item.id}`}>
                    <FontAwesomeIcon icon={faPenToSquare} size="1x" color="#6C8EBF" />
                  </Link>
                  <Link href={`/status-order/del/${item.id}`}>
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
        {loading &&
          <Loading />
        }
      </div>
    </Page>
  );
 
}