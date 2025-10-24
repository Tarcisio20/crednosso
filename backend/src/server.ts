import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { mainRouter } from "./routers/main";
import * as socketEventController from "./controllers/socket-event";
import { requestLogger } from "./middlewares/requestLogger";

// Cria o app Express e o servidor HTTP
const app = express();
const httpServer = createServer(app);

// Cria o Socket.IO com configuração de CORS
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*", // ajuste isso para seu frontend real se necessário
  },
});

// Registra o socket.io dentro do controller
socketEventController.setIO(io);

// Middlewares padrão
app.use(helmet());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger);

// Roteador principal
app.use(mainRouter);

app.use(cors({
  exposedHeaders: ['Content-Disposition'], // necessário para downloads
}));

// Evento de conexão via socket
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado via Socket.IO");
});

// Inicializa o servidor HTTP
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server rodando em ${process.env.BASE_URL} na porta ${PORT}`);
});
