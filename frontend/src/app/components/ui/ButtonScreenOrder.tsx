"use client"

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ButtonScrenOrderProps = {
    children?: React.ReactNode;
    size: 'btn-icon' | 'btn-icon-text' | 'btn-text';
    color: string;
    secondaryColor: string;
    textColor: string;
    onClick: () => void;
    icon?: IconProp;
}

export const ButtonScreenOrder = ({ size, color, secondaryColor, textColor, children, icon, onClick }: ButtonScrenOrderProps) => {
    return <div className={`pt-2 pb-2 pr-2 pl-2 rounded-md text-center flex items-center justify-center
        cursor-pointer
        ${size === 'btn-icon' ? 'w-16 h-10 text-sm' : ""}
        ${size === 'btn-icon-text' ? 'w-72 h-10 text-base' : ""}
        ${size === 'btn-text' ? 'w-80 h-10 text-lg' : ""}
    `} style={{ backgroundColor: color, border: `2px solid ${secondaryColor}` }} onClick={onClick}  >
        <button className="p-0 m-0 text-zinc-400 font-bold uppercase" style={{ color: textColor }}  >
            {size === 'btn-icon' && icon && (
                <FontAwesomeIcon icon={icon} size="1x" color={textColor} />
            )}
            {size === 'btn-icon-text' && icon && (
                <div className="flex gap-2">
                    <FontAwesomeIcon icon={icon} size="1x" color={textColor} />
                    {children}
                </div>
            )}
            {size === 'btn-text' && children}
        </button>
    </div>
}