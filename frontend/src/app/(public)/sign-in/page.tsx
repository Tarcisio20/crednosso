"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isValidEmail } from "@/app/utils/emailValidator";
import { passLoginValidator } from "@/app/utils/passLoginValidator";
import { login } from "@/app/service/auth";
import { Loading } from "@/app/components/ux/Loading";
import { Messeger } from "@/app/components/ux/Messeger";
import Image from "next/image";
import { toast } from "sonner";

export default function SignIn() {

  useEffect(() => {
    document.title = "Login | CredNosso";
  }, []);

  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState({ type: '', title: '', messege: '' })
  const [loading, setLoading] = useState(false)

  const onLoading = async () => {
    setLoading(false)
    const email = isValidEmail(userEmail);
    if (!email) {
      setLoading(false)
      toast.error('E-mail inválido, tente novamente!')
      return;
    }
    const pass = passLoginValidator(userPassword);
    if (pass !== null) {
      setLoading(false)
      toast.error(`${pass}`)
      return;
    }
    const data = {
      email: userEmail,
      password: userPassword,
    };

    setLoading(true)
    const user = await login(data);
    if (!user.success) {
      setLoading(false)
      toast.error('E-mail e/ou senha inválida!')
      return;
    }

    if (user.data) {
      await Cookies.set("tokenSystemCredNosso", user?.data?.token, {
        expires: 2,
        path: "/",
      });
      setLoading(false)
      router.push("/");
    }
    return false
  };

  return (
    <>
      <div>
        <Image
          src="https://crednosso.com.br/images/logo.png"
          alt="Logo"
          width={300}
          height={150}
        />
      </div>
      <div className="flex flex-col gap-3 p-5  rounded-md"  >
        <div className="flex mb-3  items-center" >
          <h3 className="text-2xl mr-2 text-zinc-400  " >Sign In  |</h3>
          <p className="text-sm text-zinc-600" >
            Faça login com as suas credenciais
          </p>
        </div>
        <div className="flex flex-col" >
          <label className="uppercase mb-1 text-sm font-bold"  >Email :</label>
          <Input
            color="#DDD"
            placeholder="Digite o e-mail..."
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            size="large"
          />
        </div>
        <div className="flex flex-col" >
          <label className="uppercase mb-1 font-bold text-sm"  >Senha :</label>
          <Input
            color="#DDD"
            placeholder="Digite a senha..."
            value={userPassword}
            password
            onChange={(e) => setUserPassword(e.target.value)}
            size="large"
          />
        </div>
        <div className="flex flex-col gap-3" >
          <Button
            size="large"
            color="#0082c7"
            onClick={onLoading}
            variant={"primary"}
            textColor="white"
          >
            Logar
          </Button>
          {/*           
          <p className="text-sm" >
            Não possui usuario?{" "}
            <Link href="/register" className="text-zinc-400"  >
              Registre-se
            </Link>
            !
          </p> */}

          {error.messege &&
            <Messeger type={error.type} title={error.title} messege={error.messege} />
          }
          {loading && (
            <Loading />
          )}
        </div>
      </div>
    </>

  );
}
