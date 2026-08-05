import api from "./api";

export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await api.post("/resumes/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // { message, resume }
};

export const getHistory = async () => {
  const res = await api.get("/users/history");
  return res.data; // { history }
};

export const analyzeResume = async (resumeId: string, jdText: string) => {
  const res = await api.post("/analyses/analyze", { resumeId, jdText });
  return res.data; // { message, analysis }
};

export const deleteResume = async (resumeId: string) => {
  const res = await api.delete(`/resumes/${resumeId}`);
  return res.data;
};