import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { handleAnalyze } from "../controllers/analysis.controller";

const router = Router();

router.post("/analyze", verifyToken, handleAnalyze);

export default router;