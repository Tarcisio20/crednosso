import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { mainRouter } from "./routers/main";
import { requestLogger } from "./middlewares/requestLogger";
import { setIO } from "./utils/socket-event";

// importe o scheduler aqui
import { startGetSaldosScheduler } from "./schedulers/getSaldosScheduler";

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
  },
});

setIO(io);

app.use(helmet());
app.use(cors());
app.use(
  cors({
    exposedHeaders: ["Content-Disposition"],
  })
);
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger);

app.use(mainRouter);

io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado via Socket.IO");
});

// Inicializa o servidor HTTP
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server rodando em ${process.env.BASE_URL} na porta ${PORT}`);

  // inicia o agendamento depois que o backend subir
  startGetSaldosScheduler();
});