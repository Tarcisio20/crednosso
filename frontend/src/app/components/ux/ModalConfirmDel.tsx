type ModalConfirmDelType = {
    ids: number[];
    onClose: () => void
}

export const ModalConfirmDel = ({ }: ModalConfirmDelType) => {
    return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4 text-black text-center uppercase">
                Confirmação exclusão
            </h2>
            <p className="text-black text-center">IDs Pedidos: </p>
            <div className="w-full  flex justify-center items-center mt-2 mb-2">
                <div className="w-full h-1 bg-zinc-600 rounded"></div>
            </div>
            <div className="mb-4 flex flex-col w-full h-full gap-4 text-black">
                Confime a exlusão dos pedidos?
            </div>
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => { }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Excluir
                </button>
                <button
                    onClick={() => { }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Cancelar
                </button>
            </div>
        </div>
    </div>
}