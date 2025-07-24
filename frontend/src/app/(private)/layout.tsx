"use client"

import { Toaster } from 'sonner'
import "../globals.css";
import '../../lib/fontawesome';
import { cn } from '@/lib/utils';
import { Sidebar } from '../components/ui/Sidebar';
import { SocketProvider } from '../context/SocketContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="pt-BR">
      <body className={cn(
        "min-h-screen font-sans antialiased dark",
      )} suppressHydrationWarning >
        <SocketProvider>
          <Sidebar />
          {children}
          <Toaster richColors duration={4000} />
        </SocketProvider>
      </body>
    </html>
  )
}
