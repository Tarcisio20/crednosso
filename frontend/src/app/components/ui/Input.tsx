"use client"

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PropsInput = {
    size: 'small' | 'meddium' | 'large' | 'extra-large';
    color: string;
    placeholder: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    password?: boolean;
    icon?: IconProp;
    readonly?: boolean;
    mask?: 'phone' | 'currency' | 'email'; 
    readOnly?: boolean
}

export const Input = ({ size, placeholder, value, onChange, password, icon, readonly, mask, readOnly = false }: PropsInput) => {

    const formatPhone = (input: string) => {
        const numbers = input.replace(/\D/g, '');
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

    const formatCurrency = (input: string) => {
        const numbers = input.replace(/\D/g, '');
        const value = parseFloat(numbers) / 100;
        if (isNaN(value)) return '';
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatEmail = (input: string) => {
    const cleaned = input.replace(/\s/g, ''); 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (cleaned === '' || emailRegex.test(cleaned)) {
        return cleaned;
    }

    return input;
};

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        let newValue = input;

        switch (mask) {
            case 'phone':
                newValue = formatPhone(input);
                break;
            case 'currency':
                newValue = formatCurrency(input);
                break;
            case 'email':
                newValue = formatEmail(input);
                break;
            default:
                newValue = input; // Sem máscara, usa valor original
        }

        const syntheticEvent = {
            ...event,
            target: {
                ...event.target,
                value: newValue
            }
        };

        onChange(syntheticEvent);
    };

    return (
        <div className={`flex items-center bg-slate-700 pt-2 pb-2  pl-2 rounded-md border-4 border-slate-600
            ${size === 'small' ? 'w-64 h-11 text-sm' : ''}
            ${size === 'meddium' ? 'w-72 h-11 text-base' : ''}
            ${size === 'large' ? 'w-80 h-11 text-lg' : ''}
            ${size === 'extra-large' ? 'w-96 h-11 text-lg' : ''}
        `}>
            {icon &&
                <div>
                    <FontAwesomeIcon icon={icon} size="1x" color="#FFF" />
                </div>
            }
            <input
                type={password ? 'password' : 'text'}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className="w-full h-full m-0 p-0 text-white bg-transparent outline-none text-center text-lg"
                readOnly={readOnly}
                maxLength={mask === 'phone' ? 15 : undefined}
            />
        </div>
    );
};
