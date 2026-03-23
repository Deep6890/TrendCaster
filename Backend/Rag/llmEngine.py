import os
try:
    from dotenv import load_dotenv
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    load_dotenv(env_path)
except ImportError:
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key, val = line.strip().split('=', 1)
                    os.environ[key] = val

from groq import Groq


def get_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not set in environment variables")
    return Groq(api_key=api_key)


# ── Intent Detection ─────────────────────────────────────────────
GREETINGS      = ["hi", "hello", "hey", "hii", "good morning", "good evening", "sup", "yo", "namaste"]
IDENTITY_WORDS = ["who are you", "what are you", "what can you do", "help", "your name", "aegis"]

ENGINE1_TRIGGERS = [
    "how is my portfolio", "assess me", "financial health", "guardian report",
    "how am i doing", "portfolio review", "my holdings", "portfolio check",
    "full analysis", "give me a report", "complete review"
]

ENGINE2_TRIGGERS = [
    "should i buy", "should i sell", "is it good time", "good time for",
    "what about", "recommend", "entry", "buy or avoid", "invest in",
    "should i invest", "is now good", "worth buying"
]

ENGINE3_TRIGGERS = [
    "what's happening", "whats happening", "why is", "why did", "market news",
    "sentiment", "falling", "crashing", "what happened", "reason for",
    "news today", "market today"
]

FINANCE_WORDS = [
    "stock", "gold", "oil", "crude", "market", "invest", "sector", "nifty",
    "sensex", "trade", "bank", "pharma", "fmcg", "metal", "realty", "energy",
    "auto", "vix", "usd", "inr", "buy", "sell", "portfolio", "risk", "trend",
    "inflation", "economy", "recession", "gdp", "rbi", "fed", "price", "index",
    "return", "profit", "loss", "fund", "equity", "debt", "bond", "commodity",
    "nse", "bse", "sebi", "mutual", "sip", "etf", "ipo", "dividend", "reliance",
    "tcs", "hdfc", "infosys", "icici", "bajaj", "wipro", "titan", "itc"
]


def detect_intent(question: str) -> str:
    q = question.lower().strip()

    if any(g in q for g in GREETINGS) and len(q.split()) <= 5:
        return "greeting"
    if any(w in q for w in IDENTITY_WORDS):
        return "identity"

    # Multi-engine detection
    has_e1 = any(t in q for t in ENGINE1_TRIGGERS)
    has_e2 = any(t in q for t in ENGINE2_TRIGGERS)
    has_e3 = any(t in q for t in ENGINE3_TRIGGERS)

    if has_e1 and has_e3: return "multi_e3_e1"
    if has_e2 and has_e3: return "multi_e3_e2"
    if has_e1: return "engine1"
    if has_e2: return "engine2"
    if has_e3: return "engine3"
    if any(w in q for w in FINANCE_WORDS): return "finance"

    return "unknown"


# ── AEGIS System Prompt ──────────────────────────────────────────
AEGIS_SYSTEM_PROMPT = """You are AEGIS Guardian — a personal financial intelligence engine built for Indian retail investors.

You operate across three intelligent modes based on the user's query:

## ENGINE 1 — PORTFOLIO HEALTH ANALYSIS
Trigger: "how is my portfolio", "assess me", "guardian report", "how am I doing"

Deliver a Guardian Report with:
**VERDICT** [CRITICAL / CAUTION / STABLE / STRONG] — one sharp sentence.
**Guardian Score: XX/100** — based on guardian_matrix data.
**Top Risks** (max 3) — format: [HIGH/MED/LOW] Risk → Consequence
**Opportunities** (max 2) — where they are underweight for their goals.
**One Action This Week** — specific, actionable, references their data.

## ENGINE 2 — ASSET / SECTOR QUERY
Trigger: "should I buy X", "is it good time for gold/IT", "should I sell Y"

**Verdict** [AVOID / WAIT / ACCUMULATE / STRONG BUY] — no hedging.
**3 Reasons** — technical signal, macro context, portfolio fit.
**Is This Right FOR THIS USER?** — match to age, risk tolerance, horizon.
**Entry Conditions** — specific trigger to watch.
**Downside Scenario** — two sentences max.

## ENGINE 3 — NEWS & TREND INTELLIGENCE  
Trigger: "what's happening with X", "why is Y falling", "market news"

**What's Happening** — plain language, no jargon.
**What It Means For Their Portfolio** — connect to their actual holdings.
**Sentiment** [BULLISH / BEARISH / MIXED / UNCERTAIN] — Confidence level.
**Noise or Signal?** — is this actionable or short-term noise?
**Suggested Response** — Hold / Trim / Accumulate / Watch with timeframe.

## BEHAVIOR RULES
- Every insight MUST reference the user's actual data — their tickers, sector weights, scores.
- Speak like a knowledgeable friend. Direct. Clear. No excessive disclaimers.
- Always use Indian financial context: BSE/NSE, ₹, RBI repo rate, STCG 15%, LTCG 10% above ₹1L.
- Calibrate to the user's risk profile and age.
- Never guess prices not in the context. Say what you don't have.
- Keep responses under 400 words unless user asks for full analysis.
- Format with bold verdicts, short paragraphs. Use bullets only for lists of 3+."""


def build_aegis_prompt(context: str, user_context: dict, question: str) -> str:
    """Build the full AEGIS prompt with user financial context injected."""

    profile     = user_context.get("profile",        {})
    portfolio   = user_context.get("portfolio",       {})
    guardian    = user_context.get("guardian_matrix", {})
    goals       = user_context.get("goals",           [])
    watchlist   = user_context.get("watchlist_tickers", [])
    news        = user_context.get("news_context",    "No recent news data available.")

    # Format top holdings
    holdings_text = ""
    for h in portfolio.get("top_holdings", []):
        holdings_text += f"\n  - {h['ticker']}: weight {h['weight_pct']}%, P&L {h['pnl_pct']}%, signal_score {h['signal_score']}/100"

    # Format goals
    goals_text = ""
    for g in goals:
        status = "✅ on track" if g.get("on_track") else "⚠️ behind"
        goals_text += f"\n  - {g['name']}: ₹{g.get('target_amount', 0):,} — {status}"

    user_context_xml = f"""
<user_context>
  <profile>
    age: {profile.get('age', 'unknown')}
    risk_tolerance: {profile.get('risk_tolerance', 'moderate')}
    investment_horizon: {profile.get('investment_horizon', 'medium')}
    primary_goal: {profile.get('primary_goal', 'wealth creation')}
    monthly_income: ₹{profile.get('monthly_income', 0):,}
    total_capital: ₹{profile.get('total_capital', 0):,}
    tax_bracket: {profile.get('tax_bracket', '30%')}
  </profile>

  <portfolio>
    total_invested: ₹{portfolio.get('total_invested', 0):,}
    total_value: ₹{portfolio.get('total_value', 0):,}
    pnl_pct: {portfolio.get('pnl_pct', 0)}%
    sector_allocation: {portfolio.get('sector_allocation', {})}
    top_holdings:{holdings_text}
  </portfolio>

  <guardian_matrix>
    guardian_score: {guardian.get('guardian_score', 'N/A')}/100
    verdict: {guardian.get('verdict', 'N/A')}
    concentration_risk: {guardian.get('concentration_risk', 'N/A')}/100
    volatility_score: {guardian.get('volatility_score', 'N/A')}/100
    momentum_score: {guardian.get('momentum_score', 'N/A')}/100
    drawdown_score: {guardian.get('drawdown_score', 'N/A')}/100
    liquidity_score: {guardian.get('liquidity_score', 'N/A')}/100
    macro_alignment: {guardian.get('macro_alignment', 'N/A')}/100
    goal_alignment: {guardian.get('goal_alignment', 'N/A')}/100
    diversification_score: {guardian.get('diversification_score', 'N/A')}/100
    sentiment_score: {guardian.get('sentiment_score', 'N/A')}/100
    technical_score: {guardian.get('technical_score', 'N/A')}/100
    top_risks: {guardian.get('top_risks', [])}
    top_opportunities: {guardian.get('top_opportunities', [])}
  </guardian_matrix>

  <goals>{goals_text}
  </goals>

  <watchlist_tickers>{', '.join(watchlist)}</watchlist_tickers>

  <market_rag_context>
{context}
  </market_rag_context>

  <news_context>{news}</news_context>
</user_context>"""

    return f"""{AEGIS_SYSTEM_PROMPT}

{user_context_xml}

User Question: {question}

Respond as AEGIS Guardian. Detect the appropriate engine(s). Reference the user's actual data."""


def build_prompt(context: str, question: str) -> str:
    """Legacy fallback prompt (no user context)."""
    return f"""You are TrendCaster, a friendly Indian market assistant who explains things in very simple everyday language.

Here is the latest real market data and knowledge:
{context}

User Question:
{question}

Instructions:
- Talk like a knowledgeable friend, not a financial expert
- Use simple words. Replace jargon with plain English
- Give a real reason WHY using the data above
- Always mention actual rank or score when relevant
- Keep it short, friendly and clear
- Reference Indian markets: BSE/NSE, ₹ currency, RBI, SEBI

Answer in this format:

What's happening:
<explain using the actual market data>

Why it's happening:
<simple real-world reason>

What you can do:
<one simple practical suggestion>"""


# ── LLM Call ─────────────────────────────────────────────────────
def generate_answer(context: str, user_question: str, user_context: dict = None) -> str:
    if user_context and any(user_context.values()):
        prompt = build_aegis_prompt(context, user_context, user_question)
    else:
        prompt = build_prompt(context, user_question)

    client = get_client()
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=700,
    )
    return response.choices[0].message.content
