"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import {
  faPenToSquare,
  faLandmark,
  faVault,
  faReceipt,
  faDollarSign,
  faListOl,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { treasuryType } from "@/types/treasuryType";
import {
  addSaldoTreasury,
  getByIdSystem,
  update,
} from "@/app/service/treasury";
import { generateValueTotal } from "@/app/utils/generateValueTotal";
import { generateReal } from "@/app/utils/generateReal";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { validateField } from "@/app/utils/validateField";
import { Loading } from "@/app/components/ux/Loading";
import { typeSupplyType } from "@/types/typeSupplyType";
import { getAll } from "@/app/service/type-supply";
import { getAll as getllTypeStore } from "@/app/service/type-store";
import { ContactType } from "@/types/contactType";
import { getByIdTreasury } from "@/app/service/contact";
import { returnArraytoString } from "@/app/utils/returnArraytoString";
import { typeStoreType } from "@/types/typeStoreType";
import { Messeger } from "@/app/components/ux/Messeger";
import { toast } from "sonner";

export default function TreasuryEdit() {

  const { id } = useParams()
  const router = useRouter()

  const [typeSupplies, setTypeSupplies] = useState<typeSupplyType[]>()
  const [idTypeSupply, setIdTypeSupply] = useState('0')

  const [typeStores, setTypeStores] = useState<typeStoreType[]>([])
  const [idTypeStore, setIdTypeStore] = useState('0')

  const [contacts, setContacts] = useState<ContactType[]>()

  const [contact, setContact] = useState('')
  const [treasury, setTreasury] = useState<treasuryType>()
  const [idSystemTreasury, setIdSystemTreasury] = useState('')
  const [nameTreasury, setNameTreasury] = useState('')
  const [nameRedTreasury, setNameRedTreasury] = useState('')
  const [nameForEmailTreasury, setNameForEmailTreasury] = useState('')
  const [numContaTreasury, setNumContaTreasury] = useState('')
  const [numGMCoreTreasury, setNumGMCoreTreasury] = useState('')
  const [regionTreasury, setRegionTreasury] = useState('0')
  const [enanbledGMcoreTreasury, setEnanbledGMcoreTreasury] = useState(true)
  const [saldoTreasury, setSaldoTreasury] = useState('0')
  const [bankBranchForTransferTreasury, setBankBranchForTransferTreasury] = useState("");
  const [accountNumberForTransferTreasury, setAccountNumberForTransferTreasury] = useState("");
  const [statusTreasury, setStatusTreasury] = useState(false)

  const [error, setError] = useState({ type: '', title: '', messege: '' });
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(false);
  const [valueA, setValueA] = useState(0);
  const [valueB, setValueB] = useState(0);
  const [valueC, setValueC] = useState(0);
  const [valueD, setValueD] = useState(0);
  const [valueAddA, setValueAddA] = useState(0);
  const [valueAddB, setValueAddB] = useState(0);
  const [valueAddC, setValueAddC] = useState(0);
  const [valueAddD, setValueAddD] = useState(0);

  if (!id) {
    router.push("/treasury");
    return;
  }


  const allLoadings = async () => {
    await getTreasuryByIdSystem();
    await getTypeSuplies();
    await getAllContactsByIdTreasury();
    await getTypeStore()
  };

  useEffect(() => {
    document.title = "Tesouraria - Edit | CredNosso";
    allLoadings();
  }, [id]);

  const getTreasuryByIdSystem = async () => {
    setLoading(true)
    const treasuryOne = await getByIdSystem(id as string);
    if (treasuryOne.status === 300 || treasuryOne.status === 400 || treasuryOne.status === 500) {
      setError({ type: 'error', title: 'Error', messege: 'Erro na requisição, tentar novamente!' })
      setLoading(false)
      toast.error('Erro na requisição, tentar novamente!')
      return
    }
    if (treasuryOne.data.treasury.id) {
      setTreasury(treasuryOne.data.treasury)
      setIdSystemTreasury(treasuryOne.data.treasury.id_system)
      setNameTreasury(treasuryOne.data.treasury.name)
      setNameRedTreasury(treasuryOne.data.treasury.short_name)
      setNumContaTreasury(treasuryOne.data.treasury.account_number)
      setNameForEmailTreasury(treasuryOne.data.treasury.name_for_email)
      setNumGMCoreTreasury(treasuryOne.data.treasury.gmcore_number)
      setEnanbledGMcoreTreasury(treasuryOne.data.treasury.enabled_gmcore)
      setIdTypeStore(treasuryOne.data.treasury.id_type_store)
      setIdTypeSupply(treasuryOne.data.treasury.id_type_supply)
      setRegionTreasury(treasuryOne.data.treasury.region)
      setSaldoTreasury(
        generateValueTotal(
          treasuryOne.data.treasury.bills_10,
          treasuryOne.data.treasury.bills_20,
          treasuryOne.data.treasury.bills_50,
          treasuryOne.data.treasury.bills_100
        )
      );
      setEnanbledGMcoreTreasury(
        treasuryOne.data.treasury.enabled_gmcore
      );
      setStatusTreasury(treasuryOne.data.treasury.status);
      setValueA(treasuryOne.data.treasury.bills_10);
      setValueB(treasuryOne.data.treasury.bills_20);
      setValueC(treasuryOne.data.treasury.bills_50);
      setValueD(treasuryOne.data.treasury.bills_100);
      const bank = treasuryOne.data.treasury.account_number_for_transfer
      if(bank){
        const partes = bank.split(' - ');
        setBankBranchForTransferTreasury(partes[0].split(': ')[1])
        setAccountNumberForTransferTreasury(partes[1].split(': ')[1])
      }
      setLoading(false)
    } else {
      setLoading(false)
      toast.error('Item não encontrado, tente novamente!')
      return;
    }
  };

  const getTypeSuplies = async () => {
    setLoading(true);
    const tSupplies = await getAll();
    if (tSupplies.status === 300 || tSupplies.status === 400 || tSupplies.status === 500) {
      setLoading(false);
      toast.error('Erro na requisição, tente novamente!');
      return;
    }
    if (tSupplies.data.typeSupply && tSupplies.data.typeSupply[0].id > 0) {
      setTypeSupplies(tSupplies.data.typeSupply);
      setLoading(false);
      return;
    }
    setLoading(false);
    toast.error('Erro ao retornar dados, tente novamente!');
    return;
  };

  const getAllContactsByIdTreasury = async () => {
    setLoading(true);
    const ctc = await getByIdTreasury(parseInt(id as string));
    if (ctc.data.contact.length === 0) {
      setLoading(false);
      toast.error('Sem contatos a mostrar, tente novamente!');
      return;
    }
    setContact(returnArraytoString(ctc.data.contact));
    setLoading(false);
    return;
  };

  const getTypeStore = async () => {
    setLoading(true);

    const tStore = await getllTypeStore()
    if (tStore.status === 300 || tStore.status === 400 || tStore.status === 500) {
      setLoading(false);
      toast.error('Erro na requisição, tente novamente!');
      return;
    }
    if (tStore.data.typeStore && tStore.data.typeStore[0].id > 0) {
      setTypeStores(tStore.data.typeStore);
      setLoading(false);
      return;
    }
    setLoading(false);
    toast.error('Erro ao retornar dados, tente novamente!');
    return;
  }

  const addSaldo = () => {
    setModal(true);
  };

  const addContact = () => {
    router.push("/contacts/add");
    return;
  };

  const closeModal = () => {
    setValueAddA(0);
    setValueAddB(0);
    setValueAddC(0);
    setValueAddD(0);
    setModal(false);
  };

  const saveSaldo = async () => {
    const data = {
      bills_10: valueAddA,
      bills_20: valueAddB,
      bills_50: valueAddC,
      bills_100: valueAddD,
    };
    const saldo = await addSaldoTreasury(parseInt(id as string), data);
    if (!saldo.data.treasury) {
      setLoading(false)
      toast.error('Erro ao salvar, tente novamente!');
      return
    }
    closeModal();
    await getTreasuryByIdSystem();
    return
  };

  const alterTreasury = async () => {
    setLoading(true);
    if (
      idSystemTreasury === "" || !validateField(nameTreasury) ||
      !validateField(nameRedTreasury) || numContaTreasury === "" ||
      regionTreasury === '' || idTypeStore === "" || idTypeSupply === "" ||
      !validateField(nameForEmailTreasury)
    ) {
      setLoading(false)
      toast.error('Preencher todos (exceto Numero GMCore se não houver) os campos, e os campos Nome, Nome Reduzido e Numero da conta o minimo é  de 3 catacteres.');
      return;
    }
    const dataElement = {
      id_system: parseInt(idSystemTreasury),
      id_type_supply: parseInt(idTypeSupply),
      id_type_store: parseInt(idTypeStore),
      name: nameTreasury.toUpperCase(),
      name_for_email: nameForEmailTreasury.toUpperCase(),
      short_name: nameRedTreasury.toUpperCase(),
      account_number: numContaTreasury,
      gmcore_number: numGMCoreTreasury,
      region: parseInt(regionTreasury),
      enabled_gmcore: enanbledGMcoreTreasury,
      bills_10: valueA,
      bills_20: valueB,
      bills_50: valueC,
      bills_100: valueD,
      status: statusTreasury,
      account_number_for_transfer: `Agência: ${bankBranchForTransferTreasury.trim()} - Conta: ${accountNumberForTransferTreasury.trim()}`
    };
  const editTreasury = await update(parseInt(id as string), dataElement)
  if (editTreasury.data.treasury && editTreasury.data.treasury.id > 0) {
    await getTreasuryByIdSystem();
    setLoading(false);
    toast.success('Salvo com sucesso!');
    return;
  } else {
    setLoading(false);
    toast.error('Erro ao editar, tente novamente!');
    return;
  }
};

return (
  <Page>
    <TitlePages linkBack="/treasury" icon={faPenToSquare}>
      Editar Tesouraria
    </TitlePages>
    <div className="flex flex-row gap-20 p-5 w-full">
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
          <label className="uppercase leading-3 font-bold">Nome</label>
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
            placeholder="Digite o nome da Loja da Transportadora"
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
            Tipo de Pagamento
          </label>
          <div
            className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
          >
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm"
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
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-4">

      <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nº Agencia  Pagamento</label>
          <Input
            color="#DDDD"
            placeholder="Digite o numero da agencia para pagamento"
            size="extra-large"
            value={bankBranchForTransferTreasury}
            onChange={(e) => setBankBranchForTransferTreasury(e.target.value)}
            icon={faListOl}
          />
        </div>

        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nº Conta Pagamento</label>
          <Input
            color="#DDDD"
            placeholder="Digite o numero da conta para pagamento"
            size="extra-large"
            value={accountNumberForTransferTreasury}
            onChange={(e) => setAccountNumberForTransferTreasury(e.target.value)}
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
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm"
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
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-sm"
              value={enanbledGMcoreTreasury ? "true" : "false"}
              onChange={e => setEnanbledGMcoreTreasury(e.target.value === "true")}
            >
              <option
                className="uppercase bg-slate-700 text-white"
                value="true" >
                SIM
              </option>
              <option
                className="uppercase bg-slate-700 text-white"
                value="false" >
                NÃO
              </option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Saldo</label>
          <div className="flex flex-row gap-1">
            <Input
              readonly
              color="#DDDD"
              placeholder="R$ 00,00"
              size="extra-large"
              value={saldoTreasury}
              onChange={(e) => setSaldoTreasury(e.target.value)}
              icon={faDollarSign}
            />
            <Button
              color=""
              onClick={addSaldo}
              size="small"
              variant={"primary"}    
              textColor="white"
            >
              Add Saldo
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Contatos</label>
          <div className="flex gap-2">
            <textarea
              className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-30 text-lg outline-none"
              placeholder="Todos os contatos da tesouraria"
              value={contact}
              readOnly
            ></textarea>
            <Button
              color=""
              onClick={addContact}
              size="small"
              variant={"primary"}
              textColor="white"
            >
              Adicionar Contato
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Status</label>
          <div
            className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
          >
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg uppercase"
              value={statusTreasury ? "true" : "false"}
              onChange={e => setStatusTreasury(e.target.value === "true")}
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
        <div>
          <Button
            color="#2E8B57"
            onClick={alterTreasury}
            size="medium"
            textColor="white"
            variant={"primary"}
          >
            Alterar
          </Button>
        </div>
        {modal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
              <h2 className="text-xl font-bold mb-4 text-black text-center uppercase">
                Adicioanar saldo
              </h2>
              <p className="text-black text-center">{nameRedTreasury}</p>
              <p className="text-black text-xl text-center">
                Saldo Atual:{" "}
                {generateValueTotal(valueA, valueB, valueC, valueD)}
              </p>
              <div className="w-full  flex justify-center items-center mt-2 mb-2">
                <div className="w-full h-1 bg-zinc-600 rounded"></div>
              </div>
              <div className="mb-4 flex flex-col w-full h-full gap-4 text-black">
                <div className="w-full flex items-center justify-center gap-2 ">
                  <div className="w-20 text-center">R$ 10,00</div>
                  <input
                    className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                    value={valueAddA}
                    onChange={(e) => {
                      const inputValueA = e.target.value;
                      setValueAddA(
                        inputValueA === "" ? 0 : parseInt(inputValueA)
                      );
                    }}
                  />
                  <div className="">{generateReal(valueAddA, 10)}</div>
                </div>

                <div className="w-full flex items-center justify-center gap-2 ">
                  <div className="w-20 text-center">R$ 20,00</div>
                  <input
                    className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                    value={valueAddB}
                    onChange={(e) => {
                      const inputValueB = e.target.value;
                      setValueAddB(
                        inputValueB === "" ? 0 : parseInt(inputValueB)
                      );
                    }}
                  />
                  <div>{generateReal(valueAddB, 20)}</div>
                </div>

                <div className="w-full flex items-center justify-center gap-2 ">
                  <div className="w-20 text-center">R$ 50,00</div>
                  <input
                    className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                    value={valueAddC}
                    onChange={(e) => {
                      const inputValueC = e.target.value;
                      setValueAddC(
                        inputValueC === "" ? 0 : parseInt(inputValueC)
                      );
                    }}
                  />
                  <div>{generateReal(valueAddD, 50)}</div>
                </div>

                <div className="w-full flex items-center justify-center gap-2 ">
                  <div className="w-20 text-center">R$ 100,00</div>
                  <input
                    className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                    value={valueAddD}
                    onChange={(e) => {
                      const inputValueD = e.target.value;
                      setValueAddD(
                        inputValueD === "" ? 0 : parseInt(inputValueD)
                      );
                    }}
                  />
                  <div>{generateReal(valueAddD, 100)}</div>
                </div>
              </div>
              <div className="text-black flex gap-2 justify-center items-center mb-2">
                <div className="w-80 border-2 border-zinc-700 rounded-lg h-14 flex justify-center items-center">
                  {generateRealTotal(
                    valueAddA,
                    valueAddB,
                    valueAddC,
                    valueAddD
                  )}
                </div>
              </div>
              <div className="w-full  flex justify-center items-center mt-2 mb-2">
                <div className="w-full h-1 bg-zinc-600 rounded"></div>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={saveSaldo}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Salvar
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Fechar Modal
                </button>
              </div>
            </div>
          </div>
        )}
        {error.messege &&
          <Messeger type={error.type} title={error.title} messege={error.messege} />
        }
        {loading && <Loading />}
      </div>
    </div>
  </Page>
);
}
