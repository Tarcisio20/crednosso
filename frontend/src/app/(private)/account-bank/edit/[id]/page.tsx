"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages"
import { getAccountBankFronId, update } from "@/app/service/account-bank";
import {
  faLandmark,
  faPenToSquare,
  faVault,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AccountBankEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [nameAccount, setNameAccount] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [bankBranchDigit, setBankBranchDigit] = useState("");
  const [account, setAccount] = useState("");
  const [accountDigit, setAccountDigit] = useState("");
  const [statusAccount, setStatusAccount] = useState(true);


  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false);

  const getAccountBankById = useCallback(async () => {
    setLoading(true);

    const accountOne = await getAccountBankFronId(id as string);
    if (accountOne.status === 300 || accountOne.status === 400 || accountOne.status === 500) {
      setLoading(false);
      toast.error('Erro na requisição, tente novamente');
      return;
    }

    if (accountOne.data != undefined && accountOne.data.account.id > 0) {
      setNameAccount(accountOne.data.account.name);
      setBankBranch(accountOne.data.account.bank_branch);
      setBankBranchDigit(accountOne.data.account.bank_branch_digit);
      setAccount(accountOne.data.account.account);
      setAccountDigit(accountOne.data.account.account_digit);
      setStatusAccount(accountOne.data.account.status);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      toast.error('Sem dados a mostrar, atualize e tente novamente');
      return;
    }


  }, [id])

  useEffect(() => {
    if (!id) {
      router.push("/account-bank");
      return;
    }

    document.title = "Conta Bancária - Add | CredNosso";
    getAccountBankById()
  }, [id, router, getAccountBankById]);


  const updateAccount = async () => {
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
      status: statusAccount
    };

    const editAccount = await update(parseInt(id as string), data)
    if (editAccount.status === 300 || editAccount.status === 400 || editAccount.status === 500) {
      setLoading(false);
      toast.error('Erro na requisição, tente novamente');
      return;
    }

    if (editAccount.data !== undefined && editAccount.data.account.id > 0) {
      getAccountBankById();
      setLoading(false);
      toast.success('Conta Bancária atualizada com sucesso!');
      return;
    }
    setLoading(false);
    toast.error('Erro ao atualizar, tente novamente');
    return
  }

  // const addAccount = async () => {

  //   setError({ type: '', title: '', messege: '' })
  //   setLoading(false);
  //   setLoading(true);
  //   if (nameAccount === "" || bankBranch === "" || bankBranchDigit === "" || account === "" || accountDigit === "") {
  //     console.log("Dentro do if")
  //     setError({ type: 'error', title: 'Error', messege: 'Para continuar, Prencher todos os campos' })
  //     setLoading(false);
  //     return;
  //   }

  //   const data = {
  //     name: nameAccount.trim().toUpperCase(),
  //     bank_branch: bankBranch.trim(),
  //     bank_branch_digit: bankBranchDigit.trim(),
  //     account: account.trim(),
  //     account_digit: accountDigit.trim(),
  //   };

  //   const addNewAccount = await add(data);

  //   if (addNewAccount.data !== undefined && addNewAccount.data.account.id > 0) {
  //     setError({ type: 'success', title: 'Success', messege: 'Conta Bancária Salva com sucesso!' })
  //     setNameAccount("");
  //     setBankBranch("");
  //     setBankBranchDigit("");
  //     setAccount("");
  //     setAccountDigit("10");
  //     setLoading(false);
  //     return;
  //   } else {
  //     setError({ type: 'error', title: 'Error', messege: 'Erro ao salvar, atualize e tente novamente' })
  //     setLoading(false);
  //     return;
  //   }
  // };


  return (
    <Page>
      <TitlePages linkBack="/account-bank" icon={faPenToSquare}>
        Editar Conta Bancária
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


          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-5"></div>
            <Button
              color="#2E8B57"
              onClick={updateAccount}
              size="meddium"
              textColor="white"
              secondaryColor="#81C784"
            >
              Editar
            </Button>

            {error.messege &&
              <Messeger type={error.type} title={error.title} messege={error.messege} />
            }
            {loading && <Loading />}
          </div>
        </div>

      </div>
    </Page>
  );
}
