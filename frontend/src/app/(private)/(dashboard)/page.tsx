"use client"

import { CardDash } from "@/app/components/ux/CardDash";
import { Page } from "@/app/components/ux/Page"
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getAll as getAllAtm } from "@/app/service/atm";
import { getAll as getAllCardOperator } from "@/app/service/card-operator";
import { getAll as getAllContac } from "@/app/service/contact";
import { getAll as getAllOrder } from "@/app/service/order";
import { getAll as getAllStatusOrder } from "@/app/service/status-order";
import { getAll as getAllSupply } from "@/app/service/supply";
import { getAll as getAllTreasuries } from "@/app/service/treasury";
import { getAll as getAllTypeOperation } from "@/app/service/type-operation";
import { getAll as getAllTypeOrder } from "@/app/service/type-order";
import { getAll as getAllTypeStore } from "@/app/service/type-store";
import { getAll as getAllTypeSupply } from "@/app/service/type-supply";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { atmType } from "@/types/atmType";
import { cardOperatorType } from "@/types/cardOperatorType";
import { ContactType } from "@/types/contactType";
import { orderType } from "@/types/orderType";
import { statusOrderType } from "@/types/statusOrder";
import { supplyType } from "@/types/supplyType";
import { treasuryType } from "@/types/treasuryType";
import { typeOperationType } from "@/types/typeOperationType";
import { typeOrderType } from "@/types/typeOrderType";
import { typeStoreType } from "@/types/typeStoreType";
import { typeSupplyType } from "@/types/typeSupplyType";
import { faSupple } from "@fortawesome/free-brands-svg-icons";
import { faBoxOpen, faCoins, faCreditCard, faGauge, faGears, faIdCardClip, faParachuteBox, faSackDollar, faStore, faThumbTack, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Dashboard() {

  const [treasuries, setTreasuries] = useState<treasuryType[]>([])
  const [atms, setAtms] = useState<atmType[]>([])
  const [supllies, setSupllies] = useState<supplyType[]>([])
  const [cardOperatos, setCardOperatos] = useState<cardOperatorType[]>([])
  const [contacts, setContacts] = useState<ContactType[]>([])
  const [orders, setOrders] = useState<orderType[]>([])
  const [statusOrders, setStatusOrders] = useState<statusOrderType[]>([])
  const [typeOperations, setTypeOperations] = useState<typeOperationType[]>([])
  const [typeSupllies, setTypeSupllies] = useState<typeSupplyType[]>([])
  const [typeStores, setTypeStores] = useState<typeStoreType[]>([])
  const [typeOrders, setTypeOrders] = useState<typeOrderType[]>([])

  useEffect(() => {
    document.title = "Dashboard | CredNosso";
    loading()
  }, []);

  const loading = async () => {
    const t = await getAllTreasuries()
    if (t.data.treasury && t.data.treasury.length > 0) {
      setTreasuries(t.data.treasury)
    }
    const a = await getAllAtm()
    if (a.data.atm && a.data.atm.length > 0) {
      setAtms(a.data.atm)
    }
    const ab = await getAllSupply()
    if (ab.data.supply && ab.data.supply.length > 0) {
      setSupllies(ab.data.supply)
    }
    const co = await getAllCardOperator()
    if (co.data.cardOperator && co.data.cardOperator.length > 0) {
      setCardOperatos(co.data.cardOperator)
    }
    const c = await getAllContac()
    if (c.data.contact && c.data.contact.length > 0) {
      setContacts(c.data.contact)
    }
    const p = await getAllOrder()
    if (p.data.order && p.data.order.length > 0) {
      setOrders(p.data.order)
    }
    const sp = await getAllStatusOrder()
    if (sp.data.statusOrder && sp.data.statusOrder.length > 0) {
      setStatusOrders(sp.data.statusOrder)
    }
    const to = await getAllTypeOperation()
    if (to.data.typeOperation && to.data.typeOperation.length > 0) {
      setTypeOperations(to.data.typeOperation)
    }
    const tp = await getAllTypeSupply()
    if (tp.data.typeSupply && tp.data.typeSupply.length > 0) {
      setTypeSupllies(tp.data.typeSupply)
    }

    const tl = await getAllTypeStore()
    if (tl.data.typeStore && tl.data.typeStore.length > 0) {
      setTypeStores(tl.data.typeStore)
    }

    const torder = await getAllTypeOrder()
    if (torder.data.typeOrder && torder.data.typeOrder.length > 0) {
      setTypeOrders(torder.data.typeOrder)
    }
  }

  return (
    <Page>
      <TitlePages linkBack="/" icon={faGauge} >Dahsboard</TitlePages>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">

        {treasuries && treasuries.length > 0 &&
          <CardDash title="Tesourarias" value={treasuries.length.toString()} icon={faSackDollar} />
        }
         {atms && atms.length > 0 &&
          <CardDash title="Atms" value={atms.length.toString()} icon={faBoxOpen} />
        }
        {supllies && supllies.length > 0 &&
          <CardDash title="Abasteciment..." value={supllies.length.toString()} icon={faParachuteBox} />
        }
        {cardOperatos && cardOperatos.length > 0 &&
          <CardDash title="Cartão Operador" value={cardOperatos.length.toString()} icon={faCreditCard} />
        }
        {contacts && contacts.length > 0 &&
          <CardDash title="Contatos" value={contacts.length.toString()} icon={faIdCardClip} />
        }
        {orders && orders.length > 0 &&
          <CardDash title="Pedidos" value={orders.length.toString()} icon={faCoins} />
        }
        {statusOrders && statusOrders.length > 0 &&
          <CardDash title="Status Pedido" value={statusOrders.length.toString()} icon={faWandMagicSparkles} />
        }
        {typeOperations && typeOperations.length > 0 &&
          <CardDash title="Tipo Operações" value={typeOperations.length.toString()} icon={faGears} />
        }
        {typeSupllies && typeSupllies.length > 0 &&
          <CardDash title="Tipo Pedido" value={typeSupllies.length.toString()} icon={faThumbTack} />
        }
        {typeStores && typeStores.length > 0 &&
          <CardDash title="Tipo Loja" value={typeStores.length.toString()}  icon={faStore} />
        }
        {typeOrders && typeOrders.length > 0 &&
          <CardDash title="Tipo Abastecimento" value={typeOrders.length.toString()} icon={faSupple} />
        }

      </div>
    </Page>
  );
}
