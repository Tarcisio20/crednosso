"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/type-supply";
import { validateField } from "@/app/utils/validateField";
import { faAdd, faLandmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TypeSupplyAdd() {
  const router = useRouter();

  const [nameTypeSupply, setNameTypeSupply] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addTypeSupply = async () => {
    setError("");
    setLoading(false);
    setLoading(true);
    if (!validateField(nameTypeSupply)) {
      setError("Preencher todos os dados!");
      setLoading(false);
      return;
    }
    let data = {
      name: nameTypeSupply.toUpperCase(),
    };
    const newTypeSupply = await add(data);
    if (newTypeSupply.data.typeSupply.id > 0) {
      setLoading(false);
      setError("");
      router.push("/type-supply");
      return;
    }
    setError("Erro ao salvar!");
    setLoading(false);
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
        <div className="flex flex-col gap-5">
          <Button
            color="#2E8B57"
            onClick={addTypeSupply}
            size="meddium"
            textColor="white"
            secondaryColor="#81C784"
          >
            Cadastrar
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
