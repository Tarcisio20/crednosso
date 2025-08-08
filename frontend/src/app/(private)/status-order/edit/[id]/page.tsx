"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getStatusOrderForId, update } from "@/app/service/status-order";
import { validateField } from "@/app/utils/validateField";
import { statusOrderType } from "@/types/statusOrder";
import {
  faLandmark,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function StatusOrderEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [, setStatusOrder] = useState<statusOrderType>();
  const [nameStatusOrder, setNameStatusOrder] = useState('');
  const [statusStatusOrder, setStatusStatusOrder] = useState(true);
  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false);

  // Se `id` estiver ausente, redirecionar com useEffect
  useEffect(() => {
    if (!id) {
      router.push('/status-order');
    }
  }, [id, router]);

  const getStatusOrder = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const getSOrder = await getStatusOrderForId(id as string);
      if ([300, 400, 500].includes(getSOrder.status)) {
        toast.error('Erro na requisição, tente novamente!');
        return;
      }
      const data = getSOrder.data.statusOrder;
      if (data?.id) {
        setStatusOrder(data);
        setNameStatusOrder(data.name);
        setStatusStatusOrder(data.status);
      } else {
        toast.error('Nada a mostrar, tente novamente!');
      }
    } catch {
      toast.error('Erro ao carregar os dados, tente novamente!');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    document.title = "Status Pedido - Edit | CredNosso";
    if (id) {
      getStatusOrder();
    }
  }, [id, getStatusOrder]);

  const editTypeOperation = async () => {
    if (!validateField(nameStatusOrder)) {
      toast.error('Para continuar, preencha todos os campos corretamente!');
      return;
    }

    setLoading(true);
    try {
      const data = {
        name: nameStatusOrder.toUpperCase(),
        status: statusStatusOrder
      };
      const edited = await update(parseInt(id as string), data);

      if ([300, 400, 500].includes(edited.status)) {
        toast.error('Erro na requisição, tente novamente!');
        return;
      }

      if (edited.data.statusOrder?.id) {
        await getStatusOrder();
        toast.success('Alterado com sucesso!');
      } else {
        toast.error('Erro ao alterar, tente novamente!');
      }
    } catch {
      toast.error('Erro inesperado!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/status-order" icon={faPenToSquare}>
        Editar Status do Pedido
      </TitlePages>
      <div className="flex flex-col gap-8 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input
            color="#DDDD"
            placeholder="Digite o nome do Tipo de Operação"
            size="extra-large"
            value={nameStatusOrder}
            onChange={(e) => setNameStatusOrder(e.target.value)}
            icon={faLandmark}
          />
        </div>

        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Status</label>
          <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg">
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg uppercase"
              value={statusStatusOrder ? "true" : "false"}
              onChange={e => setStatusStatusOrder(e.target.value === "true")}
            >
              <option className="uppercase bg-slate-700 text-white" value="true">Ativo</option>
              <option className="uppercase bg-slate-700 text-white" value="false">Inativo</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Button
            color="#2E8B57"
            onClick={editTypeOperation}
            size="medium"
            textColor="white"
            variant="primary"
          >
            Editar
          </Button>
        </div>

        {error.messege && (
          <Messeger
            type={error.type}
            title={error.title}
            messege={error.messege}
          />
        )}

        {loading && <Loading />}
      </div>
    </Page>
  );
}
