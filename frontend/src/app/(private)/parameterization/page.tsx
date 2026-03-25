"use client"

import CardCustomizer from "@/app/components/ui/CardCustomizer";
import ModalAddEmail from "@/app/components/ui/Modal/ModalAddEmail";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getAllEmailsControl, getAllEmailsControlForSlugTypeStore } from "@/app/service/parametrization";
import { getAll, getAllTypeStorePagination } from "@/app/service/type-store";
import { Button } from "@/components/ui/button";
import { typeStoreType } from "@/types/typeStoreType";
import { faAdd, faComputerMouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type EmailsControlType = {
    id: string,
    name: string,
    email: string,
    for_send_slug: string,
    status: string
}

export default function Parameterization() {

    const [typeStores, setTypeStores] = useState<typeStoreType[]>([]);
    const [typeStoreSlug, setTypeStoreSlug] = useState<string>("")
    const [emailsControlSelected, setEmailsControlSelected] = useState<EmailsControlType[]>([])


    const [loading, setLoading] = useState(false)
    const [modalEmail, setModalEmail] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const responseTypeStore = await getAll()
            if (responseTypeStore.typeStore && responseTypeStore.typeStore.length > 0) setTypeStores(responseTypeStore.typeStore)
            setLoading(false)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            setLoading(true)
            if (typeStoreSlug !== "") {
                const response = await getAllEmailsControlForSlugTypeStore(typeStoreSlug)
                console.log("response", response)
                if (response.data.parametrizationEmail.length > 0) {
                    setEmailsControlSelected(response.data.parametrizationEmail)
                    setLoading(false)
                } else {
                    setEmailsControlSelected([])
                    toast.error("Nenhum email cadastrado para esse tipo de loja")
                    setLoading(false)
                    return
                }
                setLoading(false)
            } else {
                setEmailsControlSelected([])
                setLoading(false)
            }
        })()
    }, [typeStoreSlug])

    const modalAddEmail = () => {
        setModalEmail(true)
    }

    const closeModalEmail = () => {
        setModalEmail(false)
    }

    return <Page>
        <TitlePages linkBack="/" icon={faComputerMouse}>
            Parametrização
        </TitlePages>
        <div className="flex flex-col gap-4 p-5 w-full">
            <CardCustomizer label="Emails de controle" description="Emails para quem os pedidos diariamente serao enviados."
                addButton={<Button className="bg-green-700 rounded-md hover:bg-green-600" onClick={modalAddEmail}>
                    <FontAwesomeIcon icon={faAdd} size="3x" color="#FFF" />
                </Button>} >
                <div className="flex flex-col gap-2 p-4 w-[200px] rounded">
                    <div className="text-2xl text-white ">Tipo de Loja</div>
                    <select
                        className="text-lg h-9 rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
                        value={typeStoreSlug}
                        onChange={e => setTypeStoreSlug(e.target.value)}
                    >
                        <option value="">Selecione o tipo de loja</option>
                        {typeStores.map((typeStore, index) => (
                            <option className="uppercase bg-slate-700 text-white" key={index} value={typeStore.slug}>{typeStore.name}</option>
                        ))}
                    </select>
                </div>
                {emailsControlSelected.length > 0 && (
                    <div className="flex flex-col gap-2 p-4 w-full bg-zinc-800 rounded-md">
                        <div className="text-2xl text-white ">Contatos</div>
                        {emailsControlSelected.map((item, index) => (
                            console.log("email", item),
                            <div key={index} className="flex flex-col gap-2 text-lg rounded-md outline-none  w-fit text-white">
                                <label>Nome: {item.name || ""}</label>
                                <label> Email: {item.email}</label>
                                <label>Tipo de loja: {item.for_send_slug}</label>
                            </div>
                        ))}
                    </div>
                )}
            </CardCustomizer>
        </div>
        {loading && <Loading />}
        {modalEmail && <ModalAddEmail close={closeModalEmail} />}
    </Page>
}