import mammoth from "mammoth";
const pdfParse = require("pdf-parse");

export const extractTextFromFile = async (
  buffer: Buffer,
  mimetype: string
): Promise<string> => {
  if (mimetype === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported file type");
};