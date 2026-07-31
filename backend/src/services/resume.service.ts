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