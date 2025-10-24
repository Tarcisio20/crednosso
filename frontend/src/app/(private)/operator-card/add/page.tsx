"use client";

import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faIdBadge, faAdd } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/app/components/ui/Button";
import { useEffect, useState } from "react";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { treasuryType } from "@/types/treasuryType";
import { getAll } from "@/app/service/treasury";
import { validateField } from "@/app/utils/validateField";
import { add } from "@/app/service/card-operator";
import { toast } from "sonner";

export default function OperationCardAdd() {

  const [treasuries, setTreasuries] = useState<treasuryType[]>();
  const [idTreasury, setIdTreasury] = useState("0");
  const [nameOperatorCard, setNameOperatorCard] = useState("");
  const [numOperatorCard, setNumOperatorCard] = useState("");
  const [inUseOperatorCard, setInUseOperadorCard] = useState(false)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Cartão Operador - Add | CredNosso";
    getAllTreasuries();
  }, []);

  const getAllTreasuries = async () => {
    setLoading(true);
    const allTreasury = await getAll();
    if (allTreasury.status === 300 || allTreasury.status === 400 || allTreasury.status === 500) {
      setLoading(false);
      toast.error('Erro na requisição, tentar novamente!');
      return;
    }
    if (allTreasury.data.treasury && allTreasury.data.treasury[0].id > 0) {
      setIdTreasury(allTreasury.data.treasury[0].id);
      setTreasuries(allTreasury.data.treasury);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      toast.error('Erro ao retornar os dados, tentar novamente!');
      return;
    }
  };

  const addCardOperator = async () => {
    setLoading(true);
    if (
      idTreasury === "" ||
      idTreasury === "0" ||
      !validateField(nameOperatorCard) ||
      !validateField(numOperatorCard)
    ) {
      setLoading(false);
      toast.error('Preencha todos os dados para continuar!');
      return;
    }

    const data = {
      id_treasury: parseInt(idTreasury),
      name: nameOperatorCard.toUpperCase(),
      number_card: numOperatorCard,
      inUse: inUseOperatorCard
    };

    const newCardOperator = await add(data);

    if (newCardOperator.status === 300 || newCardOperator.status === 400 || newCardOperator.status === 500) {
      setLoading(false);
      toast.error('Erro na requisição, tentar novamente!');
      return;
    }
    if (newCardOperator.data.cardOperator && newCardOperator.data.cardOperator.id > 0) {
      setLoading(false);
      toast.success('Cartão operador adicionado com sucesso!');
      return;
    } else {
      setLoading(false);
      toast.error('Erro ao salvar, tentar novamente!');
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

  return (
    <Page>
      <TitlePages linkBack="/operator-card" icon={faAdd}>
        Adicionar Cartão Operador
      </TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">

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

        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome Cartão</label>
          <Input
            color="#DDDD"
            placeholder="Digite o número do cartão"
            size="extra-large"
            value={nameOperatorCard}
            onChange={(e) => setNameOperatorCard(e.target.value)}
            icon={faIdBadge}
          />
        </div>

        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Número Cartão</label>
          <Input
            color="#DDDD"
            placeholder="Digite o número do cartão"
            size="extra-large"
            value={numOperatorCard}
            onChange={(e) => setNumOperatorCard(e.target.value)}
            icon={faIdBadge}
          />
        </div>

        <div className="flex flex-row gap-2 items-center">
          <input className="w-6 h-6" type="checkbox" checked={inUseOperatorCard} onChange={e => setInUseOperadorCard(!inUseOperatorCard)} />
          <label className="text-white text-lg uppercase">Cartão Principal</label>
        </div>

        <div>
          <Button
            color="#2E8B57"
            onClick={addCardOperator}
            size="medium"
            textColor="white"
            variant="primary" 
          >
            Adicionar
          </Button>
        </div>
        {loading && <Loading />}
      </div>
    </Page>
  );
}
