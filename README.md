# Resume.AI — AI-Powered Resume Analyzer

A full-stack web app that analyzes resumes against job descriptions — ATS scoring, keyword matching, AI feedback, resume rewriting, and cover letter generation.

## Features
- 🔐 JWT authentication with bcrypt password hashing
- 📄 Resume upload & parsing (PDF/DOCX)
- 🎯 AI-powered ATS scoring against any job description
- 🔍 Missing keyword detection
- 💡 AI feedback — strengths, improvements, summary
- ✍️ AI resume rewrite
- 📝 AI cover letter generation
- 🕘 Resume history with delete
- 🌗 Dark/light mode toggle

## Tech Stack
**Frontend:** React, TypeScript, Vite, Tailwind CSS v4, React Router, Axios, Lucide Icons
**Backend:** Node.js, Express, TypeScript, JWT, bcryptjs, Multer, pdf-parse, mammoth, Groq API (Llama 3.3 70B)
**Database/Storage:** Supabase (PostgreSQL + private file storage)

## Architecture

resume-analyser/
├── frontend/src/
│ ├── components/ # Sidebar, ThemeToggle, etc.
│ ├── context/ # Auth & Theme contexts
│ ├── pages/ # Login, Dashboard, AnalyzePage, History
│ └── services/ # Axios API layer
└── backend/src/
├── config/ # Supabase client
├── middleware/ # JWT auth, file upload
├── routes/ # Express routes
├── controllers/ # Request handlers
├── services/ # DB queries, AI calls, parsing
└── types/ # Shared TS interfaces

## Database Schema
```sql
users (id, name, email, password, created_at)
resumes (id, user_id, file_url, resume_text, score, created_at)
analyses (id, resume_id, jd_text, ats_score, grammar_score,
          keyword_score, overall_score, feedback, created_at)
```

## API Endpoints
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | ❌ |
| POST | `/api/auth/login` | ❌ |
| GET | `/api/auth/me` | ✅ |
| POST | `/api/resumes/upload` | ✅ |
| DELETE | `/api/resumes/:resumeId` | ✅ |
| GET | `/api/users/history` | ✅ |
| POST | `/api/analyses/analyze` | ✅ |
| POST | `/api/rewrite` | ✅ |
| POST | `/api/cover-letter` | ✅ |

## Getting Started
**Prerequisites:** Node.js 18+, a Supabase project, a Groq API key

```bash
git clone https://github.com/<your-username>/resume-analyser.git
cd resume-analyser
```

**Backend:**
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
JWT_SECRET=your_random_secret
GROQ_API_KEY=your_groq_key
```

Run the schema above in Supabase SQL Editor, create a **private** Storage bucket named `resumes`, then:
```bash
npm run dev
```

**Frontend:**
```bash
cd ../frontend
npm install
npm run dev
```

App runs at `localhost:5173`, API at `localhost:5000`.

## Security Notes
- Passwords hashed with bcrypt, never stored plaintext
- JWT gates all protected routes
- Ownership checks on every resume/analysis request
- Supabase `service_role` key stays backend-only, never committed
- Resume files stored privately, accessed via signed URLs

> Before production: add rate limiting, restrict CORS, cap input lengths.

## Roadmap
- [x] Auth, upload, analysis, history, rewrite, cover letter
- [ ] Rewrite/cover letter UI
- [ ] Profile page
- [ ] Security hardening + Vercel deployment

## Author
**Laxman Pant** — CSE, Jain (Deemed-to-be University), Bengaluru

## License
MIT
