"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";


export default function SignIn() {

  const router = useRouter()

  const [userIdentification, setUserIdentification] = useState('')
  const [userPassword, setUserPassword] = useState('')

  const onLoading = async () => {
    await Cookies.set('tokenSystemCredNosso', 'valorDoToken', { expires: 7, path: '/' });
    await router.push('/')
  }

  return (
    <div className="flex flex-col gap-6 p-10 bg-zinc-800 rounded-md border-2 border-zinc-750">
        <div className="flex mb-7  items-center">
          <h3 className="text-3xl mr-2">Sign In</h3>  
          <p className="text-sm text-zinc-600">Faça login com as suas credenciais</p>
        </div>
        <div className="flex flex-col">
          <label className="uppercase mb-2 font-bold">Usuario :</label>
          <Input color="#DDD" placeholder="Digite o usuário..." value={userIdentification} onChange={setUserIdentification} size="large" />   
        </div>
        <div className="flex flex-col">
          <label className="uppercase mb-2 font-bold">Senha :</label>
          <Input color="#DDD" placeholder="Digite a senha..." value={userPassword} password onChange={setUserPassword} size="large" />   
        </div>
        <div className="flex flex-col">
          <Button size="large" color="#999"  onClick={onLoading} secondaryColor="" textColor="" >Logar</Button>
        </div>
    </div>

  );
}
