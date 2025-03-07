type ModalRelaunchOrderType = {
    id: number;
    value : string;
    onSetValue : (e: React.ChangeEvent<HTMLInputElement>)=> void;
    onConfirm : () => void;
    onClose: () => void;
    error : string;
}

export const ModalRelaunchOrder = ({ id, value, onConfirm, onSetValue, onClose, error }: ModalRelaunchOrderType) => {
    return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="font-bold mb-4 text-black text-center uppercase text-4xl">
                Relançar Pedido
            </h2>
            <p className="text-black text-center">ID Pedido: </p>
            <div className="w-full  flex justify-center items-center mt-2 mb-2">
                <div className="w-full h-1 bg-zinc-600 rounded"></div>
            </div>
            <div className="mb-4 flex flex-col w-full h-full gap-4 text-black">
               <div className="flex flex-col justify-center items-center gap-4">
                    <label className="text-black uppercase text-2xl">Insira a nova data</label>
                    <input
                        type="date" 
                        value={value} 
                        onChange={onSetValue} 
                        className="w-60 h-12 text-center text-lg rounded-xl outline-none border-2 border-zinc-700"
                    />
               </div>
            </div>
            <div className="w-full  flex justify-center items-center mt-2 mb-2">
                <div className="w-full h-1 bg-zinc-600 rounded"></div>
            </div>
            <div className="flex justify-center gap-4">
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Salvar
                </button>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Cancelar
                </button>
            </div>
            {error &&
                <div className="flex justify-center mt-2">
                    <p className="text-black text-center">{error}</p>
                </div>
            }
        </div>
    </div>
}