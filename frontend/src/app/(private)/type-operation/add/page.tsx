"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/type-operation";
import { validateField } from "@/app/utils/validateField";
import {
  faAdd,
  faLandmark,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TypeOperationAdd() {

  useEffect(() => {
    document.title = "Tipo Operação - Add | CredNosso";
  }, []);


  const router = useRouter();

  const [idSystemTypeOperation, setIdSystemTypeOperation] = useState("");
  const [nameTypeOperation, setNameTypeOperation] = useState("");
  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false);

  const addTypeOperation = async () => {
    setLoading(true);
    if (!validateField(nameTypeOperation) || idSystemTypeOperation === "") {
      setLoading(false);
      toast.error('Para continuar, preencha todos os campos corretamente!');
      return;
    }
    let data = {
      id_system: parseInt(idSystemTypeOperation),
      name: nameTypeOperation.toUpperCase(),
    };
    const newTypeOperation = await add(data);
    if (newTypeOperation.data.typeOperation.id) {
      setIdSystemTypeOperation("")
      setNameTypeOperation("")
      setLoading(false);
      toast.success('Tipo de Operação salva com sucesso!');
      return;
    } else {
      setLoading(false);
      toast.error('Erro ao salvar, tente novamente!');
      return;
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/type-operation" icon={faAdd}>
        Adicionar Tipo de Operação
      </TitlePages>
      <div className="flex flex-col gap-8 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Id</label>
          <Input color="#DDDD" placeholder="Digite o nome Id no sistema" size="extra-large"
            value={idSystemTypeOperation} onChange={(e) => setIdSystemTypeOperation(e.target.value)} icon={faReceipt} />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input color="#DDDD" placeholder="Digite o nome do Tipo de Operação" size="extra-large"
            value={nameTypeOperation} onChange={(e) => setNameTypeOperation(e.target.value)} icon={faLandmark} />
        </div>
        <div className="flex flex-col gap-5 w-[300px]">
          <Button
            color="#2E8B57"
            onClick={addTypeOperation}
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
