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
    setError({ type: '', title: '', messege: '' });
    setLoading(true);
    if (!validateField(nameTypeOperation) || idSystemTypeOperation === "") {
      setError({ type: 'error', title: 'Error', messege: 'Para continuar, preencha todos os campos corretamente!' });
      setLoading(false);
      return;
    }
    let data = {
      id_system: parseInt(idSystemTypeOperation),
      name: nameTypeOperation.toUpperCase(),
    };
    const newTypeOperation = await add(data);
    if (newTypeOperation.data.typeOperation.id) {
      setError({ type: 'success', title: 'Success', messege: 'Tipo de operação salva com sucesso!' });
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
        <div className="flex flex-col gap-5">
          <Button
            color="#2E8B57"
            onClick={addTypeOperation}
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
