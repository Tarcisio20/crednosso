"use client"

import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faMobile, faIdBadge, faEnvelope, faAdd } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from '@/app/components/ui/Input';
import { Loading } from '@/app/components/ux/Loading';
import { treasuryType } from '@/types/treasuryType';
import { getAll } from '@/app/service/treasury';
import { validateField } from '@/app/utils/validateField';
import { add } from '@/app/service/contact';
import { Messeger } from "@/app/components/ux/Messeger";
import { ContactType } from "@/types/contactType";

export default function ContactsAdd() {

  const router = useRouter()

  const [treasuries, setTreasuries] = useState<treasuryType[]>()
  const [idTreasury, setIdTreasury] = useState('0')
  const [nameContact, setNameContact] = useState('')
  const [phoneContact, setPhoneContact] = useState('')
  const [emailContact, setEmailContact] = useState('')

  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllTreasuries()
  }, [])

  const getAllTreasuries = async () => {
    setError({ type: '', title: '', messege: '' });
    setLoading(false)
    setLoading(true)
    const allTreasury = await getAll()
    if (allTreasury.status === 300 || allTreasury.status === 400 || allTreasury.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro de requisição, tente novamente!' });
      setLoading(false)
      return
    }
    if (allTreasury.data.treasury[0] && allTreasury.data.treasury[0].id > 0) {
      setIdTreasury(allTreasury.data.treasury[0].id)
      setTreasuries(allTreasury.data.treasury)
      setLoading(false)
      return
    } else {
      setError({ type: 'error', title: 'Error', messege: 'Erro ao retornar dados, tente novamente!' });
      setLoading(false)
      return
    }
  }

  const addContact = async () => {
    setError({ type: '', title: '', messege: '' });
    setLoading(false)
    setLoading(true)
    if (
      idTreasury === '' || idTreasury === '0' || !validateField(nameContact) || !validateField(emailContact)
    ) {
      setError({ type: 'error', title: 'Error', messege: 'Preencha todos os dados para continuar!' });
      setLoading(false)
      return
    }
    let data = {
      id_treasury: parseInt(idTreasury),
      name: nameContact.toUpperCase(),
      email: emailContact.toUpperCase(),
      phone: phoneContact
    }

    const newContact = await add(data)
    if (newContact.status === 300 || newContact.status === 400 || newContact.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro de requisição, tente novamente!' });
      setLoading(false)
      return
    }
    if (newContact.data.contact && newContact.data.contact.id > 0) {
      setNameContact('')
      setPhoneContact('')
      setEmailContact('')
      setError({ type: 'success', title: 'Success', messege: 'Salvo com sucesso!' });
      setLoading(false)

      return
    } else {
      setError({ type: 'error', title: 'Error', messege: 'Erro ao salvar, tente novamente!' });
      setLoading(false)
      return
    }
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
                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
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
          <Button color="#2E8B57" onClick={addContact} size="meddium" textColor="white" secondaryColor="#81C784">Adicionar</Button>
        </div>
        {error &&
          <div className="text-white">
            {error.messege &&
              <Messeger type={error.type} title={error.title} messege={error.messege} />
            }
          </div>
        }
        {loading &&
          <Loading />
        }
      </div>
    </Page>
  );
}
