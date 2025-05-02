"use client"

import { saveAllSupplies } from "@/app/service/supply";
import { useEffect, useState } from "react";
import { Messeger } from "./Messeger";
import { Loading } from "./Loading";

type atmPage = {
    id_atm: number;
    id_treasury: number;
    name: string;
    short_name: string;
    check: boolean;
    type: 'COMPLEMENTAR' | 'RECOLHIMENTO TOTAL' | 'TROCA TOTAL';
    cass_A: number;
    cass_B: number;
    cass_C: number;
    cass_D: number;
  }

type ModalTrocaTotalType = {
  atms: atmPage[];
  onClose: () => void;
}

export const ModalTrocaTotal = ({ atms, onClose }: ModalTrocaTotalType) => {

    const [localAtms, setLocalAtms] = useState(atms);
    const [error, setError] = useState({ type: '', title: '', messege: '' })
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        setLocalAtms(atms);
    },[atms])

    const handleCheckboxChange = (index: number, checked: boolean) => {
        const updated = [...localAtms];
        updated[index] = { ...updated[index], check: checked,  type: checked ? "TROCA TOTAL" : "COMPLEMENTAR", };
        setLocalAtms(updated);
      };
    
    const handleSave = async () => {
      setError({ type: '', title: '', messege: '' })
      setLoading(true)
        const s = await saveAllSupplies(localAtms)
        if(s.status === 300 || s.status === 400 || s.status === 500){
          setError({ type: 'error', title: 'Error', messege: 'Erro na requisição' })
          setLoading(false)
        }
        if(s.data !== undefined && s.data.supply.id  > 0){
          setLoading(false)
          onClose()
        }else{
          setError({ type: 'error', title: 'Error', messege: 'Erro ao Salvar' })
          setLoading(false)
        }
    }

  return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-xl font-bold mb-4 text-black text-center uppercase">
        Trocas totais
      </h2>
      <div className="bg-slate-600 p-3 rounded-md">
        <div className="flex flex-col justify-center items-center pl-4 pr-4 gap-4">
        {atms && atms.map((item, key)=>(
            <div key={key} className="flex gap-2 uppercase">
                <input type="checkbox" onChange={(e) =>
                      handleCheckboxChange(key, e.target.checked)
                    } />
                <label>Deseja trocar o terminal {item.id_atm} - {item.name}?</label>
            </div>
        ))}
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-3">
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
      {error.messege &&
        <Messeger type={error.type} title={error.title} messege={error.messege} />
      }
      {loading &&
        <Loading />
      }
    </div>
  </div>
}