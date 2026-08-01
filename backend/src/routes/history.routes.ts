import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { handleGetHistory } from "../controllers/history.controller";

const router = Router();

router.get("/history", verifyToken, handleGetHistory);

export default router;