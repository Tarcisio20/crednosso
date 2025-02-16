import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../services/userServices";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (req: Request, res: Response) => {
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
