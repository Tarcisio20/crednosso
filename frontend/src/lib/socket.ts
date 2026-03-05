import { io, type Socket } from "socket.io-client";

export const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
  transports: ["websocket"],
  autoConnect: true,
});