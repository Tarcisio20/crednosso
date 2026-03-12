import { cn } from "@/lib/utils";

type Props = {
    children: React.ReactNode;
    className?: string  ;
}

export default function BoxInfo ({ children, className } : Props) {
    return  <div 
    className={cn("flex flex-col gap-2 border border-zinc-300 rounded-md p-2 w-full", className)}
    >{children}</div>
}