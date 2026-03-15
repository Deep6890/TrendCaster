import os
from groq import Groq


def get_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not set in environment variables")
    return Groq(api_key=api_key)


# -------------------------------------------------------
# Intent Detection
# -------------------------------------------------------
GREETINGS = ["hi", "hello", "hey", "hii", "good morning", "good evening", "sup", "yo"]

FINANCE_WORDS = [
    "stock", "gold", "oil", "crude", "market", "invest", "sector", "nifty",
    "sensex", "trade", "bank", "pharma", "fmcg", "metal", "realty", "energy",
    "auto", "vix", "usd", "inr", "buy", "sell", "portfolio", "risk", "trend",
    "inflation", "economy", "recession", "gdp", "rbi", "fed", "price", "index",
    "return", "profit", "loss", "fund", "equity", "debt", "bond", "commodity"
]

IDENTITY_WORDS = ["who are you", "what are you", "what can you do", "help", "your name"]


def detect_intent(question: str) -> str:
    q = question.lower().strip()

    if any(g in q for g in GREETINGS) and len(q.split()) <= 5:
        return "greeting"

    if any(w in q for w in IDENTITY_WORDS):
        return "identity"

    if any(w in q for w in FINANCE_WORDS):
        return "finance"

    return "unknown"


# -------------------------------------------------------
# Prompt Builder - simple human language
# -------------------------------------------------------
def build_prompt(context: str, question: str) -> str:
    return f"""You are TrendCaster, a friendly market assistant who explains things in very simple everyday language.

Here is the latest real market data and knowledge:
{context}

User Question:
{question}

Instructions:
- The market data above is REAL and TODAY's data. Always refer to it directly when answering.
- If the market data mentions Crude Oil rank 1 with score 1.16, say "Crude Oil is the strongest right now"
- Talk like a friend explaining to another friend, not like a financial expert
- Use simple words. Replace jargon:
  * "volatility" → "prices jumping up and down"
  * "bullish" → "going up, people are buying"
  * "bearish" → "going down, people are selling"
  * "trend strength" → "how strongly it's moving"
  * "momentum" → "speed of the move"
  * "cycle position" → "where it is in its up-down cycle"
- Give a real reason WHY in plain words (e.g. "Gold is going up because when markets fall, people move money to gold as it's safer")
- Always mention the actual rank or score from the data when relevant
- Keep it short, friendly and clear
- If context doesn't have the answer say "I don't have enough info on that right now"

Answer in this format:

What's happening:
<explain using the actual market data above>

Why it's happening:
<simple real-world reason>

What you can do:
<one simple practical suggestion>
"""


# -------------------------------------------------------
# LLM Call
# -------------------------------------------------------
def generate_answer(context: str, question: str) -> str:
    prompt = build_prompt(context, question)
    client = get_client()

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=500
    )

    return response.choices[0].message.content
