"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  faCreditCard,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loading } from "@/app/components/ux/Loading";
import { getAll } from "@/app/service/treasury";
import { treasuryType } from "@/types/treasuryType";
import { getByIdTreasury } from "@/app/service/card-operator";
import { cardOperatorType } from "@/types/cardOperatorType";
import { generateStatus } from "@/app/utils/generateStatus";
import { returnNameTreasury } from "@/app/utils/returnNameTreasury";

export default function OperatorCard() {
  const router = useRouter();

  const [treasuries, setTreasuries] = useState<treasuryType[]>([]);
  const [idTreasury, setIdTreasury] = useState("0");

  const [cardOperators, setCardOperators] = useState<cardOperatorType[]>([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllTreasuries();
  }, []);

  const handleAdd = () => {
    router.push("/operator-card/add");
    return;
  };

  const getAllTreasuries = async () => {
    setError("");
    setLoading(false);
    setLoading(true);
    const allTreasury = await getAll();
    if(allTreasury.status === 300 || allTreasury.status === 400 || allTreasury.status === 500){
      setError("Erro na requisição!");
      setLoading(false);
      return;
    }
    if (allTreasury.data.treasury && allTreasury.data.treasury[0]?.id > 0) {
      setIdTreasury(allTreasury.data.treasury[0]?.id);
      setTreasuries(allTreasury.data.treasury);
      setLoading(false);
      return;
    } else {
      setError("Erro ao retornar dados!");
      setLoading(false);
      return;
    }
  };

  const search = async () => {
    setError("");
    setLoading(false);
    setLoading(true);
    if (idTreasury === "" || idTreasury === "0") {
      setError("Erro ao pesquisar!");
      setLoading(false);
      return;
    }
    const allCardOperator = await getByIdTreasury(parseInt(idTreasury));
    if (
      allCardOperator?.status === 400 ||
      allCardOperator?.status === 500 ||
      allCardOperator?.status === 300
    ) {
      setError("Sem dados a mostrar no nomento!");
      setLoading(false);
    }
    if (allCardOperator?.data.cardOperator || allCardOperator?.data.cardOperator?.id > 0) {
      setCardOperators(allCardOperator.data.cardOperator);
      setLoading(false);
      return;
    } else {
      setError("Sem contatos a listar");
      setLoading(false);
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
          <div className="flex flex-col gap-2">
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
                <tr className="h-12" key={index}>
                  <td>{item.id}</td>
                  <td>{returnNameTreasury(treasuries, item.id_treasury)}</td>
                  <td>{item.name}</td>
                  <td>{item.number_card}</td>
                  <td> {generateStatus(item.status as Boolean)} </td>
                  <td className="flex justify-center items-center gap-4 h-12">
                    <Link href={`/operator-card/edit/${item.id}`}>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        size="1x"
                        color="#6C8EBF"
                      />
                    </Link>
                    <Link href={`/operator-card/del/${item.id}`}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="1x"
                        color="#BF6C6C"
                      />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {error && <div className="text-white">{error}</div>}
        {loading && <Loading />}
      </div>
    </Page>
  );
}
