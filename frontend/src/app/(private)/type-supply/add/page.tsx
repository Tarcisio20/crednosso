"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/type-supply";
import { validateField } from "@/app/utils/validateField";
import { faAdd, faLandmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TypeSupplyAdd() {

  useEffect(() => {
    document.title = "Tipo Abastecimento - Add | CredNosso";
  }, []);

  const router = useRouter();

  const [nameTypeSupply, setNameTypeSupply] = useState("");
  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false);

  const addTypeSupply = async () => {
    setLoading(true);
    if (!validateField(nameTypeSupply)) {
      setLoading(false);
      toast.error('Para continuar, preencher todos os dados!');
      return;
    }
    let data = {
      name: nameTypeSupply.toUpperCase(),
    };
    const newTypeSupply = await add(data);
    if (newTypeSupply.data.typeSupply.id > 0) {
      setNameTypeSupply("")
      setLoading(false);
      toast.success('Tipo de Abastecimento salvo com sucesso!');
      return;
    }
    setLoading(false);
    toast.error('Erro ao salvar, tente novamente!');
    return;
  };

  return (
    <Page>
      <TitlePages linkBack="/type-supply" icon={faAdd}>
        Adicionar Tipo de Pedido
      </TitlePages>
      <div className="flex flex-col gap-8 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input
            color="#DDDD"
            placeholder="Digite o nome do Tipo de Pedido"
            size="extra-large"
            value={nameTypeSupply}
            onChange={(e) => setNameTypeSupply(e.target.value)}
            icon={faLandmark}
          />
        </div>
        <div className="flex flex-col gap-5 w-[300px]">
          <Button
            color="#2E8B57"
            onClick={addTypeSupply}
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
