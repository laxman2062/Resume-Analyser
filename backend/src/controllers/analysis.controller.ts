import { Request, Response } from "express";
import { runAnalysis } from "../services/analysis.service";

export const handleAnalyze = async (req: Request, res: Response) => {
  try {
    const { resumeId, jdText } = req.body;

    if (!resumeId || !jdText) {
      return res.status(400).json({ error: "resumeId and jdText are required" });
    }

    const userId = req.user!.userId;

    const analysis = await runAnalysis(userId, resumeId, jdText);

    res.status(201).json({ message: "Analysis complete", analysis });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};