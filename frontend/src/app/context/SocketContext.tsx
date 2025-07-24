"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

type TarefaPayload = {
  mensagem: string;
};

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL as string, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Conectado ao socket");
    });

    newSocket.on("tarefa_iniciada", (data: TarefaPayload) => {
      console.log("📩 tarefa_iniciada recebida", data);
      toast.success(data.mensagem);
    });

    newSocket.on("tarefa_finalizada", (data: TarefaPayload) => {
      console.log("📩 tarefa_finalizada recebida", data);
      toast.success(data.mensagem);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Desconectado do socket");
    });

    newSocket.on("tarefa_finalizada", (data: TarefaPayload) => {
      console.error("📩 tarefa_erro recebida", data);
      toast.error(data.mensagem);
    });


    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
