import "dotenv/config";
import cors from "cors";
import express, { Request, Response } from "express";
import operatorCardRouter from './routers/operatorCardRouter'


const app = express();

const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());


app.use(operatorCardRouter)
// Rota de exemplo
app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "API rodando" });
});

// Exemplo de rota para buscar usuários sem expor que usa Express
app.get("/users", async (req: Request, res: Response) => {
 // const users = await prisma.user.findMany();
  res.json({});
});

// Iniciar servidor sem expor Express
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
