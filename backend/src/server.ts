import "dotenv/config";
import cors from "cors";
import express, { Request, Response } from "express";
import operatorCardRouter from "./routers/operatorCardRouter";
import authRouter from "./routers/auth";
import treasuryRouter from "./routers/treasury";
import cookieParser from "cookie-parser";

const app = express();

const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(authRouter);
app.use("/treasury", treasuryRouter);
app.use(operatorCardRouter);

// Iniciar servidor sem expor Express
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
