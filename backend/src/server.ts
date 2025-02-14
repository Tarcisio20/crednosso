import "dotenv/config";
import cors from "cors";
import express, { Request, Response } from "express";
import operatorCardRouter from './routers/operatorCardRouter'
import authRouter from './routers/auth'


const app = express();

const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use(authRouter)
app.use(operatorCardRouter)

// Iniciar servidor sem expor Express
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
