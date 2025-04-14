"use client"

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import Cookies from "js-cookie";
import { Page } from '@/app/components/ux/Page';

export default function SignOut() {
  const router = useRouter();


  const handleSair = useCallback(async () => {
    await Cookies.set("tokenSystemCredNosso", "", { path: "/" });
    await Cookies.remove("tokenSystemCredNosso", { path: "/" });
    setTimeout(() => {
      router.push('/sign-in');
    }, 200);
  }, [router])
  
  useEffect(() => {
    document.title = "Deslogar  | CredNosso";
    handleSair()
  }, [router, handleSair]);

  return <Page>
    <div className='text-white'>Saindo...</div>;
  </Page>

}
