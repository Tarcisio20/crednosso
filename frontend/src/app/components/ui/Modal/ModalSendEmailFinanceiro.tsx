"use client"

import { addEmailControl, sendEmailFinanceiro } from "@/app/service/parametrization";
import { getAll as getAllTypeStore } from "@/app/service/type-store";
import { isValidEmail } from "@/app/utils/emailValidator";
import { typeStoreType } from "@/types/typeStoreType";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ModalSendEmailFinanceiroType = {
    close: () => void;
}
export default function ModalSendEmailFinanceiro({ close }: ModalSendEmailFinanceiroType) {

    useEffect(()=>{
        (async()=>{
            const response = await getAllTypeStore()
            if(response.typeStore){
                setTypeStoreList(response.typeStore)
                setTypeStoreSlug(response.typeStore[0].slug ?? "");
            }
            console.log("response", response)
        })()
    },[])


    const [date, setDate] = useState('')
    const [typeStoreSlug, setTypeStoreSlug] = useState('');

    const [loading, setLoading] = useState(false)
    const [typeStoreList, setTypeStoreList] = useState<typeStoreType[]>([]);


    const handleSend = async ()  => {
        setLoading(true)
       
        const payload = {
            date,
            for_send_slug : typeStoreSlug
        }
        console.log("payload", payload)
        const responseSend = await sendEmailFinanceiro(payload)
        if(responseSend.statuss === 300 || responseSend.status === 400 || responseSend.status === 500){
            toast.error("Erro ao adicionar email!")
            setLoading(false)
            return
        }
        toast.success("Contato cadastrado com sucesso!")
        setLoading(false)
    }

    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-zinc-900 p-6 rounded-xl shadow-lg w-11/12 max-w-5xl border border-zinc-700">
            <h2 className="text-lg font-bold mb-4 text-center uppercase text-zinc-200">
                Enviar E-mail Para Financeiro
            </h2>
            <div className="flex flex-col gap-2 p-4 bg-zinc-800 w-full rounded">
                <div className="text-2xl text-white w-[90px]">Data</div>
                <input
                    className="text-lg h-9 rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 p-4 bg-zinc-800 w-full rounded">
                <div className="text-2xl text-white ">Tipo de Loja</div>
                <select  
                className="text-lg h-9 rounded-md outline-none border-2 border-zinc-200 bg-zinc-600 text-center text-white"
                value={typeStoreSlug}
                onChange={e => setTypeStoreSlug(e.target.value)}
                >
                    {typeStoreList.map((typeStore, index) => (
                        <option className="uppercase bg-slate-700 text-white" key={index}value={typeStore.slug}>{typeStore.name}</option>
                    ))}
                </select>
            </div>



            <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={handleSend}
                    className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
                >
                    Confirmar
                </button>

                <button
                    onClick={close}
                    className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
                >
                    Cancelar
                </button>
            </div>
        </div>
    </div>
}