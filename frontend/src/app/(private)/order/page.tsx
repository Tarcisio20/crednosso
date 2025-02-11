"use client"

import { Page } from "@/app/components/ux/Page";
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { TitlePages } from "@/app/components/ux/TitlePages";

export default function Order() {
  return (
   <Page>
    <TitlePages linkBack="/" icon={faCoins} >Pedidos</TitlePages>
      <div>Aqui vem Order</div>
      <div>Aqui vem Order</div>
      <div>Aqui vem Order</div>
      <div>Aqui vem Order</div>
      <div>Aqui vem Order</div>
      <div>Aqui vem Order</div>
   </Page>
  );
}
