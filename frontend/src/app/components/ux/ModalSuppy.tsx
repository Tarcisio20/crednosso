"use client"

import { add } from "@/app/service/supply";
import { minusSaldoTreasury } from "@/app/service/treasury";
import { generateReal } from "@/app/utils/generateReal";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { atmType } from "@/types/atmType";
import { treasuryType } from "@/types/treasuryType";
import { useState } from "react";

type ModalSupplyType = {
  atmIndividual: atmType | undefined | null;
  onClose: () => void;
  treasury: treasuryType[] | undefined;
  onSave : () => void;
}

export const ModalSupply = (
  { atmIndividual, onClose, treasury, onSave }: ModalSupplyType) => {

  const [cassA, setCassA] = useState(0)
  const [cassB, setCassB] = useState(0)
  const [cassC, setCassC] = useState(0)
  const [cassD, setCassD] = useState(0)
  const [exchange, setExchage] = useState(false)

  const handleSave = async ()  => {
    if(cassA > 0 || cassB > 0 || cassC > 0 || cassD || 0){
     // const atm = await addBalanceInAtm(atmIndividual?.id_system as number, { cassete_A : cassA, cassete_B : cassB, cassete_C : cassC, cassete_D : cassD })
     const t = await minusSaldoTreasury(treasury?.[0].id_system as number, { bills_10 : cassA, bills_20 : cassB, bills_50 : cassC, bills_100 : cassD } )
      
     if(t.data.treasury.id && t.data.treasury.id > 0){
      let data = {
        id_atm : atmIndividual?.id_system as number,
        cassete_A : cassA,
        cassete_B : cassB,
        cassete_C : cassC,
        cassete_D : cassD,
        total_exchange : exchange
      }
      console.log("dENTRO DO CONSOLE DO T", data)
      const supplyReturn = await add(data)
      console.log(supplyReturn)
     }else{
      console.log("Error")
     }
     
    }

    onSave()

    /*const valueTreasury = ((treasury?.[0]?.bills_10 ??  0) * 10 ) + ((treasury?.[0]?.bills_20 ??  0) * 20)  +
    ((treasury?.[0]?.bills_50 ??  0) * 50) + ((treasury?.[0]?.bills_100 ??  0) * 100)
    const valueSuppy = (cassA * 10) + (cassB * 20) + (cassC * 50) + (cassD * 100)
    const total = valueTreasury - valueSuppy

    if(total === 0){
      onSaveFull()
    }else{
      onSave()
    }*/
  }

  return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-xl font-bold mb-4 text-black text-center uppercase">
        Abastecimento Terminal
      </h2>
      <p className="text-black text-center uppercase">ID ATM: {atmIndividual?.id_system}</p>
      <p className="text-black text-center uppercase">NOME ATM: {atmIndividual?.short_name}</p>
      <p className="text-black text-xl text-center uppercase">transportadora: {treasury ? treasury[0]?.name : 'Não Localizado'}</p>
      <div className="bg-slate-600 p-3">
        <div className="flex justify-center pl-4 pr-4 gap-8">
          <label className="w-32 ">R$ 10,00</label>
          <label className="w-32">{treasury ? treasury[0].bills_10 : ''}</label>
          <label className="w-32" >{treasury ? generateReal(treasury[0]?.bills_10 ?? 0, 10) : generateReal(0, 10)}</label>
        </div>
        <div className="flex justify-center pl-4 pr-4 gap-8">
          <label className="w-32 " >R$ 20,00</label>
          <label className="w-32" >{treasury ? treasury[0].bills_20 : ''}</label>
          <label className="w-32" >{treasury ? generateReal(treasury[0]?.bills_20 ?? 0, 20) : generateReal(0, 20)}</label>
        </div>
        <div className="flex justify-center pl-4 pr-4 gap-8">
          <label className="w-32" >R$ 50,00</label>
          <label className="w-32" >{treasury ? treasury[0].bills_50 : ''}</label>
          <label className="w-32" >{treasury ? generateReal(treasury[0]?.bills_50 ?? 0, 50) : generateReal(0, 50)}</label>
        </div>
        <div className="flex justify-center pl-4 pr-4 gap-8">
          <label className="w-32">R$ 100,00</label>
          <label className="w-32" >{treasury ? treasury[0].bills_100 : ''}</label>
          <label className="w-32" >{treasury ? generateReal(treasury[0]?.bills_100 ?? 0, 100) : generateReal(0, 100)}</label>
        </div>
        <div className="flex justify-center pl-4 pr-4 gap-8 text-xl text-red-300">
          <label className="w-32"  >Valor</label>
          <label className="w-32"  >---</label>
          <label className="w-32"  >{treasury ?
            generateRealTotal(treasury[0].bills_10 as number, treasury[0].bills_20 as number, treasury[0].bills_50 as number, treasury[0].bills_100 as number)
            :
            generateRealTotal(0, 0, 0, 0)
          }</label>
        </div>
      </div>
      <div className="w-full  flex justify-center items-center mt-2 mb-2">
        <div className="w-full h-1 bg-zinc-600 rounded"></div>
      </div>
      <div className="mb-4 flex flex-col w-full h-full gap-4 text-black">
        <div className="w-full flex items-center justify-center gap-2 ">
          <div className="w-20 text-center">R$ 10,00</div>
          <input
            className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
            value={cassA}
            onChange={(e) => {
              const inputValueA = e.target.value;
              const parsedValue = inputValueA === "" ? 0 : parseInt(inputValueA, 10);
              if(parseInt(inputValueA) > (treasury?.[0]?.bills_10 ?? 0)){
                setCassA(0);
              }else{
                setCassA(
                  parsedValue
                );
                
              }
            }}
          />
          <div className="">{generateReal(cassA, 10)}</div>
        </div>

        <div className="w-full flex items-center justify-center gap-2 ">
          <div className="w-20 text-center">R$ 20,00</div>
          <input
            className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
            value={cassB}
            onChange={(e) => {
              const inputValueB = e.target.value;
              const parsedValue = inputValueB === "" ? 0 : parseInt(inputValueB, 10);
              if(parseInt(inputValueB) > (treasury?.[0]?.bills_20 ?? 0)){
                setCassB(0);
              }else{
                setCassB(
                  parsedValue
                );
                
              }
            }}
          />
          <div>{generateReal(cassB, 20)}</div>
        </div>

        <div className="w-full flex items-center justify-center gap-2 ">
          <div className="w-20 text-center">R$ 50,00</div>
          <input
            className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
            value={cassC}
            onChange={(e) => {
              const inputValueC = e.target.value;
              const parsedValue = inputValueC === "" ? 0 : parseInt(inputValueC, 10);
              if(parseInt(inputValueC) > (treasury?.[0]?.bills_50 ?? 0)){
                setCassC(0);
              }else{
                setCassC(
                  parsedValue
                );
                
              }
            }}
          />
          <div>{generateReal(cassC, 50)}</div>
        </div>

        <div className="w-full flex items-center justify-center gap-2 ">
          <div className="w-20 text-center">R$ 100,00</div>
          <input
            className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
            value={cassD}
            onChange={(e) => {
              const inputValueD = e.target.value;
              const parsedValue = inputValueD === "" ? 0 : parseInt(inputValueD, 10);
              if(parseInt(inputValueD) > (treasury?.[0]?.bills_100 ?? 0)){
                setCassD(0);
              }else{
                setCassD(
                  parsedValue
                );
                
              }
            }}
          />
          <div>{generateReal(cassD, 100)}</div>
        </div>
      </div>
      <div className="text-black flex gap-2 justify-center items-center mb-2">
        <div className="w-80 border-2 border-zinc-700 rounded-lg h-14 flex justify-center items-center">
          {generateRealTotal(
            cassA,
            cassB,
            cassC,
            cassD
          )}
        </div>
      </div>
      <div className="w-full flex items-center justify-center gap-2 ">
        <input type="checkbox" checked={exchange} onChange={e=>setExchage(!exchange)} />
        <label className="text-black uppercase font-bold">Troca total</label>
      </div>
      <div className="w-full  flex justify-center items-center mt-2 mb-2">
        <div className="w-full h-1 bg-zinc-600 rounded"></div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Salvar
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
}