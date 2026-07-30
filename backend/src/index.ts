import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./config/supabase";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Resume Analyzer API is  🚀" });
});


app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});