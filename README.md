<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>TrendCaster — README</title>
<style>
  :root {
    --bg: #050505;
    --surface: #0d0d0d;
    --border: rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.14);
    --text: #ffffff;
    --muted: rgba(255,255,255,0.4);
    --dim: rgba(255,255,255,0.18);
    --green: #22c55e;
    --green-dim: rgba(34,197,94,0.12);
    --green-border: rgba(34,197,94,0.25);
    --blue: #60a5fa;
    --blue-dim: rgba(96,165,250,0.10);
    --blue-border: rgba(96,165,250,0.22);
    --yellow: #fbbf24;
    --yellow-dim: rgba(251,191,36,0.10);
    --yellow-border: rgba(251,191,36,0.22);
    --purple: #a78bfa;
    --purple-dim: rgba(167,139,250,0.10);
    --purple-border: rgba(167,139,250,0.22);
    --red: #f87171;
    --red-dim: rgba(248,113,113,0.10);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    min-height: 100vh;
  }
  a { color: var(--blue); text-decoration: none; }
  a:hover { text-decoration: underline; }
</style>
</head>
<body>

<!-- ═══════════════════════════════ HERO ═══════════════════════════════ -->
<header style="
  position:relative; overflow:hidden;
  background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(96,165,250,0.08) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 80% 50%, rgba(167,139,250,0.06) 0%, transparent 60%),
              var(--bg);
  border-bottom: 1px solid var(--border);
  padding: 80px 24px 64px;
  text-align: center;
">
  <div style="max-width:760px; margin:0 auto; position:relative; z-index:1;">
    <div style="
      display:inline-flex; align-items:center; gap:8px;
      background:rgba(96,165,250,0.08); border:1px solid var(--blue-border);
      border-radius:999px; padding:6px 16px; margin-bottom:28px;
      font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--blue);
    ">
      <span style="width:6px;height:6px;border-radius:50%;background:var(--blue);display:inline-block;animation:pulse 2s infinite;"></span>
      Indian Market Intelligence Platform
    </div>

    <h1 style="
      font-size:clamp(2.4rem,6vw,4rem); font-weight:800; letter-spacing:-.03em;
      background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.45));
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
      line-height:1.1; margin-bottom:20px;
    ">TrendCaster</h1>

    <p style="font-size:1.15rem; color:var(--muted); max-width:560px; margin:0 auto 36px; line-height:1.7;">
      A full-stack AI-powered platform that analyses Indian stock market sectors in real time,
      runs quantitative signals through a RAG pipeline, and delivers intelligent financial guidance.
    </p>

    <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center;">
      <span class="badge" style="--c:var(--blue);--cd:var(--blue-dim);--cb:var(--blue-border);">React 19 + Vite</span>
      <span class="badge" style="--c:var(--green);--cd:var(--green-dim);--cb:var(--green-border);">Python + Flask</span>
      <span class="badge" style="--c:var(--purple);--cd:var(--purple-dim);--cb:var(--purple-border);">LangChain + ChromaDB</span>
      <span class="badge" style="--c:var(--yellow);--cd:var(--yellow-dim);--cb:var(--yellow-border);">Groq LLM</span>
      <span class="badge" style="--c:var(--red);--cd:var(--red-dim);--cb:rgba(248,113,113,0.22);">MySQL</span>
      <span class="badge" style="--c:var(--muted);--cd:rgba(255,255,255,0.04);--cb:var(--border);">Tailwind CSS v4</span>
    </div>
  </div>
</header>

<style>
  .badge {
    display:inline-flex; align-items:center;
    background:var(--cd); border:1px solid var(--cb);
    color:var(--c); border-radius:999px;
    padding:5px 14px; font-size:12px; font-weight:500; letter-spacing:.02em;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
</style>

<!-- ═══════════════════════════════ MAIN CONTENT ═══════════════════════════════ -->
<main style="max-width:960px; margin:0 auto; padding:64px 24px;">

<!-- ── OVERVIEW ── -->
<section style="margin-bottom:64px;">
  <p class="section-label">Overview</p>
  <h2 class="section-title">What is TrendCaster?</h2>
  <p style="color:var(--muted); font-size:.95rem; max-width:680px; line-height:1.8; margin-bottom:32px;">
    TrendCaster is a quantitative market intelligence system built for Indian retail investors.
    It fetches live data from 14 market instruments, computes proprietary signals, runs PCA-based
    macro factor analysis, and feeds everything into a RAG-powered AI that answers financial questions
    with real, data-backed context — not generic advice.
  </p>

  <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px;">
    <div class="stat-card">
      <div class="stat-num" style="color:var(--blue);">14</div>
      <div class="stat-label">Market Instruments Tracked</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--green);">5</div>
      <div class="stat-label">PCA Macro Factors</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--purple);">20+</div>
      <div class="stat-label">Knowledge Base Documents</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--yellow);">9</div>
      <div class="stat-label">AI-Powered App Pages</div>
    </div>
  </div>
</section>

<style>
  .section-label {
    font-size:11px; letter-spacing:.14em; text-transform:uppercase;
    color:var(--dim); margin-bottom:8px;
  }
  .section-title {
    font-size:1.6rem; font-weight:700; letter-spacing:-.02em;
    color:var(--text); margin-bottom:16px;
  }
  .stat-card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:16px; padding:24px 20px; text-align:center;
    transition: border-color .2s;
  }
  .stat-card:hover { border-color:var(--border-hover); }
  .stat-num { font-size:2.4rem; font-weight:800; letter-spacing:-.04em; line-height:1; margin-bottom:8px; }
  .stat-label { font-size:.8rem; color:var(--muted); }
</style>

<!-- ── FEATURES ── -->
<section style="margin-bottom:64px;">
  <p class="section-label">Features</p>
  <h2 class="section-title">Everything in one platform</h2>

  <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px;">

    <div class="feat-card" style="--accent:var(--blue);">
      <div class="feat-icon" style="background:var(--blue-dim); border-color:var(--blue-border);">📊</div>
      <h3 class="feat-title">Live Market Dashboard</h3>
      <p class="feat-desc">Real-time tickers for Nifty 50, Sensex, Gold, Crude Oil, USD/INR and India VIX with sector intelligence rankings.</p>
    </div>

    <div class="feat-card" style="--accent:var(--purple);">
      <div class="feat-icon" style="background:var(--purple-dim); border-color:var(--purple-border);">🤖</div>
      <h3 class="feat-title">Guardian AI</h3>
      <p class="feat-desc">Financial autopilot that evaluates trades against your income, risk profile, and market conditions — and can block unsafe investments.</p>
    </div>

    <div class="feat-card" style="--accent:var(--green);">
      <div class="feat-icon" style="background:var(--green-dim); border-color:var(--green-border);">💬</div>
      <h3 class="feat-title">RAG-Powered Chat</h3>
      <p class="feat-desc">Ask anything about Indian markets. The AI retrieves context from live market data + a curated knowledge base before answering.</p>
    </div>

    <div class="feat-card" style="--accent:var(--yellow);">
      <div class="feat-icon" style="background:var(--yellow-dim); border-color:var(--yellow-border);">🔭</div>
      <h3 class="feat-title">Regret Simulator</h3>
      <p class="feat-desc">Visualise the future cost of a bad investment decision before you make it. See potential outcomes across time horizons.</p>
    </div>

    <div class="feat-card" style="--accent:var(--red);">
      <div class="feat-icon" style="background:var(--red-dim); border-color:rgba(248,113,113,0.22);">🧠</div>
      <h3 class="feat-title">Mistake Memory</h3>
      <p class="feat-desc">Tracks your past loss patterns and surfaces them when you're about to repeat the same mistake.</p>
    </div>

    <div class="feat-card" style="--accent:var(--blue);">
      <div class="feat-icon" style="background:var(--blue-dim); border-color:var(--blue-border);">👥</div>
      <h3 class="feat-title">Crowd vs Smart Money</h3>
      <p class="feat-desc">Compares retail sentiment signals against institutional positioning to reveal who's actually right.</p>
    </div>

    <div class="feat-card" style="--accent:var(--green);">
      <div class="feat-icon" style="background:var(--green-dim); border-color:var(--green-border);">⏳</div>
      <h3 class="feat-title">Wait Power</h3>
      <p class="feat-desc">Quantifies the compounding value of patience — shows what waiting for a better entry is actually worth in rupees.</p>
    </div>

    <div class="feat-card" style="--accent:var(--purple);">
      <div class="feat-icon" style="background:var(--purple-dim); border-color:var(--purple-border);">🌍</div>
      <h3 class="feat-title">Life Impact</h3>
      <p class="feat-desc">Translates market moves into real-life financial impact — EMIs, groceries, fuel — so numbers feel personal.</p>
    </div>

    <div class="feat-card" style="--accent:var(--yellow);">
      <div class="feat-icon" style="background:var(--yellow-dim); border-color:var(--yellow-border);">📰</div>
      <h3 class="feat-title">Daily Feed</h3>
      <p class="feat-desc">Curated daily market whispers and intelligence summaries generated from the latest quantitative pipeline run.</p>
    </div>

  </div>
</section>

<style>
  .feat-card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:16px; padding:24px; transition:border-color .2s, transform .2s;
  }
  .feat-card:hover { border-color:var(--border-hover); transform:translateY(-2px); }
  .feat-icon {
    width:40px; height:40px; border-radius:10px; border:1px solid;
    display:flex; align-items:center; justify-content:center;
    font-size:18px; margin-bottom:14px;
  }
  .feat-title { font-size:.95rem; font-weight:600; color:var(--text); margin-bottom:8px; }
  .feat-desc  { font-size:.82rem; color:var(--muted); line-height:1.65; }
</style>

<!-- ── ARCHITECTURE ── -->
<section style="margin-bottom:64px;">
  <p class="section-label">Architecture</p>
  <h2 class="section-title">How it works</h2>

  <div style="background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:32px; margin-bottom:24px;">
    <div style="display:flex; flex-direction:column; gap:0;">

      <div class="pipe-step" style="--c:var(--blue);">
        <div class="pipe-num" style="background:var(--blue-dim); border-color:var(--blue-border); color:var(--blue);">1</div>
        <div>
          <div class="pipe-title">Data Fetch — <code>yfinance</code></div>
          <div class="pipe-desc">Pulls OHLCV data for 14 instruments: Nifty, Sensex, Bank Nifty, 8 sector indices, Gold, Crude Oil, USD-INR, India VIX.</div>
        </div>
      </div>

      <div class="pipe-arrow">↓</div>

      <div class="pipe-step" style="--c:var(--purple);">
        <div class="pipe-num" style="background:var(--purple-dim); border-color:var(--purple-border); color:var(--purple);">2</div>
        <div>
          <div class="pipe-title">Signal Engine — <code>engine2/engine.py</code></div>
          <div class="pipe-desc">Computes 5 proprietary signals per instrument: trend strength, trend consistency, volatility regime, momentum acceleration, cycle position.</div>
        </div>
      </div>

      <div class="pipe-arrow">↓</div>

      <div class="pipe-step" style="--c:var(--green);">
        <div class="pipe-num" style="background:var(--green-dim); border-color:var(--green-border); color:var(--green);">3</div>
        <div>
          <div class="pipe-title">PCA Macro Factors — <code>processor/pcaMaker.py</code></div>
          <div class="pipe-desc">Builds a pivot matrix across all sectors and runs rolling PCA to extract 5 latent macro factors stored in MySQL.</div>
        </div>
      </div>

      <div class="pipe-arrow">↓</div>

      <div class="pipe-step" style="--c:var(--yellow);">
        <div class="pipe-num" style="background:var(--yellow-dim); border-color:var(--yellow-border); color:var(--yellow);">4</div>
        <div>
          <div class="pipe-title">LLM Input Builder — <code>LLMinput/inputGenerator.py</code></div>
          <div class="pipe-desc">Assembles a structured JSON snapshot of market state including sector rankings, correlations, and macro factor loadings.</div>
        </div>
      </div>

      <div class="pipe-arrow">↓</div>

      <div class="pipe-step" style="--c:var(--red);">
        <div class="pipe-num" style="background:var(--red-dim); border-color:rgba(248,113,113,0.22); color:var(--red);">5</div>
        <div>
          <div class="pipe-title">RAG Pipeline — <code>Rag/ragRunner.py</code></div>
          <div class="pipe-desc">Converts market JSON to a readable document, rebuilds LangChain Chroma + LlamaIndex vector stores with the latest data.</div>
        </div>
      </div>

      <div class="pipe-arrow">↓</div>

      <div class="pipe-step" style="--c:var(--blue);">
        <div class="pipe-num" style="background:var(--blue-dim); border-color:var(--blue-border); color:var(--blue);">6</div>
        <div>
          <div class="pipe-title">Groq LLM Answer — <code>Rag/llmEngine.py</code></div>
          <div class="pipe-desc">Intent detection routes queries. Retrieved context + user question is sent to Groq for a grounded, data-backed response.</div>
        </div>
      </div>

    </div>
  </div>
</section>

<style>
  .pipe-step {
    display:flex; align-items:flex-start; gap:16px; padding:16px 0;
  }
  .pipe-num {
    width:32px; height:32px; border-radius:8px; border:1px solid;
    display:flex; align-items:center; justify-content:center;
    font-size:13px; font-weight:700; flex-shrink:0; margin-top:2px;
  }
  .pipe-title { font-size:.9rem; font-weight:600; color:var(--text); margin-bottom:4px; }
  .pipe-title code { font-size:.8rem; color:var(--muted); font-family:monospace; }
  .pipe-desc  { font-size:.82rem; color:var(--muted); line-height:1.6; }
  .pipe-arrow { text-align:center; color:var(--dim); font-size:1.2rem; padding:0 0 0 16px; }
</style>

<!-- ── TECH STACK ── -->
<section style="margin-bottom:64px;">
  <p class="section-label">Tech Stack</p>
  <h2 class="section-title">Built with</h2>

  <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px;">

    <div class="stack-card">
      <div class="stack-header" style="color:var(--blue);">Frontend</div>
      <ul class="stack-list">
        <li><span class="stack-dot" style="background:var(--blue);"></span>React 19 + Vite 7</li>
        <li><span class="stack-dot" style="background:var(--blue);"></span>Tailwind CSS v4</li>
        <li><span class="stack-dot" style="background:var(--blue);"></span>React Router v7</li>
        <li><span class="stack-dot" style="background:var(--blue);"></span>Lucide React icons</li>
        <li><span class="stack-dot" style="background:var(--blue);"></span>Context API (global state)</li>
      </ul>
    </div>

    <div class="stack-card">
      <div class="stack-header" style="color:var(--green);">Backend</div>
      <ul class="stack-list">
        <li><span class="stack-dot" style="background:var(--green);"></span>Python + Flask + Flask-CORS</li>
        <li><span class="stack-dot" style="background:var(--green);"></span>yfinance (market data)</li>
        <li><span class="stack-dot" style="background:var(--green);"></span>pandas + numpy + scikit-learn</li>
        <li><span class="stack-dot" style="background:var(--green);"></span>MySQL (mysql-connector-python)</li>
        <li><span class="stack-dot" style="background:var(--green);"></span>python-dotenv</li>
      </ul>
    </div>

    <div class="stack-card">
      <div class="stack-header" style="color:var(--purple);">AI / RAG</div>
      <ul class="stack-list">
        <li><span class="stack-dot" style="background:var(--purple);"></span>Groq LLM API</li>
        <li><span class="stack-dot" style="background:var(--purple);"></span>LangChain + LangChain-Chroma</li>
        <li><span class="stack-dot" style="background:var(--purple);"></span>LlamaIndex (PDF + advanced indexing)</li>
        <li><span class="stack-dot" style="background:var(--purple);"></span>ChromaDB (vector store)</li>
        <li><span class="stack-dot" style="background:var(--purple);"></span>sentence-transformers (embeddings)</li>
      </ul>
    </div>

  </div>
</section>

<style>
  .stack-card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:16px; padding:24px;
  }
  .stack-header { font-size:.75rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; margin-bottom:14px; }
  .stack-list { list-style:none; display:flex; flex-direction:column; gap:9px; }
  .stack-list li { display:flex; align-items:center; gap:10px; font-size:.85rem; color:var(--muted); }
  .stack-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
</style>

<!-- ── PROJECT STRUCTURE ── -->
<section style="margin-bottom:64px;">
  <p class="section-label">Project Structure</p>
  <h2 class="section-title">Codebase layout</h2>

  <div style="background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:28px; overflow-x:auto;">
    <pre style="font-family:'JetBrains Mono','Fira Code',monospace; font-size:.8rem; line-height:1.9; color:var(--muted); margin:0;"><span style="color:var(--text);">TrendCaster/</span>
├── <span style="color:var(--blue);">Frontend/</span>                    <span style="color:var(--dim);"># React + Vite SPA</span>
│   └── src/
│       ├── pages/               <span style="color:var(--dim);"># Dashboard, GuardianAI, ChatPage, …</span>
│       ├── components/          <span style="color:var(--dim);"># Sidebar, Topbar, reusable UI</span>
│       └── context/             <span style="color:var(--dim);"># AppContext — global state</span>
│
└── <span style="color:var(--green);">Backend/</span>                     <span style="color:var(--dim);"># Python pipeline + Flask API</span>
    ├── Logic/
    │   ├── engine2/             <span style="color:var(--dim);"># Signal computation engine</span>
    │   ├── processor/           <span style="color:var(--dim);"># Pivot matrix, PCA, cleaner</span>
    │   ├── LLMinput/            <span style="color:var(--dim);"># Market state JSON builder</span>
    │   ├── schema/              <span style="color:var(--dim);"># MySQL connector + SQL schema</span>
    │   ├── fatcher/             <span style="color:var(--dim);"># yfinance data loader</span>
    │   └── piplineRunner.py     <span style="color:var(--dim);"># Master orchestrator</span>
    └── Rag/
        ├── indexing/            <span style="color:var(--dim);"># LangChain + LlamaIndex builders</span>
        ├── loaders/             <span style="color:var(--dim);"># PDF + TXT document loaders</span>
        ├── KnowledgeBasedData/  <span style="color:var(--dim);"># 20 curated financial docs</span>
        ├── LogicalData/         <span style="color:var(--dim);"># Generated market state docs</span>
        ├── llmEngine.py         <span style="color:var(--dim);"># Groq intent + answer generation</span>
        ├── retriever.py         <span style="color:var(--dim);"># Unified context retrieval</span>
        └── ragRunner.py         <span style="color:var(--dim);"># RAG pipeline orchestrator</span></pre>
  </div>
</section>

<!-- ── SETUP ── -->
<section style="margin-bottom:64px;">
  <p class="section-label">Getting Started</p>
  <h2 class="section-title">Setup & Installation</h2>

  <div style="display:flex; flex-direction:column; gap:20px;">

    <!-- Step 1 -->
    <div class="setup-step">
      <div class="setup-num">01</div>
      <div style="flex:1;">
        <div class="setup-title">Clone the repository</div>
        <div class="code-block">git clone https://github.com/your-username/trendcaster.git
cd trendcaster</div>
      </div>
    </div>

    <!-- Step 2 -->
    <div class="setup-step">
      <div class="setup-num">02</div>
      <div style="flex:1;">
        <div class="setup-title">Configure environment variables</div>
        <p style="font-size:.83rem; color:var(--muted); margin-bottom:10px;">Copy the example file and fill in your credentials.</p>
        <div class="code-block">cp Backend/.env.example Backend/.env</div>
        <p style="font-size:.82rem; color:var(--muted); margin-top:10px;">Required keys in <code style="color:var(--blue);">.env</code>:</p>
        <div class="code-block" style="margin-top:8px;">GROQ_API_KEY=your_groq_api_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=trendcaster</div>
      </div>
    </div>

    <!-- Step 3 -->
    <div class="setup-step">
      <div class="setup-num">03</div>
      <div style="flex:1;">
        <div class="setup-title">Install Backend dependencies</div>
        <div class="code-block">cd Backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt</div>
      </div>
    </div>

    <!-- Step 4 -->
    <div class="setup-step">
      <div class="setup-num">04</div>
      <div style="flex:1;">
        <div class="setup-title">Set up the MySQL database</div>
        <p style="font-size:.83rem; color:var(--muted); margin-bottom:10px;">Run the SQL schema to create all required tables.</p>
        <div class="code-block">mysql -u root -p trendcaster &lt; Backend/Logic/schema/TableCreation.sql</div>
      </div>
    </div>

    <!-- Step 5 -->
    <div class="setup-step">
      <div class="setup-num">05</div>
      <div style="flex:1;">
        <div class="setup-title">Run the data pipeline</div>
        <p style="font-size:.83rem; color:var(--muted); margin-bottom:10px;">This fetches market data, computes signals, runs PCA, and rebuilds the RAG index.</p>
        <div class="code-block">cd Backend
python Logic/piplineRunner.py</div>
      </div>
    </div>

    <!-- Step 6 -->
    <div class="setup-step">
      <div class="setup-num">06</div>
      <div style="flex:1;">
        <div class="setup-title">Install & run the Frontend</div>
        <div class="code-block">cd Frontend
npm install
npm run dev</div>
        <p style="font-size:.82rem; color:var(--muted); margin-top:10px;">Open <a href="http://localhost:5173">http://localhost:5173</a> in your browser.</p>
      </div>
    </div>

  </div>
</section>

<style>
  .setup-step {
    display:flex; gap:20px; align-items:flex-start;
    background:var(--surface); border:1px solid var(--border);
    border-radius:16px; padding:24px;
  }
  .setup-num {
    font-size:1.4rem; font-weight:800; color:var(--dim);
    letter-spacing:-.03em; flex-shrink:0; min-width:32px;
  }
  .setup-title { font-size:.95rem; font-weight:600; color:var(--text); margin-bottom:10px; }
  .code-block {
    background:#000; border:1px solid var(--border);
    border-radius:10px; padding:14px 18px;
    font-family:'JetBrains Mono','Fira Code',monospace;
    font-size:.78rem; color:#a5f3fc; line-height:1.8;
    white-space:pre; overflow-x:auto;
  }
</style>

<!-- ── INSTRUMENTS ── -->
<section style="margin-bottom:64px;">
  <p class="section-label">Market Coverage</p>
  <h2 class="section-title">Tracked instruments</h2>

  <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:10px;">
    <div class="inst-chip" style="--c:var(--blue);">Nifty 50 <span>^NSEI</span></div>
    <div class="inst-chip" style="--c:var(--blue);">Sensex <span>^BSESN</span></div>
    <div class="inst-chip" style="--c:var(--blue);">Bank Nifty <span>^NSEBANK</span></div>
    <div class="inst-chip" style="--c:var(--purple);">IT Sector <span>^CNXIT</span></div>
    <div class="inst-chip" style="--c:var(--purple);">Auto Sector <span>^CNXAUTO</span></div>
    <div class="inst-chip" style="--c:var(--purple);">Metal Sector <span>^CNXMETAL</span></div>
    <div class="inst-chip" style="--c:var(--purple);">Realty Sector <span>^CNXREALTY</span></div>
    <div class="inst-chip" style="--c:var(--purple);">FMCG Sector <span>^CNXFMCG</span></div>
    <div class="inst-chip" style="--c:var(--purple);">Pharma Sector <span>^CNXPHARMA</span></div>
    <div class="inst-chip" style="--c:var(--purple);">Energy Sector <span>^CNXENERGY</span></div>
    <div class="inst-chip" style="--c:var(--yellow);">Gold <span>GC=F</span></div>
    <div class="inst-chip" style="--c:var(--red);">Crude Oil <span>CL=F</span></div>
    <div class="inst-chip" style="--c:var(--green);">USD-INR <span>INR=X</span></div>
    <div class="inst-chip" style="--c:var(--red);">India VIX <span>^INDIAVIX</span></div>
  </div>
</section>

<style>
  .inst-chip {
    background:var(--surface); border:1px solid var(--border);
    border-radius:10px; padding:12px 14px;
    font-size:.82rem; font-weight:500; color:var(--c);
    display:flex; flex-direction:column; gap:3px;
  }
  .inst-chip span { font-size:.72rem; color:var(--muted); font-family:monospace; }
</style>

<!-- ── KNOWLEDGE BASE ── -->
<section style="margin-bottom:64px;">
  <p class="section-label">Knowledge Base</p>
  <h2 class="section-title">RAG document library</h2>
  <p style="color:var(--muted); font-size:.88rem; margin-bottom:20px; max-width:600px;">
    20 curated financial documents are embedded into the vector store alongside live market state documents generated after each pipeline run.
  </p>
  <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:8px;">
    <div class="kb-item">📘 Basic Economic Questions & Answers</div>
    <div class="kb-item">📈 Investment Strategies for Normal Users</div>
    <div class="kb-item">🌐 Global Sector Correlations (Detailed)</div>
    <div class="kb-item">💡 Suggestions for Users Not in Stock Market</div>
    <div class="kb-item">🚨 Investment Steps During Global Crisis</div>
    <div class="kb-item">🥇 Investing When Gold & Markets Are Expensive</div>
    <div class="kb-item">🏠 Daily Life Economic Questions Answered</div>
    <div class="kb-item">📊 Understanding Stock Market Basics</div>
    <div class="kb-item">💸 Understanding Inflation for Households</div>
    <div class="kb-item">📋 Personal Budget Planning Economically</div>
    <div class="kb-item">🛢️ Oil Crisis Effects on Normal Life</div>
    <div class="kb-item">🏛️ Government Schemes for Normal Citizens</div>
    <div class="kb-item">💱 Currency Wars & Exchange Rates</div>
    <div class="kb-item">🧓 Retirement Planning for Normal Indians</div>
    <div class="kb-item">🏪 Small Business Economic Survival Guide</div>
    <div class="kb-item">🧾 Tax Saving for Normal Indians</div>
    <div class="kb-item">🔮 Global Economic Trends 2025–2030</div>
    <div class="kb-item">🏦 Understanding the Banking System</div>
    <div class="kb-item">⚠️ Debt Traps & How to Escape</div>
    <div class="kb-item">📖 Economic Glossary — 100 Terms</div>
  </div>
</section>

<style>
  .kb-item {
    background:var(--surface); border:1px solid var(--border);
    border-radius:10px; padding:11px 14px;
    font-size:.82rem; color:var(--muted);
  }
</style>

<!-- ── FOOTER ── -->
</main>

<footer style="
  border-top:1px solid var(--border);
  padding:40px 24px;
  text-align:center;
  background: radial-gradient(ellipse 60% 80% at 50% 100%, rgba(96,165,250,0.04) 0%, transparent 70%);
">
  <div style="max-width:960px; margin:0 auto;">
    <p style="font-size:1.3rem; font-weight:700; color:var(--text); letter-spacing:-.02em; margin-bottom:8px;">TrendCaster</p>
    <p style="font-size:.83rem; color:var(--dim); margin-bottom:24px;">
      Built for Indian retail investors who deserve data-backed intelligence, not noise.
    </p>
    <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:28px;">
      <span class="badge" style="--c:var(--muted);--cd:rgba(255,255,255,0.03);--cb:var(--border);">Not financial advice</span>
      <span class="badge" style="--c:var(--muted);--cd:rgba(255,255,255,0.03);--cb:var(--border);">For educational purposes</span>
      <span class="badge" style="--c:var(--muted);--cd:rgba(255,255,255,0.03);--cb:var(--border);">MIT License</span>
    </div>
    <p style="font-size:.75rem; color:var(--dim);">
      Market data via <a href="https://pypi.org/project/yfinance/">yfinance</a> ·
      LLM via <a href="https://groq.com">Groq</a> ·
      Vectors via <a href="https://www.trychroma.com">ChromaDB</a>
    </p>
  </div>
</footer>

</body>
</html>
