"use client"

import { Page } from "@/app/components/ux/Page"
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faGauge } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  return (
    <Page>
        <TitlePages linkBack="/" icon={faGauge} >Dahsboard</TitlePages>
        <div className="flex flex-col gap-4 p-5 w-full">...</div>  
    </Page>
  );
}
