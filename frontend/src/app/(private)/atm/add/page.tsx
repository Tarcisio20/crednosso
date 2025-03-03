"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/atm";
import { getAll } from "@/app/service/treasury";
import { validateField } from "@/app/utils/validateField";
import { treasuryType } from "@/types/treasuryType";
import {
  faAdd,
  faLandmark,
  faVault,
  faReceipt,
  faListOl,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AtmAdd() {
  const router = useRouter();

  const [treasuries, setTreasuries] = useState<treasuryType[]>([]);

  const [idSystemAtm, setIdSystemAtm] = useState("");
  const [nameAtm, setNameAtm] = useState("");
  const [nameRedAtm, setNameRedAtm] = useState("");
  const [numStoreAtm, setNumStoreAtm] = useState("");
  const [idTreasury, setIdTreasury] = useState("0");
  const [casseteAAtm, setCasseteAAtm] = useState("10");
  const [casseteBAtm, setCasseteBAtm] = useState("20");
  const [casseteCAtm, setCasseteCAtm] = useState("50");
  const [casseteDAtm, setCasseteDAtm] = useState("100");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllTreasury();
  }, []);

  const addAtm = async () => {
    setError("");
    setLoading(false);
    setLoading(true);
    if (
      idSystemAtm === "" ||
      !validateField(nameAtm) ||
      !validateField(nameRedAtm) ||
      idTreasury === "0"
    ) {
      console.log("Dentro do erro");
      setError("Prencher todos os campos");
      setLoading(false);
      return;
    }

    let data = {
      id_system: parseInt(idSystemAtm),
      name: nameAtm,
      short_name: nameRedAtm,
      number_store: parseInt(numStoreAtm),
      id_treasury: parseInt(idTreasury),
      cassete_A: parseInt(casseteAAtm),
      cassete_B: parseInt(casseteBAtm),
      cassete_C: parseInt(casseteCAtm),
      cassete_D: parseInt(casseteDAtm),
    };

    const addNewAtm = await add(data);

    if (addNewAtm.data.atm && addNewAtm.data.atm.id > 0) {
      router.push("/atm");
      setLoading(false);
      return;
    } else {
      setError("Erro ao salvar");
      setLoading(false);
      return;
    }
  };

  const getAllTreasury = async () => {
    setLoading(false);
    setLoading(true);
    const t = await getAll();
    if (t.data.treasury && t.data.treasury.length === 0) {
      setError(
        "Sem tesourarias para ser vinculada, favor adicionar uma tesouraria primeiro!"
      );
      setLoading(false);
      return;
    }
    setIdTreasury(t.data.treasury[0].id);
    setTreasuries(t.data.treasury);
    setLoading(false);
    return;
  };

  return (
    <Page>
      <TitlePages linkBack="/atm" icon={faAdd}>
        Adicionar Atm
      </TitlePages>
      <div className="flex flex-row gap-8 p-5 w-full">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">Id</label>
            <Input
              color="#DDDD"
              placeholder="Digite o Id no sistema"
              size="extra-large"
              value={idSystemAtm}
              onChange={(e) => setIdSystemAtm(e.target.value)}
              icon={faReceipt}
            />
          </div>
          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">Nome</label>
            <Input
              color="#DDDD"
              placeholder="Digite o nome do Terminal"
              size="extra-large"
              value={nameAtm}
              onChange={(e) => setNameAtm(e.target.value)}
              icon={faLandmark}
            />
          </div>
          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">
              Nome Reduzido
            </label>
            <Input
              color="#DDDD"
              placeholder="Digite o nome reduzido do Terminal"
              size="extra-large"
              value={nameRedAtm}
              onChange={(e) => setNameRedAtm(e.target.value)}
              icon={faVault}
            />
          </div>
          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">Nº da Loja</label>
            <Input
              color="#DDDD"
              placeholder="Digite o nome reduzido do Terminal"
              size="extra-large"
              value={numStoreAtm}
              onChange={(e) => setNumStoreAtm(e.target.value)}
              icon={faVault}
            />
          </div>
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
                  treasuries?.map((item, index) => (
                    <option
                      key={index}
                      className="uppercase bg-slate-700 text-white"
                      value={item.id}
                    >
                      {item.short_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">
              Configuração de cassetes
            </label>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label>CASSETE A</label>
                <div
                  className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
                >
                  <select
                    className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                    value={casseteAAtm}
                    onChange={(e) => setCasseteAAtm(e.target.value)}
                  >
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="10"
                    >
                      R$ 10,00
                    </option>
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="20"
                    >
                      R$ 20,00
                    </option>
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="50"
                    >
                      R$ 50,00
                    </option>
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="100"
                    >
                      R$ 100,00
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>CASSETE B</label>
                <div
                  className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
                >
                  <select
                    className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                    value={casseteBAtm}
                    onChange={(e) => setCasseteBAtm(e.target.value)}
                  >
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="10"
                    >
                      R$ 10,00
                    </option>
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="20"
                    >
                      R$ 20,00
                    </option>
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="50"
                    >
                      R$ 50,00
                    </option>
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="100"
                    >
                      R$ 100,00
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>CASSETE C</label>
                <div
                  className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
                >
                  <select
                    className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                    value={casseteCAtm}
                    onChange={(e) => setCasseteCAtm(e.target.value)}
                  >
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="10"
                    >
                      R$ 10,00
                    </option>
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="20"
                    >
                      R$ 20,00
                    </option>
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="50"
                    >
                      R$ 50,00
                    </option>
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="100"
                    >
                      R$ 100,00
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>CASSETE D</label>
                <div
                  className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
                >
                  <select
                    className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                    value={casseteDAtm}
                    onChange={(e) => setCasseteDAtm(e.target.value)}
                  >
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="10"
                    >
                      R$ 10,00
                    </option>
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="20"
                    >
                      R$ 20,00
                    </option>
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="50"
                    >
                      R$ 50,00
                    </option>
                    <option
                      className="uppercase bg-slate-700 text-white"
                      value="100"
                    >
                      R$ 100,00
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <Button
              color="#2E8B57"
              onClick={addAtm}
              size="meddium"
              textColor="white"
              secondaryColor="#81C784"
            >
              Cadastrar
            </Button>
          </div>
          {error && <div className="text-white">{error}</div>}
          {loading && <Loading />}
        </div>
      </div>
    </Page>
  );
}
