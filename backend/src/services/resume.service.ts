import { supabase } from "../config/supabase";
import { extractTextFromFile } from "./parser.service";

export const uploadResume = async (
  userId: string,
  file: Express.Multer.File
) => {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  // 1. Upload file buffer to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  // 2. Get a signed URL (since the bucket is private)
  const { data: signedUrlData, error: urlError } = await supabase.storage
    .from("resumes")
    .createSignedUrl(fileName, 60 * 60 * 24 * 7); // valid 7 days

  if (urlError) throw new Error(urlError.message);

  // 3. Extract text from the file
  const resumeText = await extractTextFromFile(file.buffer, file.mimetype);

  // 4. Save a record in the resumes table
  const { data: resumeRecord, error: dbError } = await supabase
    .from("resumes")
    .insert({
      user_id: userId,
      file_url: signedUrlData.signedUrl,
      resume_text: resumeText,
    })
    .select()
    .single();

  if (dbError) throw new Error(dbError.message);

  return resumeRecord;
};

// upload to supabase and save the record


export const deleteResume = async (userId: string, resumeId: string) => {
  // Confirm ownership first
  const { data: resume, error: fetchError } = await supabase
    .from("resumes")
    .select("id, user_id, file_url")
    .eq("id", resumeId)
    .single();

  if (fetchError || !resume) throw new Error("Resume not found");
  if (resume.user_id !== userId) throw new Error("Not authorized to delete this resume");

  // Delete associated analyses first (foreign key safety, though CASCADE should handle it)
  await supabase.from("analyses").delete().eq("resume_id", resumeId);

  // Delete the resume record
  const { error: deleteError } = await supabase
    .from("resumes")
    .delete()
    .eq("id", resumeId);

  if (deleteError) throw new Error(deleteError.message);

  return { message: "Resume deleted successfully" };
};

