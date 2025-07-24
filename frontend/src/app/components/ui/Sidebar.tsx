"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { faBars, faBomb, faBoxOpen, faBuildingColumns, faCloudArrowDown, faCoins, faCreditCard, faGauge, faGears, faIdCardClip, faParachuteBox, faRightFromBracket, faSackDollar, faShieldHalved, faStore, faThumbTack, faUserTie, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Nav } from "./Menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { faSupple } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";
import { Loading } from "../ux/Loading";
import { usePathname, useRouter } from "next/navigation";


export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    setOnLoadingStart(false);
  }, [pathname])

  const [open, setOpen] = useState(false)
  const [onLoadingStart, setOnLoadingStart] = useState(false)

  const menu = [
    { label: 'Inicio', icon: faGauge, link: '/' },
    { label: 'Atm', icon: faBoxOpen, link: '/atm' },
    { label: 'Abastecimento', icon: faParachuteBox, link: '/supply' },
    { label: 'Cartão Operador', icon: faCreditCard, link: '/operator-card' },
    { label: 'Contatos', icon: faIdCardClip, link: '/contacts' },
    { label: 'Conta Bancária', icon: faBuildingColumns, link: '/account-bank' },
    { label: 'Download', icon: faCloudArrowDown, link: '/download' },
    { label: 'Erros Operacionais', icon: faBomb, link: '/operational-error' },
    { label: 'Pedido', icon: faCoins, link: '/order' },
    { label: 'Status do Pedido', icon: faWandMagicSparkles, link: '/status-order' },
    { label: 'Tesouraria', icon: faSackDollar, link: '/treasury' },
    { label: 'Tipo de Operação', icon: faGears, link: '/type-operation' },
    { label: 'Tipo de Pedido', icon: faThumbTack, link: '/type-order' },
    { label: 'Tipo de Loja', icon: faStore, link: '/type-store' },
    { label: 'Tipo de Abastecimento', icon: faSupple, link: '/type-supply' },
    { label: 'Usuários', icon: faUserTie, link: '/user' },

  ]



  return (
    <div className="flex w-full flex-col bg-muted/40">

      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex sm:flex-col">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Link href="/" className="flex h-12 w-12 shrink-0 items-center justify-center
              bg-muted/25 rounded-full
            ">
              <FontAwesomeIcon icon={faShieldHalved} color="#FFF" className="h-5 w-5" />
              <span className="sr-only">Dashboard CredNosso</span>
            </Link>
            {menu.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <button onClick={() => {
                    setOnLoadingStart(true)
                    router.push(item.link)
                  }} className="flex h-9 w-9 shrink-0 items-center justify-center
                    text-muted-foreground rounded-lg transition-colors hover:text-foreground">
                    <FontAwesomeIcon icon={item.icon} size="1x" className="h-5 w-5 transition-all " />
                    <span className="sr-only">{item.label}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
            <Tooltip >
              <TooltipTrigger asChild>
                <Link href={"/sign-out"} className="flex h-9 w-9 shrink-0 items-center justify-center
                    text-red-500 rounded-lg transition-colors hover:text-foreground">
                  <FontAwesomeIcon icon={faRightFromBracket} size="1x" className="h-5 w-5 transition-all text-red-500" />
                  <span className="sr-only">Sair</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Sair</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>


      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4">
        <header
          className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background 
          gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
        >
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <FontAwesomeIcon icon={faBars} size="1x" color="#FFF" />
                <span className="sr-only">Abrir / fechar Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xs" side="left">

              <SheetHeader className="hidden">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <Nav menu={menu} onClose={() => setOpen(false)} onLoadingStart={() => setOnLoadingStart(true)} />

            </SheetContent>
          </Sheet>
          <h2>Menu</h2>
        </header>
      </div>
      {onLoadingStart && <Loading />}
    </div>
  );
}