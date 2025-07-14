"use client"

import { generateReal } from "@/app/utils/generateReal";
import { generateRealTotal } from "@/app/utils/generateRealTotal";
import { generateValueTotal } from "@/app/utils/generateValueTotal";
import { orderType } from "@/types/orderType";
import { toast } from "sonner";

type ModalConfirmPartialType = {
  oIndividual : orderType;
  valueAdd : { a : number, b : number, c :number , d : number }
  setValueAddA : (newValue : number) => void;
  setValueAddB : (newValue : number) => void;
  setValueAddC : (newValue : number) => void;
  setValueAddD : (newValue : number) => void;
  onClose : ()=> void;
  onSave : ()=> void;
  error : string
}

export const ModalConfirmPartial  = (
  { oIndividual, valueAdd, setValueAddA, setValueAddB, setValueAddC, setValueAddD, onClose, onSave, error } : ModalConfirmPartialType) => {
    
      const requeredValue = generateRealTotal(oIndividual.requested_value_A as number, oIndividual.requested_value_B as number,
        oIndividual.requested_value_C as number, oIndividual.requested_value_D as number) 

        const handleSaveValues = () => {
          const totalConfirmed = (valueAdd.a * 10) + (valueAdd.b * 20) +  (valueAdd.c * 50)  +  (valueAdd.d * 100)
          const totalSolicited = (oIndividual.requested_value_A as number * 10) + (oIndividual.requested_value_B as number * 20) +  (oIndividual.requested_value_C as number * 50)  +  (oIndividual.requested_value_D as number * 100)
          if(totalConfirmed > totalSolicited){
            toast.error("Valor total confirmado maior que o solicitado, tente novamente")
          }else{
            onSave()
          }
        }

    return  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-4 text-black text-center uppercase">
                  Alterar Pedido
                </h2>
                <p className="text-black text-center">ID Pedido: {oIndividual?.id}</p>
                <p className="text-black text-xl text-center">
                  Valor do pedido atual:{" "}
                  {requeredValue === "" ? "R$ 0,00" : `R$ ${requeredValue}`  }
                </p>
                <div className="w-full  flex justify-center items-center mt-2 mb-2">
                  <div className="w-full h-1 bg-zinc-600 rounded"></div>
                </div>
                <div className="mb-4 flex flex-col w-full h-full gap-4 text-black">
                  <div className="w-full flex items-center justify-center gap-2 ">
                    <div className="w-20 text-center">R$ 10,00</div>
                    <input
                      className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                      value={valueAdd.a}
                      onChange={(e) => {
                        const inputValueA = e.target.value;
                        setValueAddA(
                          inputValueA === "" ? 0 : parseInt(inputValueA)
                        );
                      }}
                    />
                    <div className="">{generateReal(valueAdd.a, 10)}</div>
                  </div>
    
                  <div className="w-full flex items-center justify-center gap-2 ">
                    <div className="w-20 text-center">R$ 20,00</div>
                    <input
                      className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                      value={valueAdd.b}
                      onChange={(e) => {
                        const inputValueB = e.target.value;
                        setValueAddB(
                          inputValueB === "" ? 0 : parseInt(inputValueB)
                        );
                      }}
                    />
                    <div>{generateReal(valueAdd.b, 20)}</div>
                  </div>
    
                  <div className="w-full flex items-center justify-center gap-2 ">
                    <div className="w-20 text-center">R$ 50,00</div>
                    <input
                      className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                      value={valueAdd.c}
                      onChange={(e) => {
                        const inputValueC = e.target.value;
                        setValueAddC(
                          inputValueC === "" ? 0 : parseInt(inputValueC)
                        );
                      }}
                    />
                    <div>{generateReal(valueAdd.c, 50)}</div>
                  </div>
    
                  <div className="w-full flex items-center justify-center gap-2 ">
                    <div className="w-20 text-center">R$ 100,00</div>
                    <input
                      className="outline-none border-2 border-zinc-600 rounded-lg h-10 text-center w-52"
                      value={valueAdd.d}
                      onChange={(e) => {
                        const inputValueD = e.target.value;
                        setValueAddD(
                          inputValueD === "" ? 0 : parseInt(inputValueD)
                        );
                      }}
                    />
                    <div>{generateReal(valueAdd.d, 100)}</div>
                  </div>
                </div>
                <div className="text-black flex gap-2 justify-center items-center mb-2">
                  <div className="w-80 border-2 border-zinc-700 rounded-lg h-14 flex justify-center items-center">
                    {generateRealTotal(
                      valueAdd.a,
                      valueAdd.b,
                      valueAdd.c,
                      valueAdd.d
                    )}
                  </div>
                </div>
                <div className="w-full  flex justify-center items-center mt-2 mb-2">
                  <div className="w-full h-1 bg-zinc-600 rounded"></div>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleSaveValues}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Fechar Modal
                  </button>
                </div>
                {error &&
                <div className="flex justify-center mt-3">
                  <p className="text-black">{error}</p>
                </div>
                }
              </div>
            </div>
}