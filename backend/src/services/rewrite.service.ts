import { supabase } from "../config/supabase";
import { rewriteResume, generateCoverLetter } from "./ai.service";

const getOwnedResume = async (userId: string, resumeId: string) => {
  const { data: resume, error } = await supabase
    .from("resumes")
    .select("id, resume_text, user_id")
    .eq("id", resumeId)
    .single();

  if (error || !resume) throw new Error("Resume not found");
  if (resume.user_id !== userId) throw new Error("Not authorized to access this resume");
  if (!resume.resume_text) throw new Error("Resume has no extracted text");

  return resume;
};

export const runRewrite = async (userId: string, resumeId: string, jdText: string) => {
  const resume = await getOwnedResume(userId, resumeId);
  return rewriteResume(resume.resume_text, jdText);
};

export const runCoverLetter = async (userId: string, resumeId: string, jdText: string) => {
  const resume = await getOwnedResume(userId, resumeId);
  return generateCoverLetter(resume.resume_text, jdText);
};