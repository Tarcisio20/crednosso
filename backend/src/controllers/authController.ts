import { Request, Response ,NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../services/userServices";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface AuthRequest extends Request {
  user?: any; // Para armazenar os dados do usuário decodificados
}

export const register = async (req: Request, res: Response ) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email e senha são obrigatórios" });
    return;
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    res.status(400).json({ message: "Usuário já existe" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser(name, email, hashedPassword);
  if (newUser.id) {
    res.status(201).json({
      message: "Usuário criado",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email e senha são obrigatórios" });
    return;
  }
  const user = await findUserByEmail(email);
  if (!user) {
    res.status(401).json({ message: "Credenciais inválidas" });
    return;
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401).json({ message: "Credenciais inválidas" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "2h" });

  res.json({ message: "Login bem-sucedido", token });
  return;
};

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("TOKEN CHEGANDO", token)
  if (!token) {
    return res.status(401).json({ success: false, message: "Token não fornecido" });
  }

   try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    
    console.log(decoded);

    // Adiciona os dados do usuário (decodificados) ao objeto request para uso posterior
    req.user = decoded;

    // Passa a requisição para o próximo middleware ou rota protegida
    return next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Token inválido ou expirado" });
  } 
  
}
