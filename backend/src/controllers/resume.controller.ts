import { Request, Response } from "express";
import { uploadResume } from "../services/resume.service";

export const handleResumeUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user!.userId; // set by verifyToken middleware

    const resume = await uploadResume(userId, req.file);

    res.status(201).json({ message: "Resume uploaded successfully", resume });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};