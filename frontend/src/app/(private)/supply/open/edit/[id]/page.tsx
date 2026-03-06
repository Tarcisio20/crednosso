import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { faParachuteBox } from "@fortawesome/free-solid-svg-icons";

export default function OpenEdit() {
  return <Page>
    <TitlePages linkBack="/supply/open" icon={faParachuteBox}>
      Editar OS
    </TitlePages>
    <div className="flex flex-col gap-4 p-5 w-full">
      <div className="flex flex-col gap-5 w-1/3">Em construção</div>
    </div>
  </Page>
}