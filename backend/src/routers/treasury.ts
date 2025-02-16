import { Router } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

router.post("/", register);

export default router;
