"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/operational-error";
import { getAll } from "@/app/service/treasury";
import { validateField } from "@/app/utils/validateField";
import { atmType } from "@/types/atmType";
import { treasuryType } from "@/types/treasuryType";
import { faAdd, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OperationalErrorAdd() {

  const [treasuries, setTreasuries] = useState<treasuryType[]>([])
  const [atms, setAtms] = useState<atmType[]>([])

  const [idTreasury, setIdTreasury] = useState("0")
  const [numOS, setNumOs] = useState("")
  const [description, setDescription] = useState("")

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Erro Operacional - Add | CredNosso";
    getAllTreasury();
  }, []);

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

  const addOperationalError = async () => {
    setLoading(true);
    if (idTreasury === "0" || !validateField(numOS) || !validateField(description)) {
      setLoading(false);
      toast.error("Preencher todos os campos para continuar!");
      return;
    }
    const data = {
      id_treasury: parseInt(idTreasury),
      num_os: parseInt(numOS),
      description: description
    }
    const addNewError = await add(data)
    console.log("Add", addNewError)
    if (addNewError.status === 300 || addNewError.status === 400 || addNewError.status === 500) {
      toast.error("Erro de requisição, tente novamente");
      setLoading(false);
      return;
    }
    if (addNewError.data !== undefined && addNewError.data.operationalError.id  > 0) {
      toast.success("Erro Operacional adicionado com sucesso!");
      setIdTreasury(treasuries[0].id_system.toString());
      setNumOs("");
      setDescription("");
      setLoading(false);
      return;
    }
    toast.error("Erro ao adicionar Erro Operacional, tente novamente!");
    setLoading(false)
    return
  }

  return <Page>
    <TitlePages linkBack="/operational-error" icon={faAdd}>
      Adicionar Erro Operacional
    </TitlePages>
    <div className="flex flex-row gap-8 p-5 w-full">
      <div className="flex flex-col gap-4">

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

        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Id</label>
          <Input
            color="#DDDD"
            placeholder="Digite o Id no sistema"
            size="extra-large"
            value={numOS}
            onChange={(e) => setNumOs(e.target.value)}
            icon={faReceipt}
          />
        </div>

        <div className="flex flex-col gap-5 min-w-1/3">
          <label className="uppercase leading-3 font-bold">Descrição</label>
          <textarea
            className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 outline-none border-slate-600 h-5 flex-1 text-lg flex justify-center items-center"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-col gap-5">
          <Button
            color="#2E8B57"
            onClick={addOperationalError}
            size="meddium"
            textColor="white"
            secondaryColor="#81C784"
          >
            Cadastrar
          </Button>
        </div>
        {loading &&
          <Loading />
        }
      </div>
    </div>
  </Page>
}