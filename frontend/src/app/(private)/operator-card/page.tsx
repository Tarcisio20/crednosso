"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  faCheck,
  faCreditCard,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/app/components/ux/Loading";
import { getAll } from "@/app/service/treasury";
import { treasuryType } from "@/types/treasuryType";
import { del, getByIdTreasury } from "@/app/service/card-operator";
import { cardOperatorType } from "@/types/cardOperatorType";
import { generateStatus } from "@/app/utils/generateStatus";
import { returnNameTreasury } from "@/app/utils/returnNameTreasury";
import { Messeger } from "@/app/components/ux/Messeger";
import { toast } from "sonner";

export default function OperatorCard() {
  const router = useRouter();

  const [treasuries, setTreasuries] = useState<treasuryType[]>([]);
  const [idTreasury, setIdTreasury] = useState("0");

  const [cardOperators, setCardOperators] = useState<cardOperatorType[]>([]);

  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Cartão Operador | CredNosso";
    getAllTreasuries();
  }, []);

  const handleAdd = () => {
    router.push("/operator-card/add");
    return;
  };

  const getAllTreasuries = async () => {
    setLoading(true);
    const allTreasury = await getAll();
    if (allTreasury.status === 300 || allTreasury.status === 400 || allTreasury.status === 500) {
      setLoading(false);
      toast.error('Erro na requisição, tente novamente!');
      return;
    }
    if (allTreasury.data.treasury && allTreasury.data.treasury[0]?.id > 0) {
      setIdTreasury(allTreasury.data.treasury[0]?.id);
      setTreasuries(allTreasury.data.treasury);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      toast.error('Erro ao retornar dados, tente novamente!');
      return;
    }
  };

  const search = async () => {
    setLoading(true);
    if (idTreasury === "" || idTreasury === "0") {
      setLoading(false);
      toast.error('Selecione uma transportadora para continuar!');
      return;
    }
    const allCardOperator = await getByIdTreasury(parseInt(idTreasury));
    if (allCardOperator?.status === 400 || allCardOperator?.status === 500 || allCardOperator?.status === 300) {
      setLoading(false);
      toast.error('Erro de requisição, tente novamente!');
    }
    if (allCardOperator?.data.cardOperator || allCardOperator?.data.cardOperator?.id > 0) {
      setCardOperators(allCardOperator.data.cardOperator);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      toast.error('Sem cartões a listar, tente novamente!');
      return;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value) || "";
    setIdTreasury(value.toString());
  };

  // Atualiza o estado ao selecionar no select
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIdTreasury(event.target.value.toString());
  };

  const handleDelete = async (e: React.MouseEvent<HTMLAnchorElement>, id: number) => {
    e.preventDefault()
    setLoading(true);
    if (!id) {
      setLoading(false);
      toast.error('Selecione um cartão para continuar!');
      return;
    }
    const deleteCard = await del(id)
    if (deleteCard.status === 300 || deleteCard.status === 400 || deleteCard.status === 500) {
      setLoading(false);
      toast.error('Erro de requisição, tente novamente');
      return;
    }
    if (deleteCard.status === 200) {
      setLoading(false);
      search();
      toast.success('Cartão deletado com sucesso!');
      return;
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/" icon={faCreditCard}>
        Cartão Operador
      </TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-3 items-center justify-center mb-4">
          <Button
            color="#2E8B57"
            secondaryColor="#81C784"
            textColor="white"
            onClick={handleAdd}
            size="meddium"
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

          <div className="flex flex-col justify-end">
            <Button
              color="#1E90FF "
              onClick={search}
              secondaryColor="#87CEFA "
              size="small"
              textColor="white"
            >
              Pesquisar
            </Button>
          </div>
        </div>

        <table className="flex-1 text-center p-3" width="100%">
          <thead className="border-b-2 border-b-zinc-500 uppercase pb-2 text-2xl">
            <tr>
              <th>ID</th>
              <th>Transportadora</th>
              <th>Nome</th>
              <th>N° Cartão</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className=" text-xl">
            {cardOperators &&
              cardOperators.map((item, index) => (
                <tr className={`h-12 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-600'
                  } hover:bg-zinc-300 transition-colors hover:text-black`} key={index}>
                  <td>{item.id}</td>
                  <td>{returnNameTreasury(treasuries, item.id_treasury)}</td>
                  <td>{item.name}</td>
                  <td>{item.number_card}</td>
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
                    <Link href={`/operator-card/edit/${item.id}`}>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        size="1x"
                        color="#6C8EBF"
                      />
                    </Link>
                    <a href={`/operator-card/del/${item.id}`}
                      onClick={(e) => { handleDelete(e, item.id as number) }}
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
        {error.messege && (
          <Messeger type={error?.type} title={error.title} messege={error.messege} />
        )}
        {loading && <Loading />}
      </div>
    </Page>
  );
}
