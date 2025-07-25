"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  faCheck,
  faIdCardClip,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/app/components/ux/Loading";
import { treasuryType } from "@/types/treasuryType";
import { getAll } from "@/app/service/treasury";
import { del, getByIdTreasury } from "@/app/service/contact";
import { ContactType } from "@/types/contactType";
import { generateStatus } from "@/app/utils/generateStatus";
import { returnNameTreasury } from "@/app/utils/returnNameTreasury";
import { Messeger } from "@/app/components/ux/Messeger";
import { toast } from "sonner";

export default function Contacts() {
  const router = useRouter();

  const [treasuries, setTreasuries] = useState<treasuryType[]>([]);
  const [idTreasury, setIdTreasury] = useState("1");
  const [contacts, setContacts] = useState<ContactType[]>([]);

  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Contatos | CredNosso";
    getAllTreasury();
  }, []);

  const handleAdd = () => {
    router.push("/contacts/add");
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value) || "";
    setIdTreasury(value.toString());
  };

  // Atualiza o estado ao selecionar no select
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIdTreasury(event.target.value.toString());
  };

  const getAllTreasury = async () => {
    setLoading(true);
    const allTreasuries = await getAll();
    if (allTreasuries.status === 300 || allTreasuries.status === 400 || allTreasuries.status === 500) {
      setLoading(false);
      toast.error('Erro de requisição, tente novamente!');
      return;
    }
    if (allTreasuries.data.treasury && allTreasuries.data.treasury[0]?.id) {
      setIdTreasury(allTreasuries.data.treasury[0].id);
      setTreasuries(allTreasuries.data.treasury);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      toast.error('Sem dados a mostrar!');
      return;
    }
  };

  const search = async () => {
    setContacts([])
    setLoading(true);
    if (idTreasury === "" || idTreasury === "0") {
      setLoading(false);
      toast.error('Erro ao pesquisar, tente novamente!');
      return;
    }
    const allContacts = await getByIdTreasury(parseInt(idTreasury));
    if (allContacts.status === 300 || allContacts.status === 400 || allContacts.status === 500) {
      setLoading(false);
      toast.error('Erro de requisição, tente novamente!');
      return;
    }
    if (allContacts.data.contact && allContacts.data.contact[0]?.id) {
      setContacts(allContacts.data.contact);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      toast.error('Sem dados a mostrar, atualize e tente novamente');
      return;
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault()
    setLoading(true);
    if (!id) {
      setLoading(false);
      toast.error('Selecione um Atm, para continunar');
      return;
    }
    const deleteContact = await del(id)
    if (deleteContact.status === 300 || deleteContact.status === 400 || deleteContact.status === 500) {
      setLoading(false);
      toast.error('Erro de requisição, tente novamente');
      return;
    }
    if (deleteContact.status === 200) {
      setLoading(false);
      toast.success('Atm deletado com sucesso!');
      search();
      return;
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/" icon={faIdCardClip}>
        Contatos
      </TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 items-center justify-center mb-4">
            <Button
              color="#2E8B57"
              variant="primary"
              textColor="white"
              onClick={handleAdd}
              size="medium"
            >
              Adicionar
            </Button>
          </div>
          <div className="flex flex-row gap-2">

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

            <div className="flex flex-col justify-end">
              <Button
                color="#1E90FF "
                onClick={search}
                variant="primary" 
                size="small"
                textColor="white"
              >
                Pesquisar
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <table className="flex-1 text-center p-3" width="100%">
            <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Transportadora</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Ativo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody className=" text-xl">
              {contacts &&
                contacts.map((item, index) => (
                  <tr className={`h-12 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-600'
                    } hover:bg-zinc-300 transition-colors hover:text-black`} key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{returnNameTreasury(treasuries, item.id_treasury)}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>
                      {item.status ? (
                        <FontAwesomeIcon
                          icon={faCheck}
                          size="2x"
                          color="#2E8B57"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faXmark}
                          size="2x"
                          color="#BF6C6C"
                        />
                      )}
                    </td>
                    <td className="flex justify-center items-center gap-4 h-12">
                      <Link href={`/contacts/edit/${item.id}`}>
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          size="1x"
                          color="#6C8EBF"
                        />
                      </Link>
                      <a href={`/contacts/del/${item.id}`}
                        onClick={(e) => handleDelete(e, item.id as number)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          size="1x"
                          color="#BF6C6C"
                        />
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {error.messege &&
            <Messeger type={error?.type} title={error.title} messege={error.messege} />
          }
          {loading && <Loading />}
        </div>
      </div>
    </Page>
  );
}
