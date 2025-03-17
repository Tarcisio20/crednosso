import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from "js-cookie";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    handleSair()
  }, [router]);

  const handleSair = async () => {
    await Cookies.remove("tokenSystemCredNosso", { path: "/" });
    router.push('/login');
  }

  return <div>Saindo...</div>;
}
