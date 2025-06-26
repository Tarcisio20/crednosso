"use client";

import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  faMobile,
  faIdBadge,
  faEnvelope,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/app/components/ui/Button";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { getAll } from "@/app/service/treasury";
import { treasuryType } from "@/types/treasuryType";
import { getContactById, update } from "@/app/service/contact";
import { ContactType } from "@/types/contactType";
import { validateField } from "@/app/utils/validateField";
import { Messeger } from "@/app/components/ux/Messeger";
import { toast } from "sonner";

export default function ContactsEdit() {

  const { id } = useParams()

  const [treasuries, setTreasuries] = useState<treasuryType[]>([])
  const [idTreasury, setIdTreasury] = useState('0')
  const [nameContact, setNameContact] = useState('')
  const [phoneContact, setPhoneContact] = useState('')
  const [emailContact, setEmailContact] = useState('')
  const [statusContact, setStatusContact] = useState(true)
  const [, setContact] = useState<ContactType>()

  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false)


  const getAllTreasuries = useCallback(async () => {
    setLoading(true);
    const allTreasuries = await getAll();
    if (allTreasuries.status === 300 || allTreasuries.status === 400 || allTreasuries.status === 500) {
      setLoading(false);
      toast.error('Erro de conexão, tente novamente!');
      return;
    }
    if (allTreasuries.data.treasury && allTreasuries.data.treasury[0]?.id) {
      setTreasuries(allTreasuries.data.treasury);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      toast.error('Erro ao carregar dados, tente novamente!');
      return;
    }
  }, []);

  const getById = useCallback(async () => {
    setLoading(true);
    const cont = await getContactById(id as string);
    if (cont.status === 300 || cont.status === 400 || cont.status === 500) {
      setLoading(false);
      toast.error('Erro de conexão, tente novamente!');
      return;
    }
    if (cont.data.contact && cont.data.contact?.id > 0) {
      setContact(cont.data.contact);
      setNameContact(cont.data.contact.name);
      setPhoneContact(cont.data.contact.phone);
      setEmailContact(cont.data.contact.email);
      setStatusContact(cont.data.contact.status);
      setIdTreasury(cont.data.contact.id_treasury);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      toast.error('Erro ao carregar dados, tente novamente!');
      return;
    }
  }, [id]);

  const AllLoadings = useCallback(async () => {
    await getAllTreasuries();
    await getById();
  }, [getAllTreasuries, getById]);


  useEffect(() => {
    document.title = "Contato - Edit | CredNosso";
    AllLoadings()
  }, [id, AllLoadings])

  const editContact = async () => {
    setLoading(true);
    if (
      idTreasury === "" ||
      idTreasury === "0" ||
      !validateField(nameContact) ||
      !validateField(phoneContact) ||
      !validateField(emailContact)
    ) {
      setLoading(false);
      toast.error('Preencha todos os campos para continuar!');
      return;
    }

    const data = {
      id_treasury: parseInt(idTreasury),
      name: nameContact.toUpperCase(),
      phone: phoneContact,
      email: emailContact.toUpperCase(),
      status: statusContact,
    };

    const editedContact = await update(parseInt(id as string), data);
    if (editedContact.status === 300 || editedContact.status === 400 || editedContact.status === 500) {
      setLoading(false);
      toast.error('Erro de conexão, tente novamente!');
      return;
    }
    if (editedContact.data.contact?.id) {
      AllLoadings();
      setLoading(false);
      toast.success('Contato editado com sucesso!');
      return;
    } else {
      setLoading(false);
      toast.error('Erro ao editar, tente novamente!');
      return;
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/contacts" icon={faPenToSquare}>
        Editar Contato
      </TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">
            Transportadora
          </label>
          <div
            className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
          >
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
              value={idTreasury}
              onChange={(e) => setIdTreasury(e.target.value)}
            >
              {treasuries &&
                treasuries.map((item, index) => (
                  <option
                    className="uppercase bg-slate-700 text-white"
                    value={item.id}
                    key={index}
                  >
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input
            color="#DDDD"
            placeholder="Digite o nome do Contato"
            size="extra-large"
            value={nameContact}
            onChange={(e) => setNameContact(e.target.value)}
            icon={faIdBadge}
          />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Telefone</label>
          <Input
            color="#DDDD"
            placeholder="Digite o telefone do Contato"
            size="extra-large"
            value={phoneContact}
            onChange={(e) => setPhoneContact(e.target.value)}
            icon={faMobile}
            mask="phone"
          />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">E-mail</label>
          <Input
            color="#DDDD"
            placeholder="Digite o telefone do Contato"
            size="extra-large"
            value={emailContact}
            onChange={(e) => setEmailContact(e.target.value)}
            icon={faEnvelope}
          />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Status</label>
          <div
            className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
          >
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg uppercase"
              value={statusContact ? "true" : "false"}
              onChange={(e) => setStatusContact(e.target.value === "true")}
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
        <div>
          <Button
            color="#2E8B57"
            onClick={editContact}
            size="meddium"
            textColor="white"
            secondaryColor="#81C784"
          >
            Editar
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
