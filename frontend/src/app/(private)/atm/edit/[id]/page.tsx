"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getAtmFronId, update } from "@/app/service/atm";
import { getAll } from "@/app/service/treasury";
import { validateField } from "@/app/utils/validateField";
import { atmType } from "@/types/atmType";
import { treasuryType } from "@/types/treasuryType";
import {
  faPenToSquare,
  faLandmark,
  faVault,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AtmEdit() {
  const { id } = useParams();
  const router = useRouter();


  const [, setAtms] = useState<atmType>()
  const [treasuries, setTreasuries] = useState<treasuryType[]>([])
  const [idSystemAtm, setIdSystemAtm] = useState('')
  const [nameAtm, setNameAtm] = useState('')
  const [nameRedAtm, setNameRedAtm] = useState('')
  const [numStoreAtm, setNumStoreAtm] = useState('')
  const [idTreasuryAtm, setIdTreasuryAtm] = useState('')
  const [statusAtm, setStatusAtm] = useState(true)
  const [casseteAAtm, setCasseteAAtm] = useState('10')
  const [casseteBAtm, setCasseteBAtm] = useState('20')
  const [casseteCAtm, setCasseteCAtm] = useState('50')
  const [casseteDAtm, setCasseteDAtm] = useState('100')

  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false);


  const getAtmById = useCallback( async () => {
    setError({ type: '', title: '', messege: '' })
    setLoading(false);
    setLoading(true);


    const atmOne = await getAtmFronId(id as string);
    const t = await getAll();
    if (t.status === 300 || t.status === 400 || t.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, tente novamente' })
      setLoading(false);
      return;
    }
    if (atmOne.data.atm && atmOne.data.atm.id) {
      setAtms(atmOne.data.atm);
      setIdSystemAtm(atmOne.data.atm.id_system);
      setNameAtm(atmOne.data.atm.name);
      setNameRedAtm(atmOne.data.atm.short_name);
      setStatusAtm(atmOne.data.atm.Status);
      setNumStoreAtm(atmOne.data.atm.number_store);
      setIdTreasuryAtm(atmOne.data.atm.id_treasury);
      setCasseteAAtm(atmOne.data.atm.cassete_A);
      setCasseteBAtm(atmOne.data.atm.cassete_B);
      setCasseteCAtm(atmOne.data.atm.cassete_C);
      setCasseteDAtm(atmOne.data.atm.cassete_D);
      setTreasuries(t.data.treasury);
      setLoading(false);
      return;
    } else {
      setError({ type: 'error', title: 'Error', messege: 'Sem dados a mostrar, atualize e tente novamente' })
      setLoading(false);
      return;
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      router.push("/atm");
      return;
    }
  
    document.title = "Atm - Edit | CredNosso";
    getAtmById();
  }, [id, router, getAtmById]);

  const updateAtm = async () => {
    setError({ type: '', title: '', messege: '' })
    setLoading(false);
    setLoading(true);
    if (
      idSystemAtm === '' || !validateField(nameAtm) || !validateField(nameRedAtm) || idTreasuryAtm === '0' ||
      numStoreAtm === ''

    ) {
      setError({ type: 'error', title: 'Error', messege: 'Prrencha todos os campos e tente novamente' })
      setLoading(false);
      return;
    }

    const data = {
      id_system: parseInt(idSystemAtm),
      name: nameAtm.toUpperCase(),
      short_name: nameRedAtm.toUpperCase(),
      number_store: parseInt(numStoreAtm),
      id_treasury: parseInt(idTreasuryAtm),
      status: statusAtm,
      cassete_A: parseInt(casseteAAtm),
      cassete_B: parseInt(casseteBAtm),
      cassete_C: parseInt(casseteCAtm),
      cassete_D: parseInt(casseteDAtm),
    };

    const editedAtm = await update(parseInt(id as string), data);
    if (editedAtm.status === 300 || editedAtm.status === 400 || editedAtm.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, tente novamente' })
      setLoading(false);
      return
    }
    if (editedAtm.data.atm && editedAtm.data.atm?.id > 0) {
      getAtmById();
      setError({ type: 'success', title: 'Succes', messege: 'Atualizado com sucesso!' })
      setLoading(false);
      return;
    }
    setError({ type: 'error', title: 'Error', messege: 'Erro ao atualizar, tente novamente' })
    setLoading(false);
    return
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value) || "";
    setIdTreasuryAtm(value.toString());
  };

  // Atualiza o estado ao selecionar no select
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIdTreasuryAtm(event.target.value.toString());
  };

  return (
    <Page>
      <TitlePages linkBack="/atm" icon={faPenToSquare}>
        Editar Atm
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
              placeholder="Digite o nome reduzido Terminal"
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
                  value={idTreasuryAtm}
                  onChange={handleInputChange}
                  className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                />
              </div>
              <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-80 h-11 text-lg`} >
                <select
                  className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                  value={idTreasuryAtm}
                  onChange={handleSelectChange}
                >
                  {treasuries ? treasuries.map((treasury) => (
                    <option
                      key={treasury.id}
                      value={treasury.id_system}
                      className="bg-zinc-700">
                      {treasury.name}
                    </option>
                  )) : (
                    <option value="">Nenhum tesouro encontrado</option>
                  )}

                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">Status</label>
            <div
              className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
            >
              <select
                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                value={statusAtm ? "true" : "false"}
                onChange={(e) => setStatusAtm(e.target.value === "true")}
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
          <div>
            <Button
              color="#2E8B57"
              onClick={updateAtm}
              size="meddium"
              textColor="white"
              secondaryColor="#81C784"
            >
              Alterar
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
