# Luma Chatbot

Monorepo with three packages: **frontend**, **backend** (Node/Express), and **ai-agent** (Python/FastAPI with LangChain and Groq).

## Structure

```
Luma-Chatbot/
├── frontend/          # React + Vite UI
├── backend/           # HTTP API (routes → controllers → ai-agent)
├── ai-agent/          # Python AI service (FastAPI, LangChain, Groq)
├── package.json       # npm workspaces
└── .env               # GROQ_API_KEY (repo root)
```

### Frontend (layered)

- **api** — HTTP client (`sendChatMessage`)
- **features/chat** — hooks and constants (chat state)
- **components** — presentational UI

### Backend (layered)

- **routes** — HTTP paths
- **controllers** — request/response orchestration
- **middleware** — validation, errors
- **config** — env and CORS

### AI agent

- **src/main.py** — FastAPI application entry point
- **src/api** — HTTP routes and error translation
- **src/config** — environment-backed model settings
- **src/domain** — request and response schemas
- **src/llm** — LangChain/Groq model construction
- **src/prompts** — system prompts
- **src/services** — message construction and response generation
- **requirements.txt** — Python dependencies

## Setup

```bash
cp .env.example .env
# set GROQ_API_KEY in .env
# optionally set GROQ_MODEL to an active Groq model ID

npm install
python3 -m venv .venv
.venv/bin/pip install -r ai-agent/requirements.txt
```

## Development

```bash
npm run dev
```

- API: http://127.0.0.1:8000 (health: `/health`, chat: `POST /api/chat`)
- AI agent: http://127.0.0.1:8001 (health: `/health`, generation: `POST /generate`)
- UI: http://localhost:5173

Or run separately:

```bash
npm run dev:backend
npm run dev:frontend
npm run dev:ai-agent
```

## Production (e.g. Render)

- **Root directory:** repository root
- **Build:** `npm install && .venv/bin/pip install -r ai-agent/requirements.txt`
- **Start:** run the Python AI service and Node backend separately
- Set `GROQ_API_KEY`, `GROQ_MODEL`, `AI_AGENT_URL`, `PORT`, and `CORS_ORIGINS` in the host dashboard.
