"use client"

import { Page } from "@/app/components/ux/Page";
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { TitlePages } from "@/app/components/ux/TitlePages";
import { useState } from "react";
import { Button } from "@/app/components/ui/Button";

export default function Order() {

    const [typeOperation, setTypeOperation] = useState('')
    const [idTypeOperation, setIdTypeOperation] = useState('')
    const [treasuryOrigin, setTreasuryOrigin] = useState('')
    const [idTreasuryOrigin, setIdTreasuryOrigin] = useState('')
    const [treasuryDestin, setTreasuryDestin] = useState('')
    const [idTreasuryDestin, setIdTreasuryDestin] = useState('')
    const [typeOrder, setTypeOrder] = useState('')
    const [idTypeOrder, setIdTypeOrder] = useState('')

    return (
        <Page>
            <TitlePages linkBack="/order" icon={faCoins} >Pedidos</TitlePages>
            <div className="flex flex-row gap-4 p-5 w-full">
                <div className="flex flex-col gap-5 w-1/3">
                    <label className="uppercase leading-3 font-bold">Tipo de Operação</label>
                    <div className="flex gap-2">
                        <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
                            <input
                                value={idTypeOperation}
                                onChange={e => setIdTypeOperation(e.target.value)}
                                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                            />
                        </div>
                        <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                            <select
                                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                                value={typeOperation}
                                onChange={e => setTypeOperation(e.target.value)}
                            >
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="1" >
                                    Tipo de Operação 1
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="2" >
                                    Tipo de Operação 2
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="3" >
                                    Tipo de Operação 3
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="4" >
                                    Tipo de Operação 4
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="5" >
                                    Tipo de Operação 5
                                </option>
                            </select>
                        </div>
                    </div>

                    <label className="uppercase leading-3 font-bold">Origem</label>
                    <div className="flex gap-2">
                        <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
                            <input
                                value={treasuryOrigin}
                                onChange={e => setTreasuryOrigin(e.target.value)}
                                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                            />
                        </div>
                        <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                            <select
                                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                                value={typeOperation}
                                onChange={e => setTypeOperation(e.target.value)}
                            >
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="1" >
                                    Transportadora 1
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="2" >
                                    Transportadora 2
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="3" >
                                    Transportadora 3
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="4" >
                                    Transportadora 4
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="5" >
                                    Transportadora 5
                                </option>
                            </select>
                        </div>
                    </div>

                    <label className="uppercase leading-3 font-bold">Destino</label>
                    <div className="flex gap-2">
                        <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
                            <input
                                value={treasuryOrigin}
                                onChange={e => setTreasuryOrigin(e.target.value)}
                                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                            />
                        </div>
                        <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                            <select
                                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                                value={typeOperation}
                                onChange={e => setTypeOperation(e.target.value)}
                            >
                                <option value="0"></option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="1" >
                                    Transportadora 1
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="2" >
                                    Transportadora 2
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="3" >
                                    Transportadora 3
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="4" >
                                    Transportadora 4
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="5" >
                                    Transportadora 5
                                </option>
                            </select>
                        </div>
                    </div>

                    <label className="uppercase leading-3 font-bold">Data</label>
                    <div className="flex gap-2">
                        <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-4/6 text-lg">
                            <input
                                type="date"
                                value={treasuryOrigin}
                                onChange={e => setTreasuryOrigin(e.target.value)}
                                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                            />
                        </div>
                    </div>


                    <label className="uppercase leading-3 font-bold">Tipo de Operação</label>
                    <div className="flex gap-2">
                        <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-16 text-lg">
                            <input
                                value={treasuryOrigin}
                                onChange={e => setTreasuryOrigin(e.target.value)}
                                className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full"
                            />
                        </div>
                        <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 w-96 h-11 text-lg`} >
                            <select
                                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                                value={typeOrder}
                                onChange={e => setTypeOrder(e.target.value)}
                            >
                                <option value="0"></option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="1" >
                                    Tipo de Pedido 1
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="2" >
                                    Tipo de Pedido 2
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="3" >
                                    Tipo de Pedido 3
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="4" >
                                    Tipo de Pedido 4
                                </option>
                                <option
                                    className="uppercase bg-slate-700 text-white"
                                    value="5" >
                                    Tipo de Pedido 5
                                </option>
                            </select>
                        </div>
                    </div>

                </div>
                <div className="flex flex-col gap-5 w-1/3">
                    <label className="uppercase leading-3 font-bold">Valor Solicitação</label>
                    <div className="flex gap-3 items-center">
                        <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-40 text-lg flex justify-center items-center" >R$ 10,00</label>
                        <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-28 text-lg">
                            <input className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full flex justify-center items-center" />
                        </div>
                        <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 flex-1 text-lg flex justify-center items-center">R$ 0,00</label>
                    </div>

                    <div className="flex gap-3 items-center">
                        <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-40 text-lg flex justify-center items-center" >R$ 20,00</label>
                        <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-28 text-lg">
                            <input className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full flex justify-center items-center" />
                        </div>
                        <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 flex-1 text-lg flex justify-center items-center">R$ 0,00</label>
                    </div>

                    <div className="flex gap-3 items-center">
                        <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-40 text-lg flex justify-center items-center" >R$ 50,00</label>
                        <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-28 text-lg">
                            <input className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full flex justify-center items-center" />
                        </div>
                        <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 flex-1 text-lg flex justify-center items-center">R$ 0,00</label>
                    </div>

                    <div className="flex gap-3 items-center">
                        <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-40 text-lg flex justify-center items-center" >R$ 100,00</label>
                        <div className="flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 w-28 text-lg">
                            <input className=" m-0 p-0 text-white bg-transparent outline-none text-center text-lg w-full flex justify-center items-center" />
                        </div>
                        <label className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600 h-11 flex-1 text-lg flex justify-center items-center">R$ 0,00</label>
                    </div>
                </div>
                <div className="flex flex-col gap-5 w-1/3">
                    <label className="uppercase leading-3 font-bold">Observações</label>
                    <textarea className="bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 outline-none border-slate-600 h-5 flex-1 text-lg flex justify-center items-center" ></textarea>
                </div>
            </div>
            <div className="mt-5">
                <Button  color="#2E8B57" onClick={()=>{}} size="large"  textColor="white" secondaryColor="#81C784"  >Salvar</Button>
                <Button  color="#2E8B57" onClick={()=>{}} size="large"  textColor="white" secondaryColor="#81C784"  >Salvar</Button>
            </div>
        </Page>
    );
}
