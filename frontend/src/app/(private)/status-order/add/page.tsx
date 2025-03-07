"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/status-order";
import { validateField } from "@/app/utils/validateField";
import {
  faAdd,
  faLandmark,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TypeOperationAdd() {
  const router = useRouter();

  const [nameStatusOrder, setNameStatusOrder] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addStatusOrder = async () => {
    setError("");
    setLoading(false);
    setLoading(true);
    if (!validateField(nameStatusOrder) ) {
      setError("Favor preencher todos os campos corretamente!");
      setLoading(false);
      return;
    }
    let data = {
      name: nameStatusOrder.toUpperCase(),
    };
    const newStatusOrder = await add(data);
    if(newStatusOrder.status === 300 || newStatusOrder.status === 400 || newStatusOrder.status === 500){
      setLoading(false);
      setError("Erro de requisição!");
      return;
    }
    if (newStatusOrder.data.statusOrder && newStatusOrder.data.statusOrder?.id) {
      setLoading(false);
      router.push("/status-order");
      return;
    } else {
      setLoading(false);
      setError("Erro ao salvar!");
      return;
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/type-operation" icon={faAdd}>
        Adicionar Status de Pedido
      </TitlePages>
      <div className="flex flex-col gap-8 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input color="#DDDD" placeholder="Digite o nome do Status do Pedido" size="extra-large" 
          value={nameStatusOrder} onChange={(e)=>setNameStatusOrder(e.target.value)} icon={faLandmark} />
        </div>
        <div className="flex flex-col gap-5">
          <Button
            color="#2E8B57"
            onClick={addStatusOrder}
            size="meddium"
            textColor="white"
            secondaryColor="#81C784"
          >
            Cadastrar
          </Button>
        </div>
        {error && <div className="text-white">{error}</div>}
        {loading && <Loading />}
      </div>
    </Page>
  );
}
