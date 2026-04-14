"use client"

import { ButtonScreenOrder } from "@/app/components/ui/ButtonScreenOrder"
import CardCustomizer from "@/app/components/ui/CardCustomizer"
import ModalAddEmail from "@/app/components/ui/Modal/ModalAddEmail"
import ModalSendEmailFinanceiro from "@/app/components/ui/Modal/ModalSendEmailFinanceiro"
import { Loading } from "@/app/components/ux/Loading"
import { Page } from "@/app/components/ux/Page"
import { TitlePages } from "@/app/components/ux/TitlePages"
import { getAllEmailsControlForSlugTypeStore } from "@/app/service/parametrization"
import { getAll } from "@/app/service/type-store"
import { Button } from "@/components/ui/button"
import { typeStoreType } from "@/types/typeStoreType"
import { faAdd, faComputerMouse, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type EmailsControlType = {
  id: string
  name: string
  email: string
  for_send_slug: string
  status: string
}

export default function Parameterization() {
  const [typeStores, setTypeStores] = useState<typeStoreType[]>([])
  const [typeStoreSlug, setTypeStoreSlug] = useState<string>("")
  const [emailsControlSelected, setEmailsControlSelected] = useState<EmailsControlType[]>([])

  const [loading, setLoading] = useState(false)
  const [modalEmail, setModalEmail] = useState(false)
  const [modalSendEmail, setModalSendEmail] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const responseTypeStore = await getAll()
      if (responseTypeStore.typeStore && responseTypeStore.typeStore.length > 0) {
        setTypeStores(responseTypeStore.typeStore)
      }
      setLoading(false)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      setLoading(true)

      if (typeStoreSlug !== "") {
        const response = await getAllEmailsControlForSlugTypeStore(typeStoreSlug)

        if (response.data.parametrizationEmail.length > 0) {
          setEmailsControlSelected(response.data.parametrizationEmail)
        } else {
          setEmailsControlSelected([])
          toast.error("Nenhum email cadastrado para esse tipo de loja")
        }
      } else {
        setEmailsControlSelected([])
      }

      setLoading(false)
    })()
  }, [typeStoreSlug])

  const modalAddEmail = () => {
    setModalEmail(true)
  }

  const closeModalEmail = () => {
    setModalEmail(false)
  }

  const handleModalSendEmail = () => {
    setModalSendEmail(true)
  }

  return (
    <Page>
      <TitlePages linkBack="/" icon={faComputerMouse}>
        Parametrização
      </TitlePages>

      <div className="flex w-full flex-col gap-4 p-5">
        <ButtonScreenOrder color="#415eff" onClick={handleModalSendEmail} size="btn-icon-text"
                  textColor="white" secondaryColor="#546bec" icon={faEnvelope}
                >Pedido Para Financeiro</ButtonScreenOrder>
      </div>

      <div className="flex w-full flex-col gap-4 p-5">
        <CardCustomizer
          label="Emails de controle"
          description="Emails para quem os pedidos diariamente serao enviados."
          addButton={
            <Button
              className="rounded-md bg-green-700 hover:bg-green-600"
              onClick={modalAddEmail}
            >
              <FontAwesomeIcon icon={faAdd} size="lg" color="#FFF" />
            </Button>
          }
        >
          <div className="flex w-full flex-col gap-4 p-4">
            <div className="flex w-full max-w-[220px] flex-col gap-2">
              <div className="text-2xl text-white">Tipo de Loja</div>

              <select
                className="h-9 rounded-md border-2 border-zinc-200 bg-zinc-600 text-center text-lg text-white outline-none"
                value={typeStoreSlug}
                onChange={(e) => setTypeStoreSlug(e.target.value)}
              >
                <option value="">Selecione o tipo de loja</option>
                {typeStores.map((typeStore, index) => (
                  <option
                    className="bg-slate-700 text-white uppercase"
                    key={index}
                    value={typeStore.slug}
                  >
                    {typeStore.name}
                  </option>
                ))}
              </select>
            </div>

            {emailsControlSelected.length > 0 ? (
              <div className="w-full overflow-hidden rounded-md border border-zinc-700">
                <div className="max-h-[380px] w-full overflow-y-auto overflow-x-auto">
                  <table className="w-full table-fixed text-left text-white">
                    <thead className="sticky top-0 z-10 bg-[#020817] border-b border-zinc-700">
                      <tr>
                        <th className="w-[35%] p-4">Nome</th>
                        <th className="w-[45%] p-4">Email</th>
                        <th className="w-[20%] p-4">Tipo de loja</th>
                      </tr>
                    </thead>

                    <tbody>
                      {emailsControlSelected.map((item, index) => (
                        <tr key={index} className="border-b border-zinc-700">
                          <td className="break-words p-4 align-top">{item.name}</td>
                          <td className="break-words p-4 align-top">{item.email}</td>
                          <td className="break-words p-4 align-top uppercase">
                            {item.for_send_slug}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
                <div className="flex w-full animate-pulse items-center justify-center rounded-md border border-zinc-700 bg-[#020817] p-4 text-lg text-white">
                  Nenhum email cadastrado para esse tipo de loja
                </div>
            )}
          </div>
        </CardCustomizer>
      </div>

      {loading && <Loading />}
      {modalEmail && <ModalAddEmail close={closeModalEmail} />}
      {modalSendEmail && <ModalSendEmailFinanceiro close={() => setModalSendEmail(false)} />}
    </Page>
  )
}