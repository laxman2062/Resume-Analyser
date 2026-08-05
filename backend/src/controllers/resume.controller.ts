import { Request, Response } from "express";
import { uploadResume } from "../services/resume.service";
import { deleteResume } from "../services/resume.service";

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



export const handleDeleteResume = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { resumeId } = req.params;

    const result = await deleteResume(userId, resumeId);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};