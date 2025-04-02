"use client"

import { CardDash } from "@/app/components/ux/CardDash";
import { Page } from "@/app/components/ux/Page"
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faGauge } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import { useEffect } from "react";

export default function Dashboard() {

  useEffect(() => {
    document.title = "Dashboard | CredNosso";
  }, []);

  return (  
    <Page>
      <Head>
        <title>Dashboard</title>
      </Head>
        <TitlePages linkBack="/" icon={faGauge} >Dahsboard</TitlePages>
        <div className="flex flex-row flex-wrap gap-8 w-full p-5">
            <CardDash title="Tesourarias" value="50" />
            <CardDash title="Tesourarias" value="50" />
            <CardDash title="Tesourarias" value="50" />
            <CardDash title="Tesourarias" value="50" />
            <CardDash title="Tesourarias" value="50" />
            <CardDash title="Tesourarias" value="50" />
            <CardDash title="Tesourarias" value="50" />
            <CardDash title="Tesourarias" value="50" />
            <CardDash title="Tesourarias" value="50" />
            <CardDash title="Tesourarias" value="50" />
            <CardDash title="Tesourarias" value="50" />
            <CardDash title="Tesourarias" value="50" />
          </div>  
    </Page>
  );
}
