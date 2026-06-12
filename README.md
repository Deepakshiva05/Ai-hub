# Premium AI Hub Application

An ultra-premium AI Hub application worth 30 Lakhs with React frontend, FastAPI backend, and MongoDB database. It delivers a stunning dark-theme aesthetic, rich glassmorphism layouts, custom interactive mouse-reactive particle backgrounds, spring-based UI transitions, and keyboard-driven Alt-navigation controls.

## Project Structure
```
ai-hub-premium/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/          # PremiumNavbar, AnimatedSidebar, GlassFooter, PremiumBackground
│   │   │   ├── Dashboard/       # StatsCards, ActivityChart, RecentActivity, UsageAnalytics
│   │   │   ├── ImageGenerator/  # ImageGenerator, PromptEnhancer, GalleryView, ImageEditor
│   │   │   ├── Summarizer/      # PremiumSummarizer, DocumentViewer, KeyPointsExtractor, ExportOptions
│   │   │   ├── RAGChat/         # PremiumChat, DocumentUploader, ContextWindow, MessageBubble, TypingIndicator
│   │   │   ├── Translator/      # PremiumTranslator, LanguageSelector, PronunciationGuide, TranslationHistory
│   │   │   └── PremiumUI/       # GlowingButton, AnimatedModal, PremiumToast, LoadingSkeleton, ParticleBackground, GradientText, HoverCard, AnimatedInput
│   │   ├── hooks/               # usePremiumAnimation, useScrollReveal, useParticleEffect
│   │   └── styles/              # globals.css, animations.css, premium-theme.css
│   ├── package.json
│   └── tailwind.config.js
├── backend-fastapi/
│   ├── app/
│   │   ├── main.py              # Application entry, CORS, telemetry endpoints
│   │   ├── config.py            # Environment manager
│   │   ├── database.py          # PyMongo handler & Local fallback databases
│   │   ├── models.py            # Pydantic schemas
│   │   └── routers/             # image, summarization, rag, translation
│   └── requirements.txt
└── docker-compose.yml
```

---

## Configuration & Environments

The application uses **only 3 environment variables** to configure the entire stack. Copy the template or write these to `backend-fastapi/.env`:

```env
HUGGINGFACE_API_KEY=hf_YOUR_API_KEY_HERE
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
DATABASE_NAME=ai_hub_premium
```

### Premium Fallback Resiliency
- **Hugging Face Key Inactive**: If the API key is not provided, the backend initiates procedural generators:
  - *Image Generator*: Synthesizes beautiful, abstract SVG vector graphics in base64 matching the selected style.
  - *Summarizer*: Runs a localized word-frequency extraction summary algorithm.
  - *RAG Chatbot*: Matches chat terms against ingested segments using local TF-IDF style calculations.
  - *Translator*: Restores local vocab mappings and phonetic phonetic guides.
- **MongoDB Connection Timed out**: If MongoDB connection fails, the database controller mounts a thread-safe, in-memory collection layer. The application runs **100% out-of-the-box** regardless of external database status.

---

## One-Command Docker Deployment

You can run the entire premium stack using Docker Compose:

```bash
docker-compose up --build
```
- Frontend will serve on: `http://localhost` (Port 80)
- Backend will serve on: `http://localhost:8000`

---

## Local Development Startup

If you wish to run services locally:

### 1. Backend (FastAPI)
Navigate to the backend folder, create a python virtual environment, install requirements, and run uvicorn:
```bash
cd backend-fastapi
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The API Swagger documentation will serve on `http://127.0.0.1:8000/docs`.

### 2. Frontend (React + Vite)
Navigate to the frontend folder, install packages, and start the development server:
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
The interface will serve on `http://localhost:5173`.
