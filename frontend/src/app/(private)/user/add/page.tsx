"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/user";
import { validateField } from "@/app/utils/validateField";
import { faAdd, faLandmarkDome } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast } from "sonner";

export default function UserAdd() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [loading, setLoading] = useState(false)

  const addUser = async () => {
       setLoading(true);
    if (!validateField(name) || !validateField(email)) {
      setLoading(false);
      toast.error("Para continuar, Prencher todos os campos");
      return;
    }
    const addNewUser = await add({ name, email })

    if (addNewUser.data.user && addNewUser.data.user.id > 0) {
      setName("");
      setEmail("");
      setLoading(false);
      toast.success("Usuário adicionado com sucesso, solicitarr que o usuario veja o e-mail!");
      return;
    }
    setLoading(false);
    toast.error("Erro ao salvar, tente novamente!");
    return
  }

  return <Page>
    <TitlePages linkBack="/user" icon={faAdd}>Adicionar Usuário</TitlePages>
    <div className="flex flex-row gap-8 p-5 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input
            color="#DDDD"
            placeholder="Digite o nome completo do usuário"
            size="extra-large"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={faLandmarkDome}
          />
        </div>
         <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input
            color="#DDDD"
            placeholder="Digite o e-mail do usuário"
            size="extra-large"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={faLandmarkDome}
            mask="email"
          />
        </div>
              <div className="flex flex-col gap-5">
            <Button
              color="#2E8B57"
              onClick={addUser}
              size="meddium"
              textColor="white"
              secondaryColor="#81C784"
            >
              Cadastrar
            </Button>
          </div>
      </div>
      {loading && <Loading />}
    </div>
  </Page>
}