import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./config/supabase";
import authRoutes from "./routes/auth.routes";
import resumeRoutes from "./routes/resume.routes";
import analysisRoutes from "./routes/analysis.routes";
import historyRoutes from "./routes/history.routes";
import rewriteRoutes from "./routes/rewrite.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Resume Analyzer API   🚀" });
});


app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/analyses", analysisRoutes);
app.use("/api/users", historyRoutes);
app.use("/api", rewriteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});