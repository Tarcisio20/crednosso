"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
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
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AtmAdd() {

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

  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Atm - Add | CredNosso";
    getAllTreasury();
  }, []);

  const addAtm = async () => {
    setLoading(false);
    setLoading(true);
    if (idSystemAtm === "" || !validateField(nameAtm) || !validateField(nameRedAtm) || idTreasury === "0") {
      setLoading(false);
      toast.error("Para continuar, Prencher todos os campos");
      return;
    }

    const data = {
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
      toast.success("Atm adicionado com sucesso!");
      setIdSystemAtm("");
      setNameAtm("");
      setNameRedAtm("");
      setNumStoreAtm("");
      setCasseteAAtm("10");
      setCasseteBAtm("20");
      setCasseteCAtm("50");
      setCasseteDAtm("100");
      setLoading(false);
       toast.success("Atm adicionado com sucesso!");
      return;
    } else {
      setLoading(false);
      toast.error("Erro ao adicionar Atm, tente novamente!");
      return;
    }
  };

  const getAllTreasury = async () => {
    setLoading(true);
    const t = await getAll();
    if (t.status === 300 || t.status === 400 || t.status === 500) {
      setLoading(false);
      toast.error("Erro de requisição, tente novamente");
      return;
    }
    if (t.data.treasury && t.data.treasury.length === 0) {
      setLoading(false);
      toast.error("Sem tesourarias para ser vinculada, favor adicionar uma tesouraria primeiro!");
      return;
    }
    setIdTreasury(t.data.treasury[0].id);
    setTreasuries(t.data.treasury);
    setLoading(false);
    return;
  };

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
                  {treasuries.map((treasury) => (
                    <option key={treasury.id} value={treasury.id_system} className="uppercase bg-slate-700 text-white">
                      {treasury.name}
                    </option>
                  ))}
                </select>
              </div>
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
          {error.messege && 
            <Messeger type={error.type} title={error.title} messege={error.messege} />
          }
          {loading && <Loading />}
        </div>
      </div>
    </Page>
  );
}
