import { supabase } from "../config/supabase";

export const getUserHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from("resumes")
    .select(`
      id,
      file_url,
      resume_text,
      score,
      created_at,
      analyses (
        id,
        jd_text,
        ats_score,
        grammar_score,
        keyword_score,
        overall_score,
        feedback,
        created_at
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};