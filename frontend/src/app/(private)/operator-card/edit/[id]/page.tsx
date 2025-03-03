"use client";

import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faIdBadge, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/app/components/ui/Button";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { getAll } from "@/app/service/treasury";
import { treasuryType } from "@/types/treasuryType";
import { getCardOperatorById, update } from "@/app/service/card-operator";
import { cardOperatorType } from "@/types/cardOperatorType";
import { validateField } from "@/app/utils/validateField";

export default function OperationCardEdit() {

  const { id } = useParams()
  const router = useRouter()

  const [treasuries, setTreasuries] = useState<treasuryType[]>()
  const [idTreasury, setIdTreasury] = useState('0')
  const [nameOperatorCard, setNameOperatorCard] = useState('')
  const [numOperatorCard, setNumOperatorCard] = useState('')
  const [statusOperatorCard, setStatusOperatorCard] = useState(true)

  const [cardOperator, setCardOperator] = useState<cardOperatorType>()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    allLOadings()
  }, [id])

  const allLOadings = async () => {
    await getAllTreasuries()
    await getById()
  }

  const getAllTreasuries = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const allTreasuries = await getAll()
    if (allTreasuries.data.treasury && allTreasuries.data.treasury[0]?.id) {
      setTreasuries(allTreasuries.data.treasury)
      setIdTreasury(allTreasuries.data.treasury[0].id)
      setLoading(false)
      return
    } else {
      setError('Erro ao carregar dados')
      setLoading(false)
      return
    }
  }

  const getById = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const cOperator = await getCardOperatorById(id as string)
    if (cOperator.data.cardOperator && cOperator.data.cardOperator?.id) {
      setCardOperator(cOperator.data.cardOperator)
      setNameOperatorCard(cOperator.data.cardOperator.name)
      setNumOperatorCard(cOperator.data.cardOperator.number_card)
      setIdTreasury(cOperator.data.cardOperator.id_treasury)
      setStatusOperatorCard(cOperator.data.cardOperator.status)
      setLoading(false)
      return
    } else {
      setError("Erro ao carregar dados")
      setLoading(false)
      return
    }
  }

  const editCardOperator = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    if (
      idTreasury === '' || idTreasury === '0' || !validateField(nameOperatorCard) || !validateField(numOperatorCard)
    ) {
      setError('Prrencha todos os campos')
      setLoading(false)
      return
    }

    let data = {
      id_treasury: parseInt(idTreasury),
      name: nameOperatorCard.toUpperCase(),
      number_card: numOperatorCard,
      status: statusOperatorCard
    }

    const editedCardOperator = await update(parseInt(id as string), data)
    if (editedCardOperator.data.cardOperator.id) {
      setLoading(false)
      allLOadings()
      return
    } else {
      setError("Erro ao editar")
      setLoading(false)
      return
    }

  }



  return (
    <Page>
      <TitlePages linkBack="/operator-card" icon={faPenToSquare} >Editar Cartão Operador</TitlePages>
      <div className="flex flex-col gap-4 p-5 w-full">
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Transportadora</label>
          <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
              value={idTreasury}
              onChange={e => setIdTreasury(e.target.value)}
            >
              {treasuries && treasuries.map((item, index) => (
                <option
                  className="uppercase bg-slate-700 text-white"
                  value={item.id} key={index} >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Nome</label>
          <Input color="#DDDD" placeholder="Digite o número do cartão" size="extra-large"
            value={nameOperatorCard} onChange={(e) => setNameOperatorCard(e.target.value)} icon={faIdBadge} />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Número Cartão</label>
          <Input color="#DDDD" placeholder="Digite o número do cartão" size="extra-large"
            value={numOperatorCard} onChange={(e) => setNumOperatorCard(e.target.value)} icon={faIdBadge} />
        </div>
        <div className="flex flex-col gap-5">
          <label className="uppercase leading-3 font-bold">Status</label>
          <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
            <select
              className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg uppercase"
              value={statusOperatorCard ? "true" : "false"}
              onChange={e => setStatusOperatorCard(e.target.value === "true")}
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
          <Button color="#2E8B57" onClick={editCardOperator} size="meddium" textColor="white" secondaryColor="#81C784">Editar</Button>
        </div>
        {error &&
          <div>
            <p className="text-white">{error}</p>
          </div>
        }
        {loading &&
          <Loading />
        }
      </div>
    </Page>
  );
}
