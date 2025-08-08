"use client"

import { CardDash } from "@/app/components/ux/CardDash";
import Grafico from "@/app/components/ux/grafico";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page"
import { TitlePages } from "@/app/components/ux/TitlePages";
import { getAll as getAllAtm } from "@/app/service/atm";
import { getAll as getAllCardOperator } from "@/app/service/card-operator";
import { getAll as getAllContac } from "@/app/service/contact";
import { getAll as getAllOrder, getMediasYears } from "@/app/service/order";
import { getAll as getAllStatusOrder } from "@/app/service/status-order";
import { getAll as getAllSupply } from "@/app/service/supply";
import { getAll as getAllTreasuries } from "@/app/service/treasury";
import { getAll as getAllTypeOperation } from "@/app/service/type-operation";
import { getAll as getAllTypeOrder } from "@/app/service/type-order";
import { getAll as getAllTypeStore } from "@/app/service/type-store";
import { getAll as getAllTypeSupply } from "@/app/service/type-supply";
import { atmType } from "@/types/atmType";
import { cardOperatorType } from "@/types/cardOperatorType";
import { ContactType } from "@/types/contactType";
import { MediaAnual } from "@/types/mediasType";
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

  const [medias, setMedias] = useState<MediaAnual[]>([])

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    document.title = "Dashboard | CredNosso";
    loadingValues()
  }, []);

  const loadingValues = async () => {
    setLoading(true)
    const mediasAnos = await getMediasYears()
    if (mediasAnos.data !== undefined && mediasAnos.data.medias.length > 0) {
      setMedias(mediasAnos.data.medias)
    }
    const t = await getAllTreasuries()
    if (t.data !== undefined && t.data.treasury.length > 0) {
      setTreasuries(t.data.treasury)
    }
    const a = await getAllAtm()
    if (a.data !== undefined && a.data.atm.length > 0) {
      setAtms(a.data.atm)
    }
    const ab = await getAllSupply()
    if (ab.data !== undefined && ab.data.supply.length > 0) {
      setSupllies(ab.data.supply)
    }
    const co = await getAllCardOperator()
    if (co.data !== undefined && co.data.cardOperator.length > 0) {
      setCardOperatos(co.data.cardOperator)
    }
    const c = await getAllContac()
    if (c.data !== undefined && c.data.contact.length > 0) {
      setContacts(c.data.contact)
    }
    const p = await getAllOrder()
    if (p.data !== undefined && p.data.order.length > 0) {
      setOrders(p.data.order)
    }
    const sp = await getAllStatusOrder()
    if (sp.data !== undefined && sp.data.statusOrder.length > 0) {
      setStatusOrders(sp.data.statusOrder)
    }
    const to = await getAllTypeOperation()
    if (to.data !== undefined && to.data.typeOperation.length > 0) {
      setTypeOperations(to.data.typeOperation)
    }
    const tp = await getAllTypeSupply()
    if (tp.data !== undefined && tp.data.typeSupply.length > 0) {
      setTypeSupllies(tp.data.typeSupply)
    }

    const tl = await getAllTypeStore();
    if (tl && Array.isArray(tl.typeStore) && tl.typeStore.length > 0) {
      setTypeStores(tl.typeStore);
    }

    const torder = await getAllTypeOrder()
    if (torder.data !== undefined && torder.data.typeOrder.length > 0) {
      setTypeOrders(torder.data.typeOrder)
    }
    setLoading(false)
  }

  return (
    <Page>
      <TitlePages linkBack="/" icon={faGauge} >Dahsboard</TitlePages>
      <main className="h-screen w-full flex flex-col">
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 border-b border-gray-200">

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
            <CardDash title="Tipo Loja" value={typeStores.length.toString()} icon={faStore} />
          }
          {typeOrders && typeOrders.length > 0 &&
            <CardDash title="Tipo Abastecimento" value={typeOrders.length.toString()} icon={faSupple} />
          }

        </div>
        <div className="w-full max-w-5xl p-4">
          {medias && medias.length > 0 && <Grafico dados={medias} />}
        </div>
      </main>
      {loading && <Loading />}
    </Page>
  );
}
