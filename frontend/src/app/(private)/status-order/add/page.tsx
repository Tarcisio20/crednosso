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

export default function TypeOperationAdd() {

    useEffect(() => {
      document.title = "Status Pedido - Add | CredNosso";
    }, []);

  const router = useRouter();

  const [nameStatusOrder, setNameStatusOrder] = useState("");
  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false);

  const addStatusOrder = async () => {
    setError({ type: '', title: '', messege: '' });
    setLoading(false);
    setLoading(true);
    if (!validateField(nameStatusOrder)) {
      setError({ type: 'error', title: 'Error', messege: 'Para continuar, preencha todos os campos corretamente!' });
      setLoading(false);
      return;
    }
    const data = {
      name: nameStatusOrder.toUpperCase(),
    };
    const newStatusOrder = await add(data);
    if (newStatusOrder.status === 300 || newStatusOrder.status === 400 || newStatusOrder.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro de requisição, tente novamente!' });
      setLoading(false);
      return;
    }
    if (newStatusOrder.data.statusOrder && newStatusOrder.data.statusOrder?.id) {
      setError({ type: 'success', title: 'Success', messege: 'Status do Pedido salvo com sucesso!' });
      setLoading(false);
      return;
    } else {
      setLoading(false);
      setError({ type: 'error', title: 'Error', messege: 'Erro ao salvar, tente novamente!' });
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
        {error.messege && (
          <Messeger type={error.type} title={error.title} messege={error.messege} />
        )}
        {loading && <Loading />}
      </div>
    </Page>
  );
}
