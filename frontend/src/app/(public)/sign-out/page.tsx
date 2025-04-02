"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Cookies from "js-cookie";
import { Page } from '@/app/components/ux/Page';

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Deslogar  | CredNosso";
    handleSair()
  }, [router]);

  const handleSair = async () => {
    console.log("Chegie na saida")
    await Cookies.set("tokenSystemCredNosso", "", { path: "/" });
    await Cookies.remove("tokenSystemCredNosso", { path: "/" });
    setTimeout(() => {
      router.push('/sign-in');
    }, 200);
  }

  return <Page>
    <div className='text-white'>Saindo...</div>;
  </Page>

}
