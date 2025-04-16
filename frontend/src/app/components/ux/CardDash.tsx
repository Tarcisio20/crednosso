"use client"

type CardDashProps = {
    title: string;
    value: string;
}

export const CardDash = ({ title, value }: CardDashProps) => {
    return <div className="flex flex-col gap-6 w-80 h-44 bg-[#0082c7]/50 rounded-md pb-2">
        <div className=" flex  justify-center items-center text-4xl text-center uppercase font-bold bg-[#0082c7] h-full">{title}</div>
        <div className="text-center text-7xl">{value}</div>
    </div>
}