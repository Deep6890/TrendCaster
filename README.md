<div align="center">

<br/>

# 📈 TrendCaster

### AI-Powered Indian Market Intelligence Platform

*Quantitative signals · RAG-powered chat · Behavioural finance tools*

<br/>

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)
![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6B35?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq_LLM-F55036?style=for-the-badge)

<br/>

> TrendCaster fetches live data from **14 Indian market instruments**, computes proprietary quantitative signals,
> runs rolling PCA macro factor analysis, and feeds everything into a RAG-powered AI —
> so every answer is grounded in real data, not generic advice.

<br/>

</div>

---

## ✨ Features

| Page | Description |
|------|-------------|
| 📊 **Dashboard** | Live tickers for Nifty 50, Sensex, Gold, Crude Oil, USD/INR & India VIX with ranked sector intelligence |
| 🤖 **Guardian AI** | Financial autopilot — evaluates trades against your income & risk profile, blocks unsafe investments |
| 💬 **Chat (RAG)** | Ask anything about Indian markets; AI retrieves live market context before answering |
| 🔭 **Regret Simulator** | Visualise the future cost of a bad decision before you make it |
| 🧠 **Mistake Memory** | Tracks past loss patterns and surfaces them when you're about to repeat them |
| 👥 **Crowd vs Smart Money** | Compares retail sentiment against institutional signals |
| ⏳ **Wait Power** | Quantifies the compounding value of patience in rupees |
| 🌍 **Life Impact** | Translates market moves into real-life impact — EMIs, groceries, fuel |
| 📰 **Daily Feed** | Market intelligence summaries generated from the latest pipeline run |

---

## 🏗️ Architecture

```
User Question
      │
      ▼
┌─────────────────────────────────────────────────────┐
│                   RAG Pipeline                      │
│                                                     │
│  ① yfinance  →  ② Signal Engine  →  ③ PCA Factors  │
│       ↓               ↓                   ↓         │
│  OHLCV Data     5 Signals/Asset    5 Macro Factors  │
│                                                     │
│  ④ LLM Input Builder  →  llm_market_state.json      │
│           ↓                                         │
│  ⑤ RAG Runner  →  ChromaDB + LlamaIndex             │
│           ↓                                         │
│  ⑥ Groq LLM  →  Grounded Answer                    │
└─────────────────────────────────────────────────────┘
```

### Pipeline steps

**① Data Fetch** — `Logic/fatcher/stockMarketLoader.py`
Pulls OHLCV history for all 14 instruments via `yfinance`.

**② Signal Engine** — `Logic/engine2/engine.py`
Computes 5 proprietary signals per instrument:
`trend_strength` · `trend_consistency` · `volatility_regime` · `momentum_acceleration` · `cycle_position`

**③ Rolling PCA** — `Logic/processor/pcaMaker.py`
Builds a cross-asset pivot matrix and extracts 5 latent macro factors, stored in MySQL.

**④ LLM Input Builder** — `Logic/LLMinput/inputGenerator.py`
Assembles a structured JSON snapshot: sector rankings, correlations, macro factor loadings.

**⑤ RAG Pipeline** — `Rag/ragRunner.py`
Converts market JSON → readable `.txt`, rebuilds LangChain Chroma + LlamaIndex vector stores.

**⑥ Groq LLM** — `Rag/llmEngine.py`
Intent detection routes queries → context retrieved → Groq generates a grounded answer.

---

## 🛠️ Tech Stack

### Frontend
| | Package | Version |
|---|---|---|
| ⚛️ | React | 19 |
| ⚡ | Vite | 7 |
| 🎨 | Tailwind CSS | v4 |
| 🔀 | React Router | v7 |
| 🖼️ | Lucide React | latest |

### Backend
| | Package | Purpose |
|---|---|---|
| 🐍 | Flask + Flask-CORS | REST API |
| 📈 | yfinance | Market data |
| 🔢 | pandas + numpy | Data processing |
| 🤖 | scikit-learn | PCA & signals |
| 🗄️ | mysql-connector-python | Database |

### AI / RAG
| | Package | Purpose |
|---|---|---|
| 🦜 | LangChain + LangChain-Chroma | RAG orchestration |
| 🦙 | LlamaIndex | PDF + advanced indexing |
| 🗃️ | ChromaDB | Vector store |
| 🔡 | sentence-transformers | Embeddings |
| ⚡ | Groq | LLM inference |

---

## 📁 Project Structure

```
TrendCaster/
├── Frontend/                    # React + Vite SPA
│   └── src/
│       ├── pages/               # Dashboard, GuardianAI, ChatPage, …
│       ├── components/          # Sidebar, Topbar, reusable UI
│       └── context/             # AppContext — global state
│
└── Backend/
    ├── Logic/
    │   ├── engine2/             # Signal computation engine
    │   ├── processor/           # Pivot matrix, PCA, cleaner
    │   ├── LLMinput/            # Market state JSON builder
    │   ├── schema/              # MySQL connector + SQL schema
    │   ├── fatcher/             # yfinance data loader
    │   └── piplineRunner.py     # Master orchestrator
    └── Rag/
        ├── indexing/            # LangChain + LlamaIndex builders
        ├── loaders/             # PDF + TXT document loaders
        ├── KnowledgeBasedData/  # 20 curated financial docs
        ├── LogicalData/         # Generated market state docs
        ├── llmEngine.py         # Groq intent + answer generation
        ├── retriever.py         # Unified context retrieval
        └── ragRunner.py         # RAG pipeline orchestrator
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8+
- [Groq API key](https://console.groq.com)

### 1 — Clone

```bash
git clone https://github.com/Deep6890/TrendCaster.git
cd TrendCaster
```

### 2 — Environment variables

```bash
cp Backend/.env.example Backend/.env
```

Fill in `Backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=trendcaster
```

### 3 — Backend setup

```bash
cd Backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 4 — Database

```bash
mysql -u root -p trendcaster < Backend/Logic/schema/TableCreation.sql
```

### 5 — Run the data pipeline

```bash
python Backend/Logic/piplineRunner.py
```

> This fetches market data, computes signals, runs PCA, and rebuilds the RAG vector index.

### 6 — Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📡 Tracked Instruments

| Index | Sectors | Commodities & FX |
|-------|---------|-----------------|
| Nifty 50 `^NSEI` | IT `^CNXIT` | Gold `GC=F` |
| Sensex `^BSESN` | Auto `^CNXAUTO` | Crude Oil `CL=F` |
| Bank Nifty `^NSEBANK` | Metal `^CNXMETAL` | USD-INR `INR=X` |
| | Realty `^CNXREALTY` | India VIX `^INDIAVIX` |
| | FMCG `^CNXFMCG` | |
| | Pharma `^CNXPHARMA` | |
| | Energy `^CNXENERGY` | |

---

## 📚 Knowledge Base

20 curated financial documents embedded in the vector store:

<details>
<summary>View all documents</summary>

| # | Document |
|---|----------|
| 01 | 📘 Basic Economic Questions & Answers |
| 02 | 📈 Investment Strategies for Normal Users |
| 03 | 🌐 Global Sector Correlations (Detailed) |
| 04 | 💡 Suggestions for Users Not in Stock Market |
| 05 | 🚨 Investment Steps During Global Crisis |
| 06 | 🥇 Investing When Gold & Markets Are Expensive |
| 07 | 🏠 Daily Life Economic Questions Answered |
| 08 | 📊 Understanding Stock Market Basics |
| 09 | 💸 Understanding Inflation for Households |
| 10 | 📋 Personal Budget Planning Economically |
| 11 | 🛢️ Oil Crisis Effects on Normal Life |
| 12 | 🏛️ Government Schemes for Normal Citizens |
| 13 | 💱 Currency Wars & Exchange Rates |
| 14 | 🧓 Retirement Planning for Normal Indians |
| 15 | 🏪 Small Business Economic Survival Guide |
| 16 | 🧾 Tax Saving for Normal Indians |
| 17 | 🔮 Global Economic Trends 2025–2030 |
| 18 | 🏦 Understanding the Banking System |
| 19 | ⚠️ Debt Traps & How to Escape |
| 20 | 📖 Economic Glossary — 100 Terms |

</details>

---

<div align="center">

**TrendCaster** — Built for Indian retail investors who deserve data-backed intelligence, not noise.

*Not financial advice · For educational purposes only*

</div>
