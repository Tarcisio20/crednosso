"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { ModalChangePassword } from "@/app/components/ux/ModalChangePassowrd";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getUserFromId, update } from "@/app/service/user";
import { validateField } from "@/app/utils/validateField";
import { faLandmarkDome, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserEdit() {
  const { id } = useParams();
  const router = useRouter();


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(false);

  const [modal, setModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const getUserById = useCallback(async () => {
    setLoading(true);
    const userOne = await getUserFromId(id as string)
    if (userOne.status === 300 || userOne.status === 400 || userOne.status === 500) {
      setLoading(false);
      toast.error('Erro na requisição, tente novamente');
      return;
    }

    if (userOne.data !== undefined && userOne.data.user.id > 0) {
      setName(userOne.data.user.name);
      setEmail(userOne.data.user.email);
      setLoading(false);
      return
    } else {
      setLoading(false);
      toast.error('Erro ao carregar usuário, tente novamente');
      return
    }

  }, [id])

  useEffect(() => {
    if (!id) {
      router.push("/user");
      return;
    }

    document.title = "Usuário - Edit | CredNosso";
    getUserById();
  }, [id, router, getUserById]);

  const editUser = async () => {
    setLoading(true);
    if (!validateField(name) || !validateField(email)) {
      setLoading(false);
      toast.error('Preencha todos os campos para continuar!');
      return;
    }

    const data = {
      name: name.trim(),
      email: email.trim(),
      status
    }

    const editUser = await update(parseInt(id as string), data)
    if (editUser.status === 300 || editUser.status === 400 || editUser.status === 500) {
      setLoading(false);
      toast.error('Erro na requisição, tente novamente');
      return;
    }

    if (editUser.data !== undefined && editUser.data.user.id > 0) {
      setLoading(false);
      toast.success('Usuário editado com sucesso!');
      return
    } else {
      setLoading(false);
      toast.error('Erro ao editar usuário, tente novamente');
      return
    }
  }

  const changePassowrdUser = async () => {
    if (!id) {
      toast.error('Erro ao carregar usuário, tente novamente');
      return
    }

    setModal(true);

  }

  return <Page>
    <TitlePages linkBack="/user" icon={faUserTie}>Editar Usuário</TitlePages>
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
          <label className="uppercase leading-3 font-bold">Status</label>
          <div
            className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
          >
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
              value={status ? "true" : "false"}
              onChange={(e) => setStatus(e.target.value === "true")}
            >
              <option className="uppercase bg-slate-700 text-white" value="0">
                Ativo
              </option>
              <option className="uppercase bg-slate-700 text-white" value="1">
                Inativo
              </option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Button
            color="#2E8B57"
            onClick={editUser}
            size="meddium"
            textColor="white"
            secondaryColor="#81C784"
          >
            Editar
          </Button>
          <Button
            color="#2E8B57"
            onClick={changePassowrdUser}
            size="meddium"
            textColor="white"
            secondaryColor="#81C784"
          >
            Redefinir Senha
          </Button>
        </div>
      </div>
    </div>
    {modal && <ModalChangePassword onClose={() => setModal(false)} id={parseInt(id as string)} />}
    {loading && <Loading />}
  </Page>

}