import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { handleResumeUpload } from "../controllers/resume.controller";

const router = Router();

router.post("/upload", verifyToken, upload.single("resume"), handleResumeUpload);

export default router;