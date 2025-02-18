import { Router } from "express";
import { register, login, verifyToken } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify_token", verifyToken as any, (req, res) => {
    res.json({ success: true, message: "Token verificado com sucesso!" });
});

export default router;
