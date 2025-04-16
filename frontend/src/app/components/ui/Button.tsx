"use client"

type ButtonProps = {
    children: React.ReactNode;
    size: 'small' | 'meddium' | 'large';
    color: string;
    secondaryColor: string;
    textColor: string;
    onClick: () => void;
}

export const Button = ({ size, color, textColor, children, onClick }: ButtonProps) => {
    return <div className={`pt-2 pb-2 pr-2 pl-2 rounded-md border-4  text-center flex items-center justify-center
        cursor-pointer
        ${size === 'small' ? 'w-64 h-10 text-sm' : ""}
        ${size === 'meddium' ? 'w-72 h-10 text-base' : ""}
        ${size === 'large' ? 'w-80 h-10 text-md' : ""}
    `} style={{ backgroundColor: color }} onClick={onClick}  >
        <button className="p-0 m-0 text-zinc-400 font-bold uppercase" style={{ color: textColor }}  >{children}</button>
    </div>
}