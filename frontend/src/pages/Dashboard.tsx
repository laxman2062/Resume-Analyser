import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { uploadResume } from "../services/resume.service";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".docx")) {
      setError("Only PDF or DOCX files are supported.");
      return;
    }
    setError("");
    setUploading(true);

    try {
      const data = await uploadResume(file);
      navigate(`/dashboard/analyze/${data.resume.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="w-10 h-[3px] bg-accent rounded-full mb-6" />
        <h1 className="font-display text-3xl text-text-primary mb-2">
          Hey {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-text-secondary font-body text-sm mb-10">
          Upload a resume to get AI-powered ATS scoring and feedback
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body">
            {error}
          </div>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed px-8 py-16 flex flex-col items-center justify-center text-center transition-colors ${
            dragActive
              ? "border-accent bg-accent/5"
              : "border-border bg-surface hover:border-accent/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={onFileSelect}
            className="hidden"
          />

          {uploading ? (
            <>
              <Loader2 size={36} className="text-accent animate-spin mb-4" />
              <p className="font-body text-text-primary text-sm">
                Uploading and extracting text...
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <UploadCloud size={26} className="text-accent" />
              </div>
              <p className="font-body text-text-primary text-sm mb-1">
                <span className="text-accent font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="font-body text-text-secondary text-xs">
                PDF or DOCX, up to 5MB
              </p>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center gap-2 text-text-secondary text-xs font-body">
          <FileText size={14} />
          <span>Your resume is stored securely and never shared</span>
        </div>
      </div>
    </DashboardLayout>
  );
}