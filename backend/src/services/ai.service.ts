import OpenAI from "openai";
import { AnalysisResult, RewriteResult, CoverLetterResult } from "../types/analysis.types";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export const analyzeResumeAgainstJD = async (
  resumeText: string,
  jdText: string
): Promise<AnalysisResult> => {
  const prompt = `
You are an ATS (Applicant Tracking System) resume analyzer. Compare the RESUME against the JOB DESCRIPTION and return ONLY valid JSON matching exactly this shape:

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

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content || "{}";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned) as AnalysisResult;
  } catch (err) {
    console.error("Raw AI response that failed to parse (analyze):", raw);
    throw new Error("Failed to parse AI response as JSON");
  }
};

export const rewriteResume = async (
  resumeText: string,
  jdText: string
): Promise<RewriteResult> => {
  const prompt = `
You are a professional resume writer. Rewrite the RESUME below to better match the JOB DESCRIPTION — improve wording, quantify achievements where possible, align keywords naturally (no keyword stuffing), and keep it truthful (don't invent experience). Preserve the original structure (sections, roughly same length).

Return ONLY valid JSON matching exactly this shape:

{
  "rewritten_resume": string (the full rewritten resume text, use \\n for line breaks),
  "changes_made": string[] (short bullet list of what was changed and why)
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content || "{}";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned) as RewriteResult;
  } catch (err) {
    console.error("Raw AI response that failed to parse (rewrite):", raw);
    throw new Error("Failed to parse AI rewrite response as JSON");
  }
};

export const generateCoverLetter = async (
  resumeText: string,
  jdText: string
): Promise<CoverLetterResult> => {
  const prompt = `
You are a professional cover letter writer. Using the RESUME and JOB DESCRIPTION below, write a compelling, personalized cover letter (3-4 paragraphs, professional tone, no placeholders like [Company Name] — infer or keep it generic and natural where details are unknown).

Return ONLY valid JSON matching exactly this shape:

{
  "cover_letter": string (the full cover letter text, use \\n for paragraph breaks)
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0].message.content || "{}";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned) as CoverLetterResult;
  } catch (err) {
    console.error("Raw AI response that failed to parse (cover letter):", raw);
    throw new Error("Failed to parse AI cover letter response as JSON");
  }
};