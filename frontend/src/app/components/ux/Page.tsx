type PageProps = {
    children : React.ReactNode
}

export const Page = ({ children } : PageProps) => {
    return <div className="p-2 flex flex-col w-full items-center mt-4">
        {children}
    </div>
}