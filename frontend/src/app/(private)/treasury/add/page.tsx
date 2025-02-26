"use client"

import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loading } from "@/app/components/ux/Loading";
import { Page } from "@/app/components/ux/Page";
import { TitlePages } from "@/app/components/ux/TitlePages";
import { add } from "@/app/service/treasury";
import { validateField } from "@/app/utils/validateField";
import { faAdd, faLandmark, faVault, faReceipt, faListOl } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function TreasuryAdd() {

     const router = useRouter()

     const [idSystemTreasury, setIdSystemTreasury] = useState('')
     const [nameTreasury, setNameTreasury] = useState('')
     const [nameRedTreasury, setNameRedTreasury] = useState('')
     const [numContaTreasury, setNumContaTreasury] = useState('')
     const [numGMCoreTreasury, setNumGMCoreTreasury] = useState('')
     const [error, setError] = useState('')
     const [loading, setLoading] = useState(false)

     const cadTeasury = async () => {
          setError('')
          setLoading(false)
          if(
               idSystemTreasury === "" || !validateField(nameTreasury)  || 
               !validateField(nameRedTreasury)  || numContaTreasury === ""
          ){
               setError('Preencher todos (exceto Numero GMCore se não houver) os campos, e os campos Nome, Nome Reduzido e Numero da conta o minimo é  de 3 catacteres.')
               return
          }
          let data = {
               id_system :  parseInt(idSystemTreasury),
               name : nameTreasury.toUpperCase(),
               short_name : nameRedTreasury.toUpperCase(),
               account_number : numContaTreasury,
               gmcore_number : (numGMCoreTreasury === "" ? "0" : numGMCoreTreasury ),
          }
          setLoading(true)
          const treasury = await add(data)
          setLoading(false)
          if(treasury.data.treasury.id_system){
               router.push('/treasury')
               return
          }else{
               setError("Sem dados a mostrar")
          }
     }

     return (
          <Page>
               <TitlePages linkBack="/treasury" icon={faAdd} >Adicionar Tesouraria</TitlePages>
               <div className="flex flex-col gap-8 p-5 w-full">
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Id</label>
                         <Input color="#DDDD" placeholder="Digite o nome Id no sistema" size="extra-large" value={idSystemTreasury} onChange={setIdSystemTreasury} icon={faReceipt} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Nome</label>
                         <Input color="#DDDD" placeholder="Digite o nome da Transportadora" size="extra-large" value={nameTreasury} onChange={setNameTreasury} icon={faLandmark} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">Nome Reduzido</label>
                         <Input color="#DDDD" placeholder="Digite o nome reduzido da Transportadora" size="extra-large" value={nameRedTreasury} onChange={setNameRedTreasury} icon={faVault} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">N° Conta</label>
                         <Input color="#DDDD" placeholder="Digite o numero da conta da  Transportadora" size="extra-large" value={numContaTreasury} onChange={setNumContaTreasury} icon={faListOl} />
                    </div>
                    <div className="flex flex-col gap-5">
                         <label className="uppercase leading-3 font-bold">N° GMCore</label>
                         <Input color="#DDDD" placeholder="Digite o numero do GMCore da  Transportadora" size="extra-large" value={numGMCoreTreasury} onChange={setNumGMCoreTreasury} icon={faListOl} />
                    </div>
                    <div>
                         <Button color="#2E8B57" onClick={cadTeasury} size="meddium" textColor="white" secondaryColor="#81C784">Cadastrar</Button>
                    </div>
                    {error &&
                         <div>
                              <p className="text-white">{error}</p>
                         </div>
                    }
                    {loading &&
                         <Loading />
                    }
               </div>
          </Page>
     );
}
