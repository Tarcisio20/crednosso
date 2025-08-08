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
  onSave: () => void;
};

export const ModalSupply = ({ atmIndividual, onClose, treasury, onSave }: ModalSupplyType) => {
  const [cassA, setCassA] = useState(0);
  const [cassB, setCassB] = useState(0);
  const [cassC, setCassC] = useState(0);
  const [cassD, setCassD] = useState(0);
  const [exchange, setExchage] = useState(false);

  const handleSave = async () => {
    if (cassA > 0 || cassB > 0 || cassC > 0 || cassD > 0) {
      const t = await minusSaldoTreasury(treasury?.[0].id_system as number, {
        bills_10: cassA,
        bills_20: cassB,
        bills_50: cassC,
        bills_100: cassD,
      });

      if (t.data.treasury.id && t.data.treasury.id > 0) {
        const data = [{
          id_atm: atmIndividual?.id_system as number,
          cassete_A: cassA,
          cassete_B: cassB,
          cassete_C: cassC,
          cassete_D: cassD,
          total_exchange: exchange,
        }];
        await add(data as []); 
      } else {
        console.log("Error");
      }
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4 text-black text-center uppercase">Abastecimento Terminal</h2>
        <p className="text-black text-center uppercase">ID ATM: {atmIndividual?.id_system}</p>
        <p className="text-black text-center uppercase">NOME ATM: {atmIndividual?.short_name}</p>
        <p className="text-black text-xl text-center uppercase">
          transportadora: {treasury ? treasury[0]?.name : 'Não Localizado'}
        </p>
        <div className="bg-slate-600 p-3">
          {[10, 20, 50, 100].map((value, index) => {
            const bills = treasury ? treasury[0][`bills_${value}` as keyof treasuryType] : 0;
            return (
              <div key={value} className="flex justify-center pl-4 pr-4 gap-8">
                <label className="w-32">R$ {value},00</label>
                <label className="w-32">{bills}</label>
                <label className="w-32">{generateReal(bills as number, value)}</label>
              </div>
            );
          })}
          <div className="flex justify-center pl-4 pr-4 gap-8 text-xl text-red-300">
            <label className="w-32">Valor</label>
            <label className="w-32">---</label>
            <label className="w-32">
              {treasury
                ? generateRealTotal(
                    treasury[0].bills_10 ?? 0,
                    treasury[0].bills_20 ?? 0,
                    treasury[0].bills_50 ?? 0,
                    treasury[0].bills_100 ?? 0
                  )
                : generateRealTotal(0, 0, 0, 0)}
            </label>
          </div>
        </div>
        <div className="w-full flex justify-center items-center mt-2 mb-2">
          <div className="w-full h-1 bg-zinc-600 rounded"></div>
        </div>

        {[{ label: "R$ 10,00", value: cassA, setter: setCassA, max: treasury?.[0]?.bills_10 ?? 0, mult: 10 },
          { label: "R$ 20,00", value: cassB, setter: setCassB, max: treasury?.[0]?.bills_20 ?? 0, mult: 20 },
          { label: "R$ 50,00", value: cassC, setter: setCassC, max: treasury?.[0]?.bills_50 ?? 0, mult: 50 },
          { label: "R$ 100,00", value: cassD, setter: setCassD, max: treasury?.[0]?.bills_100 ?? 0, mult: 100 }
        ].map(({ label, value, setter, max, mult }) => (
          <div key={label} className="w-full flex items-center justify-center gap-2">
            <div className="w-20 text-center">{label}</div>
            <input
              className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
              value={value}
              onChange={(e) => {
                const input = e.target.value;
                const parsed = input === "" ? 0 : parseInt(input, 10);
                setter(parsed > max ? 0 : parsed);
              }}
            />
            <div>{generateReal(value, mult)}</div>
          </div>
        ))}

        <div className="text-black flex gap-2 justify-center items-center mb-2">
          <div className="w-80 border-2 border-zinc-700 rounded-lg h-14 flex justify-center items-center">
            {generateRealTotal(cassA, cassB, cassC, cassD)}
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-2">
          <input type="checkbox" checked={exchange} onChange={() => setExchage(!exchange)} />
          <label className="text-black uppercase font-bold">Troca total</label>
        </div>

        <div className="w-full flex justify-center items-center mt-2 mb-2">
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
  );
};