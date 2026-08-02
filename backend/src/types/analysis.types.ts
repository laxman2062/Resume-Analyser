export interface AnalyzeInput {
  resumeId: string;
  jdText: string;
}

export interface AnalysisFeedback {
  missing_keywords: string[];
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface AnalysisResult {
  ats_score: number;
  grammar_score: number;
  keyword_score: number;
  overall_score: number;
  feedback: AnalysisFeedback;
}
export interface RewriteResult {
  rewritten_resume: string;
  changes_made: string[];
}

export interface CoverLetterResult {
  cover_letter: string;
}