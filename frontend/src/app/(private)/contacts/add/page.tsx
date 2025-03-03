"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

export default function ContactsAdd() {

  const router = useRouter()

  const [treasuries, setTreasuries] = useState<treasuryType[]>()
  const [idTreasury, setIdTreasury] = useState('0')
  const [nameContact, setNameContact] = useState('')
  const [phoneContact, setPhoneContact] = useState('')
  const [emailContact, setEmailContact] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllTreasuries()
  }, [])

  const getAllTreasuries = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const allTreasury = await getAll()
    if (allTreasury.data.treasury[0].id) {
      setIdTreasury(allTreasury.data.treasury[0].id)
      setTreasuries(allTreasury.data.treasury)
      setLoading(false)
      return
    } else {
      setError("Erro ao retornar dados!")
      setLoading(false)
      return
    }
  }

  const addContact = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    if (
      idTreasury === '' || idTreasury === '0' || !validateField(nameContact) ||
      !validateField(phoneContact) || !validateField(emailContact)
    ) {
      setError("Preencher todos os campos")
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
    if (newContact.data.contact.id) {
      setLoading(false)
      router.push('/contacts')
      return
    } else {
      setError("Erro ao salvar!")
      setLoading(false)
      return
    }
  }

  return (
    <Page>
      <TitlePages linkBack="/contacts" icon={faAdd} >Adicionar Contatos</TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Transportadora</label>
          <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
              value={idTreasury}
              onChange={e => setIdTreasury(e.target.value)}
            >
              {treasuries && treasuries.map((item, index) => (
                <option
                  className="uppercase bg-slate-700 text-white"
                  value={item.id} key={index} >
                  {item.name}
                </option>
              ))}

            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome Reduzido</label>
          <Input color="#DDDD" placeholder="Digite o nome do Contato" size="extra-large" 
          value={nameContact} onChange={(e)=>setNameContact(e.target.value)} icon={faIdBadge} />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Telefone</label>
          <Input color="#DDDD" placeholder="Digite o telefone do Contato" size="extra-large" 
          value={phoneContact} onChange={(e)=>setPhoneContact(e.target.value)} icon={faMobile} />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">E-mail</label>
          <Input color="#DDDD" placeholder="Digite o telefone do Contato" size="extra-large" 
          value={emailContact} onChange={(e)=>setEmailContact(e.target.value)} icon={faEnvelope} />
        </div>
        <div>
          <Button color="#2E8B57" onClick={addContact} size="meddium" textColor="white" secondaryColor="#81C784">Adicionar</Button>
        </div>
        {error &&
          <div className="text-white">
            {error}
          </div>
        }
        {loading &&
          <Loading />
        }
      </div>
    </Page>
  );
}
