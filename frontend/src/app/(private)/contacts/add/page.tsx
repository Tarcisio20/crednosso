"use client"

import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faMobile, faIdBadge, faEnvelope, faAdd } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/app/components/ui/Button';
import { useEffect, useState } from 'react';
import { Input } from '@/app/components/ui/Input';
import { Loading } from '@/app/components/ux/Loading';
import { treasuryType } from '@/types/treasuryType';
import { getAll } from '@/app/service/treasury';
import { validateField } from '@/app/utils/validateField';
import { add } from '@/app/service/contact';
import { toast } from "sonner";

export default function ContactsAdd() {

  const [treasuries, setTreasuries] = useState<treasuryType[]>()
  const [idTreasury, setIdTreasury] = useState('0')
  const [nameContact, setNameContact] = useState('')
  const [phoneContact, setPhoneContact] = useState('')
  const [emailContact, setEmailContact] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = "Contato - Add | CredNosso";
    getAllTreasuries()
  }, [])

  const getAllTreasuries = async () => {
    setLoading(true)
    const allTreasury = await getAll()
    if (allTreasury.status === 300 || allTreasury.status === 400 || allTreasury.status === 500) {
      setLoading(false)
      toast.error('Erro de requisição, tente novamente!');
      return
    }
    if (allTreasury.data.treasury[0] && allTreasury.data.treasury[0].id > 0) {
      setIdTreasury(allTreasury.data.treasury[0].id)
      setTreasuries(allTreasury.data.treasury)
      setLoading(false)
      return
    } else {
      setLoading(false)
      toast.error('Erro ao retornar dados, tente novamente!');
      return
    }
  }

  const addContact = async () => {
    setLoading(true)
    if (idTreasury === '' || idTreasury === '0' || !validateField(nameContact) || !validateField(emailContact)) {
      setLoading(false)
      toast.error('Preencha todos os dados para continuar!');
      return
    }

    const data = {
      id_treasury: parseInt(idTreasury),
      name: nameContact.toUpperCase(),
      email: emailContact.toUpperCase(),
      phone: phoneContact
    }

    const newContact = await add(data)
    if (newContact.status === 300 || newContact.status === 400 || newContact.status === 500) {
      setLoading(false)
      toast.error('Erro de requisição, tente novamente!');
      return
    }
    if (newContact.data.contact && newContact.data.contact.id > 0) {
      setNameContact('')
      setPhoneContact('')
      setEmailContact('')
      setLoading(false)
      toast.success('Contato adicionado com sucesso!');
      return
    } else {
      setLoading(false)
      toast.error('Erro ao salvar, tente novamente!');
      return
    }
    setLoading(false);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value) || "";
    setIdTreasury(value.toString());
  };

  // Atualiza o estado ao selecionar no select
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIdTreasury(event.target.value.toString());
  };


  return (
    <Page>
      <TitlePages linkBack="/contacts" icon={faAdd} >Adicionar Contatos</TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">

        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">
            Transportadora
          </label>
          <div className="flex gap-2">
            <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
              <input
                value={idTreasury}
                onChange={handleInputChange}
                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
              />
            </div>
            <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-80 h-11 text-lg`} >
              <select
                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm"
                value={idTreasury}
                onChange={handleSelectChange}
              >
                {treasuries && treasuries.map((treasury) => (
                  <option key={treasury.id} value={treasury.id_system} className="uppercase bg-slate-700 text-white">
                    {treasury.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome Completo</label>
          <Input color="#DDDD" placeholder="Digite o nome completo do Contato" size="extra-large"
            value={nameContact} onChange={(e) => setNameContact(e.target.value)} icon={faIdBadge} />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Telefone</label>
          <Input color="#DDDD" placeholder="Digite o telefone do Contato" size="extra-large"
            value={phoneContact} onChange={(e) => setPhoneContact(e.target.value)} icon={faMobile} mask="phone" />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">E-mail</label>
          <Input color="#DDDD" placeholder="Digite o e-mail do Contato" size="extra-large"
            value={emailContact} onChange={(e) => setEmailContact(e.target.value)} icon={faEnvelope} />
        </div>
        <div>
          <Button
            color="#2E8B57"
            onClick={addContact}
            size="medium"
            textColor="white"
            variant="primary"
          >Adicionar</Button>
        </div>
        {loading &&
          <Loading />
        }
      </div>
    </Page>
  );
}
