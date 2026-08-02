import { Request, Response } from "express";
import { runRewrite, runCoverLetter } from "../services/rewrite.service";

export const handleRewrite = async (req: Request, res: Response) => {
  try {
    const { resumeId, jdText } = req.body;

    if (!resumeId || !jdText) {
      return res.status(400).json({ error: "resumeId and jdText are required" });
    }

    const userId = req.user!.userId;
    const result = await runRewrite(userId, resumeId, jdText);

    res.status(200).json({ message: "Resume rewritten", result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleCoverLetter = async (req: Request, res: Response) => {
  try {
    const { resumeId, jdText } = req.body;

    if (!resumeId || !jdText) {
      return res.status(400).json({ error: "resumeId and jdText are required" });
    }

    const userId = req.user!.userId;
    const result = await runCoverLetter(userId, resumeId, jdText);

    res.status(200).json({ message: "Cover letter generated", result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};