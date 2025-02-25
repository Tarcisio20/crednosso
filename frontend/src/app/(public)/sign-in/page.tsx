"use client";

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isValidEmail } from "@/app/utils/emailValidator";
import { passLoginValidator } from "@/app/utils/passLoginValidator";
import { login } from "@/app/service/auth";
import { Loading } from "@/app/components/ux/Loading";

export default function SignIn() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  const onLoading = async () => {
    setError("");
    setLoading(false)
    const email = isValidEmail(userEmail);
    if (!email) {
      setError("Digitar um e-mail válido!");
      return;
    }
    const pass = passLoginValidator(userPassword);
    if (pass !== null) {
      setError(pass);
      return;
    }
    const data = {
      email: userEmail,
      password: userPassword,
    };
    setLoading(true)
    const user = await login(data);
    if (!user.success) {
      setError(user.message);
      setLoading(false)
      return;
    }
    setLoading(false)
    if(user.data){
      await Cookies.set("tokenSystemCredNosso", user?.data?.token, {
        expires: 7,
        path: "/",
      });
      router.push("/");
    }
    return false
  };

  return (
    <div className="flex flex-col gap-6 p-10 bg-zinc-800 rounded-md border-2 border-zinc-750">
      <div className="flex mb-7  items-center">
        <h3 className="text-3xl mr-2">Sign In</h3>
        <p className="text-sm text-zinc-600">
          Faça login com as suas credenciais
        </p>
      </div>
      <div className="flex flex-col">
        <label className="uppercase mb-2 font-bold">Email :</label>
        <Input
          color="#DDD"
          placeholder="Digite o e-mail..."
          value={userEmail}
          onChange={setUserEmail}
          size="large"
        />
      </div>
      <div className="flex flex-col">
        <label className="uppercase mb-2 font-bold">Senha :</label>
        <Input
          color="#DDD"
          placeholder="Digite a senha..."
          value={userPassword}
          password
          onChange={setUserPassword}
          size="large"
        />
      </div>
      <div className="flex flex-col gap-3">
        <Button
          size="large"
          color="#ADD8E6"
          onClick={onLoading}
          secondaryColor=""
          textColor="black"
        >
          Logar
        </Button>
        <p className="">
          Não possui usuario?{" "}
          <Link href="/register" className="text-zinc-400">
            Registre-se
          </Link>
          !
        </p>
        {error && <p className="text-white text-center">{error}</p>}
        {loading && (
        <Loading />
      )}
      </div>
    </div>
  );
}
