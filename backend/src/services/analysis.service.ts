import { supabase } from "../config/supabase";
import { analyzeResumeAgainstJD } from "./ai.service";

export const runAnalysis = async (userId: string, resumeId: string, jdText: string) => {
  // 1. Fetch the resume and confirm it belongs to this user
  const { data: resume, error: resumeError } = await supabase
    .from("resumes")
    .select("id, resume_text, user_id")
    .eq("id", resumeId)
    .single();

  if (resumeError || !resume) throw new Error("Resume not found");
  if (resume.user_id !== userId) throw new Error("Not authorized to analyze this resume");
  if (!resume.resume_text) throw new Error("Resume has no extracted text");

  // 2. Run AI analysis
  const result = await analyzeResumeAgainstJD(resume.resume_text, jdText);

  // 3. Save analysis record
  const { data: analysisRecord, error: dbError } = await supabase
    .from("analyses")
    .insert({
      resume_id: resumeId,
      jd_text: jdText,
      ats_score: result.ats_score,
      grammar_score: result.grammar_score,
      keyword_score: result.keyword_score,
      overall_score: result.overall_score,
      feedback: result.feedback,
    })
    .select()
    .single();

  if (dbError) throw new Error(dbError.message);

  // 4. Update the resume's overall score too (for quick dashboard display)
  await supabase
    .from("resumes")
    .update({ score: result.overall_score })
    .eq("id", resumeId);

  return analysisRecord;
};