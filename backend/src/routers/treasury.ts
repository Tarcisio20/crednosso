import { Router } from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { getAll } from "../controllers/treasuryController";

const router = Router();

router.post("/", authenticate,  getAll);

export default router;
