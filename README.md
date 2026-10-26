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
- **src/documents** — PDF loading and recursive text chunking
- **src/embeddings** — explicit embedding-provider factory
- **src/vectorstore** — Chroma persistence and similarity retrieval
- **src/graph** — LangGraph state, nodes, routing, and graph builder
- **src/services** — chat generation and document indexing
- **requirements.txt** — Python dependencies

## Setup

```bash
cp .env.example .env
# set GROQ_API_KEY in .env
# optionally set GROQ_MODEL to an active Groq model ID
# set EMBEDDING_PROVIDER and EMBEDDING_MODEL before indexing documents

npm install
python3 -m venv .venv
.venv/bin/pip install -r ai-agent/requirements.txt
```

## Development

```bash
npm run dev
```

- API: http://127.0.0.1:8000 (health: `/health`, chat: `POST /api/chat`)
- Documents: `GET /api/documents/status`, `POST /api/documents/index`
- AI agent: http://127.0.0.1:8001 (health: `/health`, generation: `POST /generate`)
- UI: http://localhost:5173

The UI can upload PDF files, show the indexed chunk count, and enable
document-grounded answers with the **Use documents** toggle. Configure an
embedding provider before uploading:

```env
EMBEDDING_PROVIDER=openai
EMBEDDING_MODEL=text-embedding-3-small
OPENAI_API_KEY=your_key
```

For Gemini embeddings only, use:

```env
EMBEDDING_PROVIDER=gemini
EMBEDDING_MODEL=models/gemini-embedding-001
GOOGLE_API_KEY=your_google_ai_key
```

Or run separately:

```bash
npm run dev:backend
npm run dev:frontend
npm run dev:ai-agent
```

Document indexing is intentionally separate from chat generation. Use
the indexing command after setting `EMBEDDING_PROVIDER`:

```bash
npm run index-documents -- ./documents/example.pdf
```

The command delegates to `src.services.indexing_service.index_pdf(path)`:

```text
PDF → PyPDFLoader → RecursiveCharacterTextSplitter → embeddings → Chroma
```

Chat requests use the LangGraph workflow:

```text
question → prepare → optional Chroma retrieval → Groq answer
```

The current `/generate` route keeps retrieval disabled until documents and an
embedding provider are configured. Set `use_retrieval` through a future
document-chat route when the ingestion workflow is ready.

## Production (e.g. Render)

- **Root directory:** repository root
- **Build:** `npm install && .venv/bin/pip install -r ai-agent/requirements.txt`
- **Start:** run the Python AI service and Node backend separately
- Set `GROQ_API_KEY`, `GROQ_MODEL`, `AI_AGENT_URL`, `PORT`, and `CORS_ORIGINS` in the host dashboard.
