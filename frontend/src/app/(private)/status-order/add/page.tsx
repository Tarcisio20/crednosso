"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/status-order";
import { validateField } from "@/app/utils/validateField";
import {
  faAdd,
  faLandmark,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TypeOperationAdd() {

  useEffect(() => {
    document.title = "Status Pedido - Add | CredNosso";
  }, []);

  const router = useRouter();

  const [nameStatusOrder, setNameStatusOrder] = useState("");
  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false);

  const addStatusOrder = async () => {
    setLoading(true);
    if (!validateField(nameStatusOrder)) {
      setLoading(false);
      toast.error('Para continuar, preencha todos os campos corretamente!');
      return;
    }
    const data = {
      name: nameStatusOrder.toUpperCase(),
    };
    const newStatusOrder = await add(data);
    if (newStatusOrder.status === 300 || newStatusOrder.status === 400 || newStatusOrder.status === 500) {
      setLoading(false);
      toast.error('Erro de requisição, tente novamente!');
      return;
    }
    if (newStatusOrder.data.statusOrder && newStatusOrder.data.statusOrder?.id) {
      setNameStatusOrder("")
      setLoading(false);
      toast.success('Status do Pedido salvo com sucesso!');
      return;
    } else {
      setLoading(false);
      toast.error('Erro ao salvar, tente novamente!');
      return;
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/status-order" icon={faAdd}>
        Adicionar Status de Pedido
      </TitlePages>
      <div className="flex flex-col gap-8 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input color="#DDDD" placeholder="Digite o nome do Status do Pedido" size="extra-large"
            value={nameStatusOrder} onChange={(e) => setNameStatusOrder(e.target.value)} icon={faLandmark} />
        </div>
        <div className="flex flex-col gap-5v w-[200px]">
          <Button
            color="#2E8B57"
            onClick={addStatusOrder}
            size="medium"
            textColor="white"
            variant={"primary"} 
          >
            Cadastrar
          </Button>
        </div>
        {error.messege && (
          <Messeger type={error.type} title={error.title} messege={error.messege} />
        )}
        {loading && <Loading />}
      </div>
    </Page>
  );
}
