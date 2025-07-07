type PageProps = {
    children : React.ReactNode
}

export const Page = ({ children } : PageProps) => {
    return <main className="sm:ml-14 p-4 flex flex-col h-screen">
        {children}
    </main>
}