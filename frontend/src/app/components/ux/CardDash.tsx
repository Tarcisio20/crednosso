"use client"

type CardDashProps = {
    title: string;
    value: string;
}

export const CardDash = ({ title, value }: CardDashProps) => {
    return <div className="flex flex-col gap-6 w-80 h-44 bg-zinc-500 rounded-md p-3">
        <div className="text-4xl uppercase font-bold">{title}</div>
        <div className="text-center text-7xl">{value}</div>
    </div>
}