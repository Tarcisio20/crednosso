"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  faThumbTack,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { typeOperationType } from "@/types/typeOperationType";
import { Loading } from "@/app/components/ux/Loading";
import { getAll } from "@/app/service/type-order";
import { generateStatus } from "@/app/utils/generateStatus";

export default function TypeOrder() {
  const router = useRouter();

  const [typeOrders, settypeOrders] = useState<typeOperationType[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    typeOrder();
  }, []);

  const handleAdd = () => {
    router.push("/type-order/add");
    return;
  };

  const typeOrder = async () => {
    setError("");
    setLoading(false);
    setLoading(true);
    const tOrders = await getAll();
    if (tOrders.data.typeOrder[0]?.id) {
      settypeOrders(tOrders.data.typeOrder);
      setError("");
      setLoading(false);
      return;
    } else {
      setError("Sem dados para mostrar!");
      setLoading(false);
      return;
    }
  };
  return (
    <Page>
      <TitlePages linkBack="/" icon={faThumbTack}>
        Tipo de Pedido
      </TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-3 items-center justify-center mb-4">
          <Button
            color="#2E8B57"
            secondaryColor="#81C784"
            textColor="white"
            onClick={handleAdd}
            size="meddium"
          >
            Adicionar
          </Button>
        </div>
        <table className="flex-1 text-center p-3" width="100%">
          <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className=" text-xl">
            {typeOrders &&
              typeOrders.map((item, index) => (
                <tr className="h-12" key={index}>
                  <td>{item.id_system}</td>
                  <td>{item.name}</td>
                  <td>{generateStatus(item?.status as Boolean)}</td>
                  <td className="flex justify-center items-center gap-4 h-12">
                    <Link href={`/type-order/edit/${item.id}`}>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        size="1x"
                        color="#6C8EBF"
                      />
                    </Link>
                    <Link href={`/type-order/del/${item.id}`}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="1x"
                        color="#BF6C6C"
                      />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {error && <div className="text-white">{error}</div>}
        {loading && <Loading />}
      </div>
    </Page>
  );
}
