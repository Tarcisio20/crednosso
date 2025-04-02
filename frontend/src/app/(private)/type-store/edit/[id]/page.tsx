"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getTypeStoreForId, update } from "@/app/service/type-store";
import { validateField } from "@/app/utils/validateField";
import { typeStoreType } from "@/types/typeStoreType";
import {
  faEdit,
  faLandmark,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TypeStoreEdit() {
  const { id } = useParams();
  const router = useRouter();

  if(!id){
    router.push('/type-store')
    return
  }
  const [typeStore, setTypeStore] = useState<typeStoreType>()
  const [nameTypeStore, setNameTypeStore] = useState('')
  const [statusTypeStore, setStatusTypeStore] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = "Tipo de Loja - Edit | CredNosso";
    getTypeStoreById();
  }, [id]);

  const getTypeStoreById = async () => {
    setError("");
    setLoading(false);
    setLoading(true);
    const tStore = await getTypeStoreForId(id as string);
    if(tStore.status === 300 || tStore.status === 400 || tStore.status === 500){
      setError("Erro na requisição");
      setLoading(false);
      return;
    }
    if (tStore.data.typeStore && tStore.data.typeStore?.id > 0) {
      setTypeStore(tStore.data.typeStore);
      setNameTypeStore(tStore.data.typeStore.name);
      setStatusTypeStore(tStore.data.typeStore.status);
      setError("");
      setLoading(false);
      return;
    } else {
      setError("Erro ao retornar");
      setLoading(false);
      return;
    }
  };

  const editTypeStore = async () => {
    setError("");
    setLoading(false);
    setLoading(true);
    if (!validateField(nameTypeStore)) {
      setError("Preencher todos os dados!");
      setLoading(false);
      return;
    }
    let data = {
      name: nameTypeStore.toUpperCase(),
      status : statusTypeStore
    }
    const newTypeStore = await update(parseInt(id as string), data)
    if(newTypeStore.status === 300 || newTypeStore.status === 400 || newTypeStore.status === 500){
      setError("Erro de requisição!");
      setLoading(false);
      return;
    }
    if (newTypeStore.data.typeStore && newTypeStore.data.typeStore.id > 0) {
      setLoading(false);
      setError("");
      getTypeStoreById();
      return;
    }
    setError("Erro ao salvar!");
    setLoading(false);
    return;
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
            placeholder="Digite o nome do Tipo de Pedido"
            size="extra-large"
            value={nameTypeStore}
            onChange={(e) => setNameTypeStore(e.target.value)}
            icon={faLandmark}
          />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Status</label>
          <div
            className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
          >
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg uppercase"
              value={statusTypeStore ? "true" : "false"}
              onChange={e => setStatusTypeStore(e.target.value === "true")}
            >
              <option
                className="uppercase bg-slate-700 text-white"
                value="true" >
                Ativo
              </option>
              <option
                className="uppercase bg-slate-700 text-white"
                value="false" >
                Inativo
              </option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <Button
            color="#2E8B57"
            onClick={editTypeStore}
            size="meddium"
            textColor="white"
            secondaryColor="#81C784"
          >
            Editar
          </Button>
        </div>
        {error && (
          <div>
            <p className="text-white">{error}</p>
          </div>
        )}
        {loading && <Loading />}
      </div>
    </Page>
  );
}
