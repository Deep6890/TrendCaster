"""
Rag/llmEngine.py
Lean, numerical-first LLM engine for TrendCaster.

Key idea: Every prompt injects the real market numbers (scores, ranks, signals)
in a structured table format so the LLM reasons from actual data, not guesses.
"""

import os
import json
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))


# ── Groq client ──────────────────────────────────────────────────────────────

def get_client():
    from groq import Groq
    key = os.getenv("GROQ_API_KEY")
    if not key:
        raise ValueError("GROQ_API_KEY not set in .env")
    return Groq(api_key=key)


# ── Load latest market numbers from JSON ─────────────────────────────────────

_JSON_PATH = Path(__file__).parent.parent / "llm_market_state.json"

def load_market_state() -> dict:
    """Load the latest llm_market_state.json; return empty dict if missing."""
    if _JSON_PATH.exists():
        with open(_JSON_PATH, "r") as f:
            return json.load(f)
    return {}


def build_numeric_market_block(state: dict) -> str:
    """
    Convert market JSON → compact numbered table string.
    This is what gets injected directly into every prompt.

    Scores are Z-normalised composites:
        > +1.0  = very strong
        +0.5 to +1.0 = above average
        -0.5 to +0.5 = neutral
        < -1.0  = weak / stressed
    """
    if not state:
        return "[No live market data available]"

    lines = [f"MARKET DATA — {state.get('date', 'N/A')}", ""]

    # Ranking table
    lines.append("SECTOR RANKINGS (composite score, higher = stronger):")
    lines.append(f"  {'#':<4} {'Asset':<20} {'Score':>7}  Signal")
    lines.append("  " + "-" * 48)

    score_to_signal = lambda s: (
        "▲▲ STRONG"   if s >= 1.0  else
        "▲  ABOVE AVG" if s >= 0.5  else
        "→  NEUTRAL"  if s > -0.5  else
        "▼  BELOW AVG" if s > -1.0  else
        "▼▼ WEAK"
    )

    for entry in state.get("sector_ranking", []):
        r   = entry["rank"]
        a   = entry["asset"]
        sc  = entry["score"]
        sig = score_to_signal(sc)
        lines.append(f"  {r:<4} {a:<20} {sc:>+7.3f}  {sig}")

    # Individual signal breakdown for each asset
    lines.append("")
    lines.append("SIGNAL BREAKDOWN (z-scores, 252d rolling):")
    lines.append(f"  {'Asset':<20} {'Trend':>7} {'Consist':>8} {'Momentum':>9} {'Cycle':>7} {'VolReg':>7}")
    lines.append("  " + "-" * 64)

    asset_states = state.get("asset_states", {})
    ranking = state.get("sector_ranking", [])
    ordered_assets = [r["asset"] for r in ranking]

    for asset in ordered_assets:
        v = asset_states.get(asset, {})
        tr  = v.get("trend_strength",        0) or 0
        co  = v.get("trend_consistency",      0) or 0
        mo  = v.get("momentum_acceleration",  0) or 0
        cy  = v.get("cycle_position",         0) or 0
        vr  = v.get("volatility_regime",      0) or 0
        lines.append(
            f"  {asset:<20} {tr:>+7.2f} {co:>+8.2f} {mo:>+9.2f} {cy:>+7.2f} {vr:>+7.2f}"
        )

    # Market structure
    ms = state.get("market_structure", {})
    if ms:
        lines.append("")
        avg_c = ms.get("average_cross_asset_correlation_60d", 0)
        dis_c = ms.get("correlation_dispersion_60d", 0)
        regime = (
            "HIGH CORRELATION (herd mode / crisis)" if avg_c > 0.6 else
            "MODERATE CORRELATION (mixed signals)"  if avg_c > 0.3 else
            "LOW CORRELATION (diversified / normal)"
        )
        lines.append(f"MARKET STRUCTURE (60d): avg_corr={avg_c:+.3f}  dispersion={dis_c:.3f}  → {regime}")

    # PCA macro factors
    macro = state.get("macro_regime", {}).get("current_factors", {})
    if macro:
        factor_str = "  ".join(f"{k}={v:+.2f}" for k, v in macro.items())
        lines.append(f"MACRO FACTORS (PCA):    {factor_str}")
        pc1 = macro.get("PC1", 0)
        macro_label = "RISK-ON" if pc1 > 0 else "RISK-OFF"
        lines.append(f"  → PC1={pc1:+.2f} ({macro_label} regime)")

    return "\n".join(lines)


# ── Intent detection (simple keyword routing) ────────────────────────────────

GREETINGS = {"hi", "hello", "hey", "hii", "sup", "yo", "namaste", "good morning", "good evening"}
IDENTITY  = {"who are you", "what are you", "what can you do", "your name", "help"}

def detect_intent(question: str) -> str:
    q = question.lower().strip()
    words = set(q.split())

    if words & GREETINGS and len(words) <= 4:
        return "greeting"
    if any(phrase in q for phrase in IDENTITY):
        return "identity"

    finance_words = {
        "stock", "gold", "oil", "crude", "market", "invest", "sector", "nifty",
        "sensex", "bank", "pharma", "fmcg", "metal", "realty", "energy", "auto",
        "vix", "usd", "inr", "buy", "sell", "trend", "inflation", "economy",
        "rbi", "fed", "return", "profit", "loss", "equity", "commodity",
        "nse", "bse", "sebi", "mutual", "sip", "etf", "ipo", "dividend",
        "portfolio", "risk", "momentum", "score", "rank", "signal", "volatile",
    }
    if words & finance_words:
        return "finance"

    return "unknown"


# ── Prompt builder ────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are TrendCaster, a concise Indian market analyst assistant.

You have access to live quantitative market data with numerical scores.
Always reference actual numbers from the data when answering.

Score interpretation guide (already injected in every prompt):
  > +1.0   = very strong momentum, clear uptrend
  +0.5 → +1.0  = above average, worth watching
  -0.5 → +0.5  = neutral, no clear edge
  < -1.0   = weak/stressed, downtrend or underperforming

Rules:
- Be direct and specific. Quote actual scores and ranks.
- Keep answers under 150 words unless user asks for more.
- Use Indian market context (BSE/NSE, ₹, RBI).
- If data is missing for something, say so honestly.
- No excessive disclaimers. Talk like a smart friend."""


def build_prompt(market_block: str, context: str, question: str) -> str:
    return f"""{market_block}

---
KNOWLEDGE CONTEXT:
{context}
---

Question: {question}

Answer (reference actual numbers from the data above):"""


# ── LLM call ─────────────────────────────────────────────────────────────────

def generate_answer(context: str, user_question: str, user_context: dict = None) -> str:
    state        = load_market_state()
    market_block = build_numeric_market_block(state)
    prompt       = build_prompt(market_block, context, user_question)

    client   = get_client()
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": prompt},
        ],
        temperature=0.25,
        max_tokens=400,
    )
    return response.choices[0].message.content.strip()
