import { faKey, faLandmarkDome } from "@fortawesome/free-solid-svg-icons"
import { Input } from "../ui/Input"
import { useState } from "react"
import { passValidator } from "@/app/utils/passValidator"
import { toast } from "sonner"
import { validateField } from "@/app/utils/validateField"
import { changePassword } from "@/app/service/user"
import { Loading } from "./Loading"


type ModalChangePasswordType = {
    id : number;
    onClose: () => void
}

export const ModalChangePassword = ({ id, onClose }: ModalChangePasswordType) => {

    const [password, setPassword] = useState('')
    const [confirmePassword, setConfirmePassword] = useState('')
    const [loading, setLoading] = useState(false)


    const save = async () => {
        setLoading(true)
        if(!validateField(password)){
            toast.error('Preencha todos os campos para continuar!')
            setLoading(false)
            return
        }
        const pass = passValidator(password, confirmePassword)
        if (pass !== null) {
            toast.error(`${pass}`)
            setLoading(false)
            return;
        }

        const newPass  = await changePassword(id, { password : password.toString() })
        if(newPass.status === 300 || newPass.status === 400 || newPass.status === 500){
            toast.error('Erro na requisição, tente novamente!')
            setLoading(false)
            return
        }
        if(newPass.data !== undefined && newPass.data.user.id > 0){
            toast.success('Senha alterada com sucesso!')
            setLoading(false)
            onClose()
            return
        }else{
            toast.error('Erro ao alterar senha, tente novamente!')
            setLoading(false)
            return
        }

    }

    return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4 text-black text-center uppercase">
                alterar senha
            </h2>
            <div className="w-full  flex justify-center items-center mt-2 mb-2">
                <div className="w-full h-1 bg-zinc-600 rounded"></div>
            </div>

            <div className="flex flex-col gap-5 items-center mb-4 mt-4">
                <label className="uppercase leading-3 font-bold text-black">Nova Senha</label>
                <Input
                    color="#DDDD"
                    placeholder="Digite a nova senha"
                    size="extra-large"
                    value={password}
                    password
                    onChange={(e) => setPassword(e.target.value)}
                    icon={faKey}
                />
            </div>

            <div className="flex flex-col gap-5 items-center">
                <label className="uppercase leading-3 font-bold text-black">Confirme a Nova Senha</label>
                <Input
                    color="#DDDD"
                    placeholder="Digite a nova senha"
                    size="extra-large"
                    value={confirmePassword}
                    onChange={(e) => setConfirmePassword(e.target.value)}
                    password
                    icon={faKey}
                />
            </div>



            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={save}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Alterar
                </button>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Cancelar
                </button>
            </div>
            {loading && <Loading />}
        </div>
    </div>
}