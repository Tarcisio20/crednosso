"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/type-store";
import { validateField } from "@/app/utils/validateField";
import { faAdd, faLandmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TypeStoreAdd() {
  const router = useRouter();

  const [nameTypeStore, setNameTypeStore] = useState("");
  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false);

  const addTypeStore = async () => {
    setError({ type: '', title: '', messege: '' });
    setLoading(false);
    setLoading(true);
    if (!validateField(nameTypeStore)) {
      setError({ type: '', title: '', messege: '' });
      setLoading(false);
      return;
    }
    let data = {
      name: nameTypeStore.toUpperCase(),
    };
    const newTypeStore = await add(data);
    if (newTypeStore.data.typeStore && newTypeStore.data.typeStore[0].id > 0) {
      setLoading(false);
      setError({ type: 'success', title: 'Success', messege: 'Tipo de Loja salva com sucesso!' });
      return;
    }
    setError({ type: 'error', title: 'Error', messege: 'Erro ao salvar, tente novamente!' });
    setLoading(false);
    return;
  };

  return (
    <Page>
      <TitlePages linkBack="/type-store" icon={faAdd}>
        Adicionar Tipo de Loja
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
          <Button
            color="#2E8B57"
            onClick={addTypeStore}
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
