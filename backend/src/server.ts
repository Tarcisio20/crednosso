import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { mainRouter } from "./routers/main";
import * as socketEventController from "./controllers/socket-event";
import { requestLogger } from "./middlewares/requestLogger";

import { setIO } from "./utils/socket-event";


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
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger);


app.use(mainRouter);

app.use(cors({
  exposedHeaders: ['Content-Disposition'],
}));


io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado via Socket.IO");
});

// Inicializa o servidor HTTP
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server rodando em ${process.env.BASE_URL} na porta ${PORT}`);
});
