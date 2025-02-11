import { IconProp } from "@fortawesome/fontawesome-svg-core";

type SelectActiveProps = {
    active : boolean;
    defaultSelected : string;
    value : string;
    size : 'small' | 'meddium' | 'large' | 'extra-large';
    onChange : (newValue : string) => void;
    icon ?: IconProp; 
}

export const SelectActive = ({ active, defaultSelected, value , size, onChange } : SelectActiveProps) => {
   return <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600
    ${size === 'small' ? 'w-64 h-11 text-sm' : ""}
    ${size === 'meddium' ? 'w-72 h-11 text-base' : ""}
    ${size === 'large' ? 'w-80 h-11 text-lg' : ""}
    ${size === 'extra-large' ? 'w-96 h-11 text-lg' : ""}
    `}>
         <select className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg" value={defaultSelected} onChange={e => onChange(e.target.value)}>
            <option className="uppercase bg-slate-700 text-white" value="0" selected={defaultSelected === "0"}  >Ativo</option>
            <option className="uppercase bg-slate-700 text-white" value="1" selected={defaultSelected === "1"} >Inativo</option>
        </select>
   </div> 
}