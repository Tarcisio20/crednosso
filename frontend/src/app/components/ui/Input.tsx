import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PropsInput = {
    size : 'small' | 'meddium' | 'large' | 'extra-large';
    color : string;
    placeholder : string;
    value : string;
    onChange : (NewValue : string) => void;
    password ?: boolean;
    icon ?: IconProp;
    readonly ?: boolean;
}

export const Input = ({ size, color, placeholder, value, onChange, password , icon, readonly } : PropsInput) => {

    return <div className={`flex bg-slate-700 pt-2 pb-2 pr-2 pl-2 rounded-md border-4 border-slate-600
        ${size === 'small' ? 'w-64 h-11 text-sm' : ""}
        ${size === 'meddium' ? 'w-72 h-11 text-base' : ""}
        ${size === 'large' ? 'w-80 h-11 text-lg' : ""}
        ${size === 'extra-large' ? 'w-96 h-11 text-lg' : ""}
        `}>
        {icon &&
            <FontAwesomeIcon icon={icon} size="1x" color="#FFF" />
        }
        <input 
            type={password ? 'password' : 'text'}
            placeholder={placeholder}
            value={value}
            onChange={e=> onChange(e.target.value)}
            className=" w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg" 
           readOnly={readonly}
        />
    </div>
}