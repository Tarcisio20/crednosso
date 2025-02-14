"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { passValidator } from "@/app/utils/passValidator";
import { register } from "@/app/service/auth";


export default function SignIn() {

  const router = useRouter()

  const [userIdentification, setUserIdentification] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [userConfirmPassword, setUserConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const registerUser = async () => {
    setError('')
    const pass = passValidator(userPassword, userConfirmPassword)
    if(pass !== null) {
      setError(pass)
      return;
    }

    if(userIdentification === ''){
      setError('Preencher campo name')
      return
    }
    if(userEmail === ''){
      setError('Preencher campo e-mail')
      return
    }

    const user = register({
      name : userIdentification,
      email : userEmail,
      password : userPassword
    })

    console.log("aaaaaaaaaaaaaaaaaaaa", user)
  }

  const onLoading = async () => {
    await Cookies.set('tokenSystemCredNosso', 'valorDoToken', { expires: 7, path: '/' });
    await router.push('/')
  }

  return (
    <div className="flex flex-col gap-6 p-10 bg-zinc-800 rounded-md border-2 border-zinc-750">
        <div className="flex mb-7  items-center">
          <h3 className="text-3xl mr-2">Registrar</h3>  
          <p className="text-sm text-zinc-600">Preencha todos os dados</p>
        </div>
        <div className="flex flex-col">
          <label className="uppercase mb-2 font-bold">Usuario :</label>
          <Input color="#DDD" placeholder="Digite o usuário..." value={userIdentification} onChange={setUserIdentification} size="large" />   
        </div>
        <div className="flex flex-col">
          <label className="uppercase mb-2 font-bold">E-mail :</label>
          <Input color="#DDD" placeholder="Digite o e-mail..." value={userEmail} onChange={setUserEmail} size="large" />   
        </div>
        <div className="flex flex-col">
          <label className="uppercase mb-2 font-bold">Senha :</label>
          <Input color="#DDD" placeholder="Digite a senha..." value={userPassword} password onChange={setUserPassword} size="large" />   
        </div>
        <div className="flex flex-col">
          <label className="uppercase mb-2 font-bold">Confirmar Senha :</label>
          <Input color="#DDD" placeholder="Digite a senha novamente..." value={userConfirmPassword} password onChange={setUserConfirmPassword} size="large" />   
        </div>
        <div className="flex flex-col gap-3">
          <Button size="large" color="#ADD8E6"  onClick={registerUser} secondaryColor="" textColor="black" >Logar</Button>
          <p className="">Já tem acesso? <Link href="/sign-in" className="text-zinc-400">Clique aqui </Link>!</p>
        </div>
        {error &&
            <div>{error}</div>
        }
    </div>

  );
}
