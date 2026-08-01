import { Request, Response } from "express";
import { getUserHistory } from "../services/history.service";

export const handleGetHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const history = await getUserHistory(userId);

    res.status(200).json({ history });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};