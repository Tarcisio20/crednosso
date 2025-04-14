"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getTypeSupplyForId, update } from "@/app/service/type-supply";
import { validateField } from "@/app/utils/validateField";
import { typeSupplyType } from "@/types/typeSupplyType";
import {
  faAdd,
  faLandmark,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function TypeSupplyEdit() {
  const { id } = useParams();
  const router = useRouter();

  if(!id){
    router.push('/type-supply')
    return
  }
  const [typeSupplies, setTypeSupplies] = useState<typeSupplyType>()
  const [nameTypeSupply, setNameTypeSupply] = useState('')
  const [statusTypeSupply, setStatusTypeSupply] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const getTypeSupplyById =  useCallback(async () => {
    setError("");
    setLoading(false);
    setLoading(true);
    const tSupply = await getTypeSupplyForId(id as string);
    if (tSupply.data.typeSupply.id > 0) {
      setTypeSupplies(tSupply.data.typeSupply);
      setNameTypeSupply(tSupply.data.typeSupply.name);
      setStatusTypeSupply(tSupply.data.typeSupply.status);
      setError("");
      setLoading(false);
      return;
    } else {
      setError("Erro ao retornar");
      setLoading(false);
      return;
    }
  }, [])

  
  useEffect(() => {
    document.title = "Tipo Abastecimento - Edit | CredNosso";
    getTypeSupplyById();
  }, [id, getTypeSupplyById]);

  const editTypeSupply = async () => {
    setError("");
    setLoading(false);
    setLoading(true);
    if (!validateField(nameTypeSupply)) {
      setError("Preencher todos os dados!");
      setLoading(false);
      return;
    }
      const data = {
      name: nameTypeSupply.toUpperCase(),
      status : statusTypeSupply
    }
    const newTypeSupply = await update(parseInt(id as string), data)
    if (newTypeSupply.data.typeSupply.id > 0) {
      setLoading(false);
      setError("");
      getTypeSupplyById();
      return;
    }
    setError("Erro ao salvar!");
    setLoading(false);
    return;
  };

  return (
    <Page>
      <TitlePages linkBack="/type-supply" icon={faAdd}>
        Editar Tipo de Pedido
      </TitlePages>
      <div className="flex flex-col gap-8 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input
            color="#DDDD"
            placeholder="Digite o nome do Tipo de Pedido"
            size="extra-large"
            value={nameTypeSupply}
            onChange={(e) => setNameTypeSupply(e.target.value)}
            icon={faLandmark}
          />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Status</label>
          <div
            className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
          >
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg uppercase"
              value={statusTypeSupply ? "true" : "false"}
              onChange={e => setStatusTypeSupply(e.target.value === "true")}
            >
              <option
                className="uppercase bg-slate-700 text-white"
                value="true" >
                Ativo
              </option>
              <option
                className="uppercase bg-slate-700 text-white"
                value="false" >
                Inativo
              </option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <Button
            color="#2E8B57"
            onClick={editTypeSupply}
            size="meddium"
            textColor="white"
            secondaryColor="#81C784"
          >
            Editar
          </Button>
        </div>
        {error && (
          <div>
            <p className="text-white">{error}</p>
          </div>
        )}
        {loading && <Loading />}
      </div>
    </Page>
  );
}
