"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add, edit, getOperationErrorForId } from "@/app/service/operational-error";
import { getAll } from "@/app/service/treasury";
import { validateField } from "@/app/utils/validateField";
import { atmType } from "@/types/atmType";
import { OperationalErrorType } from "@/types/operationalErrorType";
import { treasuryType } from "@/types/treasuryType";
import { faAdd, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function OperationalErrorAddEdit() {

  const { id } = useParams();
  const router = useRouter();

  const [treasuries, setTreasuries] = useState<treasuryType[]>([])
  const [atms, setAtms] = useState<atmType[]>([])

  const [idTreasury, setIdTreasury] = useState("0")
  const [numOS, setNumOs] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState(false)

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Erro Operacional - Edit | CredNosso";
    setLoading(true)
    if (!id) router.back()
    getAllTreasury();
    getOperationalErrorById()
    setLoading(false)
  }, []);



  const getOperationalErrorById = useCallback(async () => {
    setLoading(true);
    if (!id) {
      toast.error("Preciso de um ID para continuar, tente novamente");
      setLoading(false);
      return;
    }
    const operationError: OperationalErrorType | any = await getOperationErrorForId(parseInt(id as string))
    console.log(operationError)
    if (operationError.status === 300 || operationError.status === 400 || operationError.status === 500) {
      toast.error("Erro de requisição, tente novamente")
      setLoading(false)
      return
    }
    if (operationError.data !== undefined && operationError.data.operationalError?.id > 0) {
      setIdTreasury(operationError.data.operationalError.id_treasury.toString())
      setNumOs(operationError.data.operationalError.num_os.toString())
      setDescription(operationError.data.operationalError.description)
      setStatus(operationError.data.operationalError.status)
      setLoading(false)
      return
    }
    toast.error("Erro ao buscar Erro Operacional, tente novamente!")
    setLoading(false)
    return
  }, [id])

  // Atualiza o estado ao selecionar no select
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIdTreasury(event.target.value.toString());
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value) || "";
    setIdTreasury(value.toString());
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

  const editOperationalError = async () => {
    setLoading(true);
    if (idTreasury === "0" || !validateField(numOS) || !validateField(description)) {
      setLoading(false);
      toast.error("Preencher todos os campos para continuar!");
      return;
    }
    const data = {
      id_treasury: parseInt(idTreasury),
      num_os: parseInt(numOS),
      description: description,
      status: status
    }
    const editError = await edit(parseInt(id as string), data)
    if (editError.status === 300 || editError.status === 400 || editError.status === 500) {
      toast.error("Erro de requisição, tente novamente");
      setLoading(false);
      return;
    }
    if (editError.data !== undefined && editError.data.operationalError.id > 0) {
      toast.success("Alteração salva com sucesso!");
      setLoading(false);
      return;
    }
    toast.error("Erro ao adicionar Erro Operacional, tente novamente!");
    setLoading(false)
    return
  }

  return <Page>
    <TitlePages linkBack="/operational-error" icon={faAdd}>
      Editar Erro Operacional
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
                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm"
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
          <label className="uppercase leading-3 font-bold">N OS</label>
          <Input
            color="#DDDD"
            placeholder="Digite o número da OS"
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
            <label className="uppercase leading-3 font-bold">Status</label>
            <div
              className={`flex bg-slate-700 pt-1 pb-1 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
            >
              <select
                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                value={status ? "true" : "false"}
                onChange={(e) => setStatus(e.target.value === "true")}
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

        <div className="flex flex-col gap-5">
          <Button
            color="#2E8B57"
            onClick={editOperationalError}
            size="medium"
            textColor="white"
            variant="primary"
          >
            Editar
          </Button>
        </div>
        {loading &&
          <Loading />
        }
      </div>
    </div>
  </Page>
}