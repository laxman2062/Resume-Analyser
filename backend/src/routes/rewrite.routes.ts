import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { handleRewrite, handleCoverLetter } from "../controllers/rewrite.controller";

const router = Router();

router.post("/rewrite", verifyToken, handleRewrite);
router.post("/cover-letter", verifyToken, handleCoverLetter);

export default router;