"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getTypeStoreForId, update } from "@/app/service/type-store";
import { validateField } from "@/app/utils/validateField";
import { typeStoreType } from "@/types/typeStoreType";
import { faEdit, faLandmark } from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

export default function TypeStoreEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [typeStore, setTypeStore] = useState<typeStoreType>();
  const [nameTypeStore, setNameTypeStore] = useState('');
  const [statusTypeStore, setStatusTypeStore] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const getTypeStoreById = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const tStore = await getTypeStoreForId(id as string);
      console.log("Tipo de Loja:", tStore);

      if ("error" in tStore || !("data" in tStore)) {
        toast.error("Erro na requisição, tente novamente!");
        return;
      }

      const store = (tStore as { data: { typeStore: typeStoreType } }).data.typeStore;

      if (store?.id != null && store.id > 0) {
        setTypeStore(store);
        setNameTypeStore(store.name ?? '');
        setStatusTypeStore(store.status ?? true);
      } else {
        toast.error("Erro ao retornar os dados.");
      }
    } catch {
      toast.error("Erro inesperado, tente novamente!");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    document.title = "Tipo de Loja - Edit | CredNosso";
    getTypeStoreById();
  }, [id, getTypeStoreById]);

  useEffect(() => {
    if (!id) router.push("/type-store");
  }, [id, router]);

  const editTypeStore = async () => {
    if (!validateField(nameTypeStore)) {
      toast.error("Para continuar, preencha todos os campos corretamente!");
      return;
    }

    setLoading(true);
    try {
      const data: typeStoreType = {
        name: nameTypeStore.toUpperCase(),
        status: statusTypeStore,
      };

      const newTypeStore = await update(parseInt(id as string), data);

      if ("status" in newTypeStore && [300, 400, 500].includes(newTypeStore.status)) {
        toast.error("Erro na requisição, tente novamente!");
        return;
      }

      const updated = (newTypeStore as { data: { typeStore: typeStoreType } }).data.typeStore;

      if (updated?.id != null && updated.id > 0) {
        await getTypeStoreById();
        toast.success("Alterado com sucesso!");
      } else {
        toast.error("Erro ao salvar, tente novamente!");
      }
    } catch {
      toast.error("Erro inesperado ao salvar!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/type-store" icon={faEdit}>
        Editar Tipo de Loja
      </TitlePages>
      <div className="flex flex-col gap-8 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input
            color="#DDDD"
            placeholder="Digite o nome do Tipo de Loja"
            size="extra-large"
            value={nameTypeStore}
            onChange={(e) => setNameTypeStore(e.target.value)}
            icon={faLandmark}
          />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Status</label>
          <div className="flex bg-slate-700 pt-2 pb-2 px-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg">
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm uppercase"
              value={statusTypeStore ? "true" : "false"}
              onChange={(e) => setStatusTypeStore(e.target.value === "true")}
            >
              <option className="uppercase bg-slate-700 text-white" value="true">
                Ativo
              </option>
              <option className="uppercase bg-slate-700 text-white" value="false">
                Inativo
              </option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-[300px]">
          <Button
            color="#2E8B57"
            onClick={editTypeStore}
            size="medium"
            textColor="white"
            variant="primary"
          >
            Editar
          </Button>
        </div>
        {loading && <Loading />}
      </div>
    </Page>
  );
}
