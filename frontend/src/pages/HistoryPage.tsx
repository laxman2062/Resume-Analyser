import { useEffect, useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import { FileText, Calendar, ChevronRight, Inbox, Loader2 } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { getHistory , deleteResume  } from "../services/resume.service";
import { Trash2 } from "lucide-react";

interface Analysis {
  id: string;
  overall_score: number;
  created_at: string;
}

interface ResumeEntry {
  id: string;
  resume_text: string;
  score: number | null;
  created_at: string;
  analyses: Analysis[];
}

const scoreColor = (score: number | null) => {
  if (score === null) return "text-text-secondary";
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-accent";
  return "text-red-400";
};

// Pull a name-like first line from resume text for display
const getResumeTitle = (text: string) => {
  const firstLine = text.trim().split("\n")[0]?.trim();
  return firstLine && firstLine.length < 60 ? firstLine : "Resume";
};

export default function HistoryPage() {
  const [history, setHistory] = useState<ResumeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data.history);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);
  const handleDelete = async (e: React.MouseEvent, resumeId: string) => {
  e.preventDefault();
  e.stopPropagation();

  if (!confirm("Delete this resume and all its analyses? This can't be undone.")) return;

  try {
    await deleteResume(resumeId);
    setHistory((prev) => prev.filter((r) => r.id !== resumeId));
  } catch (err: any) {
    alert(err.response?.data?.error || "Failed to delete resume.");
  }
};

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="w-10 h-[3px] bg-accent rounded-full mb-6" />
        <h1 className="font-display text-3xl text-text-primary mb-2">
          Resume History
        </h1>
        <p className="text-text-secondary font-body text-sm mb-10">
          All your uploaded resumes and past analyses
        </p>

        {loading && (
          <div className="flex items-center gap-3 text-text-secondary font-body text-sm">
            <Loader2 size={18} className="animate-spin text-accent" />
            Loading history...
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body">
            {error}
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center bg-surface border border-dashed border-border rounded-2xl py-16 px-8">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Inbox size={24} className="text-accent" />
            </div>
            <p className="font-body text-text-primary text-sm mb-1">
              No resumes yet
            </p>
            <p className="font-body text-text-secondary text-xs mb-6">
              Upload your first resume to see it here
            </p>
            <Link
              to="/dashboard"
              className="bg-accent text-bg font-body font-semibold text-sm rounded-lg px-5 py-2.5 hover:brightness-110 transition-all"
            >
              Upload a resume
            </Link>
          </div>
        )}

        {!loading && !error && history.length > 0 && (
          <div className="flex flex-col gap-3">
            {history.map((entry) => (
              <Link
                key={entry.id}
                to={`/dashboard/analyze/${entry.id}`}
                className="group flex items-center justify-between gap-4 bg-surface border border-border rounded-xl px-5 py-4 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-text-primary text-sm truncate">
                      {getResumeTitle(entry.resume_text)}
                    </p>
                    <div className="flex items-center gap-1.5 text-text-secondary text-xs font-body mt-0.5">
                      <Calendar size={12} />
                      {new Date(entry.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <span className="mx-1">·</span>
                      {entry.analyses.length} analys
                      {entry.analyses.length === 1 ? "is" : "es"}
                    </div>
                  </div>
                </div>

                {!loading && !error && history.length > 0 && (
          <div className="flex flex-col gap-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                onClick={() => navigate(`/dashboard/analyze/${entry.id}`)}
                className="group flex items-center justify-between gap-4 bg-surface border border-border rounded-xl px-5 py-4 hover:border-accent/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-text-primary text-sm truncate">
                      {getResumeTitle(entry.resume_text)}
                    </p>
                    <div className="flex items-center gap-1.5 text-text-secondary text-xs font-body mt-0.5">
                      <Calendar size={12} />
                      {new Date(entry.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <span className="mx-1">·</span>
                      {entry.analyses.length} analys
                      {entry.analyses.length === 1 ? "is" : "es"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className={`font-mono text-lg font-semibold ${scoreColor(entry.score)}`}>
                    {entry.score ?? "—"}
                  </span>
                  <button
  onClick={(e) => handleDelete(e, entry.id)}
  className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors relative z-10"
  aria-label="Delete resume"
>
  <Trash2 size={16} />
</button>
                  <ChevronRight
                    size={18}
                    className="text-text-secondary group-hover:text-accent group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}