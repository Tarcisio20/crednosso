"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

    const onConnect = () => {
      console.log("✅ Conectado ao socket");
    };

    const onDisconnect = () => {
      console.log("❌ Desconectado do socket");
    };

    const onTarefaIniciada = (data: TarefaPayload) => {
      console.log("📩 tarefa_iniciada recebida", data);
      toast.success(data.mensagem);
    };

    const onTarefaFinalizada = (data: TarefaPayload) => {
      console.log("📩 tarefa_finalizada recebida", data);
      toast.success(data.mensagem);
    };

    const onTarefaErro = (data: TarefaPayload) => {
      console.log("📩 tarefa_erro recebida", data);
      toast.error(data.mensagem);
    };

    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", onDisconnect);
    newSocket.on("tarefa_iniciada", onTarefaIniciada);
    newSocket.on("tarefa_finalizada", onTarefaFinalizada);
    newSocket.on("tarefa_erro", onTarefaErro); // certifique-se que o backend está emitindo "tarefa_error"

    return () => {
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect", onDisconnect);
      newSocket.off("tarefa_iniciada", onTarefaIniciada);
      newSocket.off("tarefa_finalizada", onTarefaFinalizada);
      newSocket.off("tarefa_erro", onTarefaErro);
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
