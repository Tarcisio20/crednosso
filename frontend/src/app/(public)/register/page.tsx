"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { passValidator } from "@/app/utils/passValidator";
import { register } from "@/app/service/auth";
import { Loading } from "@/app/components/ux/Loading";


export default function SignInComponent() {

  const router = useRouter()

  const [userIdentification, setUserIdentification] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')
  const [userPassword, setUserPassword] = useState<string>('')
  const [userConfirmPassword, setUserConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  
  const registerUser = async () => {
    setError('')
    setLoading(false)
    setLoading(true)
    const pass = passValidator(userPassword, userConfirmPassword)
    if(pass !== null) {
      setError(pass)
      setLoading(false)
      return;
    }
    if(userIdentification === ''){
      setError('Preencher campo name')
      setLoading(false)
      return
    }
 
    if(userEmail === ''){
      setError('Preencher campo e-mail')
      setLoading(false)
      return
    }
    const user = await register({
      name : userIdentification,
      email : userEmail,
      password : userPassword
    })
    
    if(user?.user){
      setLoading(false)
        router.push('/login')
      return
    }else {
      setLoading(false)
      setError('Erro ao cadastroar')
      return
    }

  }

  return (
    <div className="flex flex-col gap-6 p-10 bg-zinc-800 rounded-md border-2 border-zinc-750">
        <div className="flex mb-7  items-center">
          <h3 className="text-3xl mr-2">Registrar</h3>  
          <p className="text-sm text-zinc-600">Preencha todos os dados</p>
        </div>
        <div className="flex flex-col">
          <label className="uppercase mb-2 font-bold">Usuario :</label>
          <Input color="#DDD" placeholder="Digite o usuário..." value={userIdentification} onChange={(e) =>setUserIdentification(e.target.value)} size="large" />   
        </div>
        <div className="flex flex-col">
          <label className="uppercase mb-2 font-bold">E-mail :</label>
          <Input color="#DDD" placeholder="Digite o e-mail..." value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} size="large" />   
        </div>
        <div className="flex flex-col">
          <label className="uppercase mb-2 font-bold">Senha :</label>
          <Input color="#DDD" placeholder="Digite a senha..." value={userPassword} password onChange={(e)=>setUserPassword(e.target.value)} size="large" />   
        </div>
        <div className="flex flex-col">
          <label className="uppercase mb-2 font-bold">Confirmar Senha :</label>
          <Input color="#DDD" placeholder="Digite a senha novamente..." value={userConfirmPassword} password onChange={(e)=>setUserConfirmPassword(e.target.value)} size="large" />   
        </div>
        <div className="flex flex-col gap-3">
          <Button size="large" color="#ADD8E6"  onClick={registerUser} secondaryColor="" textColor="black" >Logar</Button>
          <p className="">Já tem acesso? <Link href="/sign-in" className="text-zinc-400">Clique aqui </Link>!</p>
        </div>
        {error &&
            <div>{error}</div>
        }
        {loading &&
          <Loading />
        }
    </div>

  );
}
