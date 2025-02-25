import Image from "next/image"

export const Logo = () => {
    return <div className="w-full bg-zinc-700 rounded-full flex items-center justify-center p-5">
        <Image alt="Logo" src="/assets/sistema-financeiro.png" width={200} height={200} />
    </div>
}