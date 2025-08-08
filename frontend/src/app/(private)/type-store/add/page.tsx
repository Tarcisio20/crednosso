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
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TypeStoreAdd() {
  useEffect(() => {
    document.title = "Tipo de Loja - Add | CredNosso";
  }, []);

  const router = useRouter();

  const [nameTypeStore, setNameTypeStore] = useState("");
  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false);

  const addTypeStore = async () => {
    setLoading(true);

    if (!validateField(nameTypeStore)) {
      setLoading(false);
      toast.error('Para continuar, preencha todos os campos corretamente!');
      return;
    }

    const data = {
      name: nameTypeStore.toUpperCase(),
    };

    try {
      const newTypeStore = await add(data) as any;

      if (newTypeStore?.data?.typeStore?.length > 0) {
        toast.success('Tipo de Loja salva com sucesso!');
        router.push("/type-store");
      } else {
        toast.error('Erro ao salvar, tente novamente!');
      }
    } catch (error) {
      console.error("Erro ao salvar Tipo de Loja:", error);
      toast.error('Erro inesperado, tente novamente!');
    } finally {
      setLoading(false);
    }
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

        <div className="flex flex-col gap-5 w-[300px]">
          <Button
            color="#2E8B57"
            onClick={addTypeStore}
            size="medium"
            textColor="white"
            variant="primary"
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
