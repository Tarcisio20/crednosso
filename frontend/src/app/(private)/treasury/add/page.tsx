"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/treasury";
import { getAll as getAllSuppy } from "@/app/service/type-supply";
import { getAll as getAllStores } from "@/app/service/type-store";
import { validateField } from "@/app/utils/validateField";
import { typeStoreType } from "@/types/typeStoreType";
import { typeSupplyType } from "@/types/typeSupplyType";
import {
  faAdd,
  faLandmark,
  faVault,
  faReceipt,
  faListOl,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Messeger } from "@/app/components/ux/Messeger";

export default function TreasuryAdd() {
  const router = useRouter();

  const [typeSupplies, setTypeSupplies] = useState<typeSupplyType[]>([]);
  const [idTypeSupply, setIdTypeSupply] = useState("0");

  const [typeStores, setTypeStores] = useState<typeStoreType[]>([])
  const [idTypeStore, setIdTypeStore] = useState("0");

  const [idSystemTreasury, setIdSystemTreasury] = useState("");
  const [nameTreasury, setNameTreasury] = useState("");
  const [nameRedTreasury, setNameRedTreasury] = useState("");
  const [nameForEmailTreasury, setNameForEmailTreasury] = useState("")
  const [numContaTreasury, setNumContaTreasury] = useState("");
  const [numGMCoreTreasury, setNumGMCoreTreasury] = useState("");
  const [regionTreasury, setRegionTreasury] = useState("");
  const [enanbledGMcoreTreasury, setEnanbledGMcoreTreasury] = useState("1");
  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false);

  const allLoadings = async () => {
    await getTypeSuplies()
    await getTypeStore()
  }

  useEffect(() => {
    document.title = "Tesourarias - Add | CredNosso";
    allLoadings();
  }, []);

  const getTypeSuplies = async () => {
    setError({ type: '', title: '', messege: '' });
    setLoading(false);
    setLoading(true);
    const tSupplies = await getAllSuppy();
    if (tSupplies.status === 300 && tSupplies.status === 400 && tSupplies.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Sem dados a mostrar, tente novamente!' });
      setLoading(false);
      return;
    }
    if (tSupplies.data.typeSupply && tSupplies.data.typeSupply.length > 0) {
      setTypeSupplies(tSupplies.data.typeSupply);
      setIdTypeSupply(tSupplies.data.typeSupply[0].id);
      setLoading(false);
      return;
    }
    setError({ type: 'error', title: 'Error', messege: 'Erro ao retornar dados' });
    setLoading(false);
    return;
  };

  const getTypeStore = async () => {
    setError({ type: '', title: '', messege: '' });
    setLoading(false);
    setLoading(true);
    const tStore = await getAllStores()
    if (tStore.status === 300 && tStore.status === 400 && tStore.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Sem dados a mostrar, tente novamente!' });
      setLoading(false);
      return;
    }

    if (tStore.data.typeStore && tStore.data.typeStore.length > 0) {
      setTypeStores(tStore.data.typeStore);
      setIdTypeStore(tStore.data.typeStore[0].id);
      setLoading(false);
      return;
    }
    setError({ type: 'error', title: 'Error', messege: "Erro ao retornar dados" });
    setLoading(false);
    return;
  }

  const cadTeasury = async () => {
    setError({ type: '', title: '', messege: '' });
    setLoading(false);
    setLoading(true);

    if (
      idSystemTreasury === "" ||
      !validateField(nameTreasury) ||
      !validateField(nameRedTreasury) ||
      numContaTreasury === "" ||
      regionTreasury === "0" ||
      idTypeSupply === "0" ||
      idTypeSupply === "" ||
      idTypeStore === "" ||
      !validateField(nameForEmailTreasury)
    ) {
      setError({
        type: 'error',
        title: 'Error',
        messege: "Preencher todos (exceto Numero GMCore se não houver) os campos, e os campos Nome, Nome Reduzido e Numero da conta o minimo é  de 3 catacteres."
      });
      setLoading(false);
      return;
    }

    const data = {
      id_system: parseInt(idSystemTreasury),
      id_type_supply: parseInt(idTypeSupply),
      id_type_store: parseInt(idTypeStore),
      enabled_gmcore: enanbledGMcoreTreasury === "0" ? false : true,
      name: nameTreasury.toUpperCase(),
      short_name: nameRedTreasury.toUpperCase(),
      region: parseInt(regionTreasury),
      account_number: numContaTreasury,
      gmcore_number: numGMCoreTreasury === "" ? "0" : numGMCoreTreasury,
      name_for_email : nameForEmailTreasury.toUpperCase()
    };
    const treasury = await add(data);
    if (treasury.data.treasury && treasury.data.treasury?.id > 0) {
      setIdTypeSupply("1");
      setIdTypeStore("1");
      setIdSystemTreasury("");
      setNameTreasury("");
      setNameRedTreasury("");
      setNumContaTreasury("");
      setNumGMCoreTreasury("");
      setRegionTreasury("");
      setNameForEmailTreasury("")
      setEnanbledGMcoreTreasury("1");
      setError({ type: 'success', title: 'Success', messege: 'Item salvo' });
      setLoading(false);
      return;
    } else {
      setError({ type: 'error', title: 'Error', messege: 'Sem dados a mostrar' });
      setLoading(false);
      return;
    }
  };

  return (
    <Page>
      <TitlePages linkBack="/treasury" icon={faAdd}>
        Adicionar Tesouraria
      </TitlePages>
      <div className="flex flex-row gap-8 p-5 w-full">
        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">Id</label>
            <Input
              color="#DDDD"
              placeholder="Digite o nome Id no sistema"
              size="extra-large"
              value={idSystemTreasury}
              onChange={(e) => setIdSystemTreasury(e.target.value)}
              icon={faReceipt}
            />
          </div>

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">Nome da Transportadora</label>
            <Input
              color="#DDDD"
              placeholder="Digite o nome da Transportadora"
              size="extra-large"
              value={nameTreasury}
              onChange={(e) => setNameTreasury(e.target.value)}
              icon={faLandmark}
            />
          </div>

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">
              Nome Reduzido
            </label>
            <Input
              color="#DDDD"
              placeholder="Digite o nome reduzido da Transportadora"
              size="extra-large"
              value={nameRedTreasury}
              onChange={(e) => setNameRedTreasury(e.target.value)}
              icon={faVault}
            />
          </div>

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">
              Nome Loja
            </label>
            <Input
              color="#DDDD"
              placeholder="Digite o nome reduzido da Transportadora"
              size="extra-large"
              value={nameForEmailTreasury}
              onChange={(e) => setNameForEmailTreasury(e.target.value)}
              icon={faVault}
            />
          </div>

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">N° Conta</label>
            <Input
              color="#DDDD"
              placeholder="Digite o numero da conta da  Transportadora"
              size="extra-large"
              value={numContaTreasury}
              onChange={(e) => setNumContaTreasury(e.target.value)}
              icon={faListOl}
            />
          </div>

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">N° GMCore</label>
            <Input
              color="#DDDD"
              placeholder="Digite o numero do GMCore da  Transportadora"
              size="extra-large"
              value={numGMCoreTreasury}
              onChange={(e) => setNumGMCoreTreasury(e.target.value)}
              icon={faListOl}
            />
          </div>

        </div>

        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">Região</label>
            <Input
              color="#DDDD"
              placeholder="Digite o numero do GMCore da  Transportadora"
              size="extra-large"
              value={regionTreasury}
              onChange={(e) => setRegionTreasury(e.target.value)}
              icon={faListOl}
            />
          </div>

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">
              Tipo de Abastecimento
            </label>
            <div
              className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
            >
              {typeSupplies && typeSupplies.length > 0 && (
                <select
                  className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                  value={idTypeSupply}
                  onChange={(e) => setIdTypeSupply(e.target.value)}
                >
                  {typeSupplies &&
                    typeSupplies.map((item, index) => (
                      <option
                        className="uppercase bg-slate-700 text-white"
                        value={item.id}
                        key={index}
                      >
                        {item.name}
                      </option>
                    ))}
                </select>
              )}
              {typeSupplies?.length === 0 && (
                <p className="text-white">Sem dados a mostrar</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">
              Tipo de Pagamento
            </label>
            <div
              className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
            >
              {typeStores && typeStores.length > 0 && (
                <select
                  className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                  value={idTypeStore}
                  onChange={(e) => setIdTypeStore(e.target.value)}
                >
                  {typeStores &&
                    typeStores.map((item, index) => (
                      <option
                        className="uppercase bg-slate-700 text-white"
                        value={item.id}
                        key={index}
                      >
                        {item.name}
                      </option>
                    ))}
                </select>
              )}
              {typeStores?.length === 0 && (
                <p className="text-white">Sem dados a mostrar</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">
              Ativo GMCORE
            </label>
            <div
              className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
            >
              <select
                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                value={enanbledGMcoreTreasury}
                onChange={(e) => setEnanbledGMcoreTreasury(e.target.value)}
              >
                <option className="uppercase bg-slate-700 text-white" value="1">
                  SIM
                </option>
                <option className="uppercase bg-slate-700 text-white" value="0">
                  NÃO
                </option>
              </select>
            </div>
          </div>

          <div>
            <Button
              color="#2E8B57"
              onClick={cadTeasury}
              size="meddium"
              textColor="white"
              secondaryColor="#81C784"
            >
              Cadastrar
            </Button>
          </div>
         
        </div>
        
        {error.messege && (
            <Messeger type={error.type} title={error.title} messege={error.messege} />
          )}
          {loading && <Loading />}
      </div>
     
    </Page>
  );
}
