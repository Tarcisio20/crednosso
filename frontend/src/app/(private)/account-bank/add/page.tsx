"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages"
import { add } from "@/app/service/account-bank";

import {
  faAdd,
  faLandmark,
  faVault,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AccountBankAdd() {

  const [nameAccount, setNameAccount] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [bankBranchDigit, setBankBranchDigit] = useState("");
  const [account, setAccount] = useState("");
  const [accountDigit, setAccountDigit] = useState("");
  const [typeAccount, setTypeAccount] = useState("mateus");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Atm - Add | CredNosso";
  }, []);

  const addAccount = async () => {

    setLoading(true);
    if (nameAccount === "" || bankBranch === "" || bankBranchDigit === "" || account === "" || accountDigit === "") {
      setLoading(false);
      toast.error('Para continuar, Prencher todos os campos');
      return;
    }

    const data = {
      name: nameAccount.trim().toUpperCase(),
      bank_branch: bankBranch.trim(),
      bank_branch_digit: bankBranchDigit.trim(),
      account: account.trim(),
      account_digit: accountDigit.trim(),
      type: typeAccount.toLowerCase(),
      hash: bankBranch + bankBranchDigit + account + accountDigit
    };

    const addNewAccount = await add(data);

    if (addNewAccount.data !== undefined && addNewAccount.data.account.id > 0) {
      setNameAccount("");
      setBankBranch("");
      setBankBranchDigit("");
      setAccount("");
      setAccountDigit("");
      setTypeAccount("mateus");
      setLoading(false);
      toast.success('Conta Bancária Salva com sucesso!');
      return;
    } else {
      setLoading(false);
      toast.error('Erro ao salvar, atualize e tente novamente');
      return;
    }
  };



  return (
    <Page>
      <TitlePages linkBack="/account-bank" icon={faAdd}>
        Adicionar Conta Bancária
      </TitlePages>
      <div className="flex flex-row gap-8 p-5 w-full">
        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">Nome do banco</label>
            <Input
              color="#DDDD"
              placeholder="Digite o nomedo Banco"
              size="extra-large"
              value={nameAccount}
              onChange={(e) => setNameAccount(e.target.value)}
              icon={faLandmark}
            />
          </div>
          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">
              N agencia
            </label>
            <Input
              color="#DDDD"
              placeholder="Digite o número da conta"
              size="extra-large"
              value={bankBranch}
              onChange={(e) => setBankBranch(e.target.value)}
              icon={faVault}
            />
          </div>
          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">Nº Digito da Agencia</label>
            <Input
              color="#DDDD"
              placeholder="Digite o numero da agencia da conta"
              size="extra-large"
              value={bankBranchDigit}
              onChange={(e) => setBankBranchDigit(e.target.value)}
              icon={faVault}
            />
          </div>

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">
              N Conta
            </label>
            <Input
              color="#DDDD"
              placeholder="Digite o número da conta"
              size="extra-large"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              icon={faVault}
            />
          </div>
          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">Nº Digito da conta</label>
            <Input
              color="#DDDD"
              placeholder="Digite o numero do gigito da agencia"
              size="extra-large"
              value={accountDigit}
              onChange={(e) => setAccountDigit(e.target.value)}
              icon={faVault}
            />
          </div>

          <div className="flex flex-col gap-5">
            <label className="uppercase leading-3 font-bold">Empresa Vinculada</label>
            <div
              className={`flex bg-slate-700 pt-1 pb-1 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`}
            >
              <select
                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg uppercase"
                value={typeAccount}
                onChange={(e) => setTypeAccount(e.target.value)}
              >
                <option className="uppercase bg-slate-700 text-white" value="mateus">
                  Mateus
                </option>
                <option className="uppercase bg-slate-700 text-white" value="posterus">
                  Posterus
                </option>
              </select>
            </div>
          </div>


          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-5"></div>
            <Button
              color="#2E8B57"
              onClick={addAccount}
              size="medium"
              textColor="white"
              variant="primary"
            >
              Cadastrar
            </Button>
            {loading && <Loading />}
          </div>
        </div>
      </div>
    </Page>
  );
}
