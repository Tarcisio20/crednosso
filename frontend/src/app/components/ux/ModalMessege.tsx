"use client"

type ModalMessegeProps = {
    type : string;
    title : string;
    messege : string;
    onClose : () => void;
}

export const ModalMessege = ({ title, messege, onClose } : ModalMessegeProps) => {
    return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="">{title}</div>
            <div className="">{messege}</div>
        </div>
        <div>
            <button onClick={onClose}>Sair</button>
        </div>
    </div>
}