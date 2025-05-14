"use client"

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PropsInput = {
    size : 'small' | 'meddium' | 'large' | 'extra-large';
    color : string;
    placeholder : string;
    value : string;
    onChange : (event : React.ChangeEvent<HTMLInputElement>) => void;
    password ?: boolean;
    icon ?: IconProp;
    readonly ?: boolean;
    mask ?: 'phone'
}

export const Input = ({ size, placeholder, value, onChange, password , icon, readonly, mask } : PropsInput) => {

    const formatPhone = (input: string) => {
        // Remove tudo que não é número
        const numbers = input.replace(/\D/g, '');
        
        // Aplica a máscara baseada no comprimento
        if (numbers.length <= 2) {
            return numbers;
        }
        if (numbers.length <= 6) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        }
        if (numbers.length <= 10) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
        }
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = event.target.value;
        
        if (mask === 'phone') {
            newValue = formatPhone(newValue);
        }
        
        // Criamos um evento sintético para manter a compatibilidade com o onChange original
        const syntheticEvent = {
            ...event,
            target: {
                ...event.target,
                value: newValue
            }
        };
        
        onChange(syntheticEvent);
    };

    return <div className={`flex items-center bg-slate-700 pt-2 pb-2  pl-2 rounded-md border-4 border-slate-600
        ${size === 'small' ? 'w-64 h-11 text-sm' : ""}
        ${size === 'meddium' ? 'w-72 h-11 text-base' : ""}
        ${size === 'large' ? 'w-80 h-11 text-lg' : ""}
        ${size === 'extra-large' ? 'w-96 h-11 text-lg' : ""}
        `}
        
        >
        {icon &&
        <div className="">
            <FontAwesomeIcon icon={icon} size="1x" color="#FFF"  />
        </div>
        }
        <input 
            type={password ? 'password' : 'text'}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className=" w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg" 
           readOnly={readonly}
           maxLength={mask === 'phone' ? 15 : undefined}
        />
    </div>
}