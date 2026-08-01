import OpenAI from "openai";
import { AnalysisResult } from "../types/analysis.types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const analyzeResumeAgainstJD = async (
  resumeText: string,
  jdText: string
): Promise<AnalysisResult> => {
  const prompt = `
You are an ATS (Applicant Tracking System) resume analyzer. Compare the RESUME against the JOB DESCRIPTION and return ONLY valid JSON (no markdown, no backticks, no preamble) matching exactly this shape:

{
  "ats_score": number (0-100, how well resume matches JD for ATS parsing/keyword match),
  "grammar_score": number (0-100, grammar and formatting quality of the resume),
  "keyword_score": number (0-100, percentage of key JD skills/terms found in resume),
  "overall_score": number (0-100, weighted overall fit),
  "feedback": {
    "missing_keywords": string[] (important JD keywords/skills missing from resume),
    "strengths": string[] (what the resume does well relative to this JD),
    "improvements": string[] (specific actionable suggestions),
    "summary": string (2-3 sentence overall assessment)
  }
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const raw = response.choices[0].message.content || "{}";

  // Strip accidental markdown fences, just in case
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    return parsed as AnalysisResult;
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON");
  }
};