import { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, Loader2, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "../components/DashboardLayout";
import { analyzeResume } from "../services/resume.service";

interface AnalysisFeedback {
  missing_keywords: string[];
  strengths: string[];
  improvements: string[];
  summary: string;
}

interface AnalysisData {
  ats_score: number;
  grammar_score: number;
  keyword_score: number;
  overall_score: number;
  feedback: AnalysisFeedback;
}

const ScoreRing = ({ label, score }: { label: string; score: number }) => {
  const colorClass =
    score >= 80 ? "text-success border-success" : score >= 50 ? "text-accent border-accent" : "text-red-400 border-red-400";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`w-20 h-20 rounded-full border-4 ${colorClass} flex items-center justify-center bg-bg/40`}
      >
        <span className={`font-mono text-xl font-semibold ${colorClass.split(" ")[0]}`}>
          {score}
        </span>
      </div>
      <span className="text-xs text-text-secondary font-body text-center whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};

export default function AnalyzePage() {
  const { resumeId } = useParams();
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  const handleAnalyze = async () => {
    if (!jdText.trim()) {
      setError("Paste a job description first.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await analyzeResume(resumeId!, jdText);
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.error || "Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="w-10 h-[3px] bg-accent rounded-full mb-6" />
        <h1 className="font-display text-3xl text-text-primary mb-2">
          Analyze against a job
        </h1>
        <p className="text-text-secondary font-body text-sm mb-8">
          Paste the job description below to score your resume and get tailored feedback
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body">
            {error}
          </div>
        )}

        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          rows={8}
          placeholder="Paste the job description here..."
          className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary/50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all resize-none"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 flex items-center gap-2 bg-accent text-bg font-body font-semibold text-sm rounded-lg px-6 py-3 hover:brightness-110 active:brightness-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Analyze Resume
            </>
          )}
        </button>

        {analysis && (
          <div className="mt-12 space-y-8">
            {/* Score rings */}
            <div className="bg-surface border border-border rounded-2xl px-8 py-8 flex flex-wrap justify-around gap-6">
              <ScoreRing label="Overall" score={analysis.overall_score} />
              <ScoreRing label="ATS Match" score={analysis.ats_score} />
              <ScoreRing label="Keywords" score={analysis.keyword_score} />
              <ScoreRing label="Grammar" score={analysis.grammar_score} />
            </div>

            {/* Summary */}
            <div className="bg-surface border border-border rounded-2xl px-8 py-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-accent" />
                <h3 className="font-body font-semibold text-text-primary text-sm">
                  Summary
                </h3>
              </div>
              <p className="text-text-secondary font-body text-sm leading-relaxed">
                {analysis.feedback.summary}
              </p>
            </div>

           {/* Strengths */}
            <div className="bg-surface border border-border rounded-2xl px-8 py-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={16} className="text-success" />
                <h3 className="font-body font-semibold text-text-primary text-sm">
                  Strengths
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {analysis.feedback.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-success mt-1 text-xs">●</span>
                    <span className="text-text-secondary font-body text-sm leading-relaxed">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-surface border border-border rounded-2xl px-8 py-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={16} className="text-accent" />
                <h3 className="font-body font-semibold text-text-primary text-sm">
                  Suggested Improvements
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {analysis.feedback.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-accent mt-1 text-xs">●</span>
                    <span className="text-text-secondary font-body text-sm leading-relaxed">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing keywords - the "highlighter" signature moment */}
            <div className="bg-surface border border-border rounded-2xl px-8 py-6">
              <h3 className="font-body font-semibold text-text-primary text-sm mb-4">
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.feedback.missing_keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}