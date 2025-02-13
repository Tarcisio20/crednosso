import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Logo } from "../components/ui/Logo";
import Link from "next/link";
import '../../lib/fontawesome'; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <html lang="pt-BR">
    <body  className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
      <div className="flex w-screen h-screen ">
        <div className="w-56 flex flex-col gap-9">
          <div className="w-full p-2 justify-center items-center mt-4">
            <Logo />
          </div>
          <div className="flex-1">
            <ul className="">
              <li className="pb-3 pt-3 text-center bg-zinc-600 uppercase hover:bg-zinc-700 cursor-pointer">
                <Link href="/order">Pedido</Link>
              </li>
              <li className="pb-3 pt-3 text-center bg-zinc-600 uppercase hover:bg-zinc-700 cursor-pointer">
                <Link href="/treasury">Tesouraria</Link>
              </li>
              <li className="pb-3 pt-3 text-center bg-zinc-600 uppercase hover:bg-zinc-700 cursor-pointer">
                <Link href="/atm">Atm</Link>
              </li>
              <li className="pb-3 pt-3 text-center bg-zinc-600 uppercase hover:bg-zinc-700 cursor-pointer">
                <Link href="/type-operation">Tipo de Operação</Link>
              </li>
              <li className="pb-3 pt-3 text-center bg-zinc-600 uppercase hover:bg-zinc-700 cursor-pointer">
                <Link href="/type-order">Tipo de Pedido</Link>
              </li>
              <li className="pb-3 pt-3 text-center bg-zinc-600 uppercase hover:bg-zinc-700 cursor-pointer">
                <Link href="/contacts">Contatos</Link>
              </li>
              <li className="pb-3 pt-3 text-center bg-zinc-600 uppercase hover:bg-zinc-700 cursor-pointer">
                <Link href="/operator-card">Cartão Operador</Link>
              </li>
              <li className="pb-3 pt-3 text-center bg-red-600 uppercase hover:bg-red-700 cursor-pointer">Sair</li>
            </ul>
          </div>
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </body>
  </html>
  )
}
