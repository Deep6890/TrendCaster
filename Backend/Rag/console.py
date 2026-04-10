"""
Rag/console.py
TrendCaster — Terminal QA Console

Run:  python Rag/console.py
      python Rag/console.py --no-llm      (retrieval only, free)
      python Rag/console.py --rebuild     (force-rebuild indexes first)
"""

import os
import sys
import json
import argparse
from datetime import datetime
from pathlib import Path

# ── Path setup ────────────────────────────────────────────────────────────────
_RAG_DIR  = os.path.dirname(os.path.abspath(__file__))
_ROOT_DIR = os.path.dirname(_RAG_DIR)
sys.path.insert(0, _RAG_DIR)

from dotenv import load_dotenv
load_dotenv(os.path.join(_ROOT_DIR, ".env"))

# ── ANSI colour palette (basic, no deps) ─────────────────────────────────────
R = "\033[0m"          # reset
BOLD   = "\033[1m"
DIM    = "\033[2m"

# Colours
CYAN   = "\033[36m"
YELLOW = "\033[33m"
GREEN  = "\033[32m"
RED    = "\033[31m"
BLUE   = "\033[34m"
GREY   = "\033[90m"
WHITE  = "\033[97m"
ORANGE = "\033[38;5;208m"

def c(text, colour, bold=False):
    b = BOLD if bold else ""
    return f"{b}{colour}{text}{R}"


# ── Score → coloured label ─────────────────────────────────────────────────────
def score_label(score):
    if score is None:
        return c("  N/A  ", GREY)
    if score >= 1.0:
        return c(f"{score:+.3f} ▲▲", GREEN,  bold=True)
    if score >= 0.5:
        return c(f"{score:+.3f} ▲ ", GREEN)
    if score > -0.5:
        return c(f"{score:+.3f} → ", YELLOW)
    if score > -1.0:
        return c(f"{score:+.3f} ▼ ", RED)
    return c(f"{score:+.3f} ▼▼", RED, bold=True)


def signal_bar(val, width=8):
    """Tiny visual bar for a z-score: fills proportionally from centre."""
    if val is None:
        return " " * width
    clamped = max(-3.0, min(3.0, val))
    half    = width // 2
    blocks  = round(abs(clamped) / 3.0 * half)
    if clamped >= 0:
        bar = " " * half + "█" * blocks + " " * (half - blocks)
        col = GREEN
    else:
        bar = " " * (half - blocks) + "█" * blocks + " " * half
        col = RED
    return c(bar, col)


# ── Load market JSON ──────────────────────────────────────────────────────────
_JSON_PATH = Path(_ROOT_DIR) / "llm_market_state.json"

def load_state() -> dict:
    if _JSON_PATH.exists():
        with open(_JSON_PATH, "r") as f:
            return json.load(f)
    return {}


# ── Header banner ─────────────────────────────────────────────────────────────
def print_header(date_str=""):
    print()
    print(c("╔══════════════════════════════════════════════════════╗", CYAN))
    print(c("║", CYAN) + c("   TRENDCASTER  ·  Market Intelligence Console    ", WHITE, bold=True) + c("║", CYAN))
    print(c("║", CYAN) + c(f"   Indian Market QA  ·  {date_str:<30}", GREY) + c("║", CYAN))
    print(c("╚══════════════════════════════════════════════════════╝", CYAN))
    print()


# ── Market snapshot table ──────────────────────────────────────────────────────
def print_snapshot(state: dict):
    if not state:
        print(c("  [No market data found — run piplineRunner.py first]", YELLOW))
        return

    ranking = state.get("sector_ranking", [])
    assets  = state.get("asset_states", {})

    print(c("  LIVE SECTOR RANKINGS", CYAN, bold=True) +
          c(f"  (as of {state.get('date','?')})", GREY))
    print()

    # Column header
    hdr = (
        f"  {'#':<3} {'Asset':<18} "
        f"{'Score':>9}   "
        f"{'Trend':^8} "
        f"{'Momentum':^8} "
        f"{'Cycle':^8}"
    )
    print(c(hdr, GREY))
    print(c("  " + "─" * 62, GREY))

    for entry in ranking:
        rank  = entry["rank"]
        asset = entry["asset"]
        score = entry.get("score")
        v     = assets.get(asset, {})

        trend_bar = signal_bar(v.get("trend_strength"))
        mom_bar   = signal_bar(v.get("momentum_acceleration"))
        cycle_bar = signal_bar(v.get("cycle_position"))

        rank_col = c(f"  {rank:<3}", GREY)
        asset_col = c(f"{asset:<18}", WHITE if score and score >= 0 else GREY)
        score_col = score_label(score)

        print(f"{rank_col} {asset_col} {score_col}  {trend_bar}{mom_bar}{cycle_bar}")

    # Market structure footer
    ms = state.get("market_structure", {})
    if ms:
        avg = ms.get("average_cross_asset_correlation_60d", 0)
        dis = ms.get("correlation_dispersion_60d", 0)
        regime = (
            c("HIGH CORRELATION  (herd / crisis mode)", RED)   if avg > 0.6 else
            c("MODERATE CORRELATION  (mixed signals)",  YELLOW) if avg > 0.3 else
            c("LOW CORRELATION  (diversified / normal)", GREEN)
        )
        print()
        print(c(f"  Market Structure:  ", GREY) +
              c(f"avg_corr {avg:+.3f}  disp {dis:.3f}  ", WHITE) +
              regime)

        macro = state.get("macro_regime", {}).get("current_factors", {})
        pc1 = macro.get("PC1", 0)
        pc1_label = c("RISK-ON  ▲", GREEN) if pc1 > 0 else c("RISK-OFF ▼", RED)
        print(c(f"  Macro Regime:      ", GREY) +
              c(f"PC1={pc1:+.2f}  ", WHITE) + pc1_label)
    print()


# ── Help text ─────────────────────────────────────────────────────────────────
def print_help():
    cmds = [
        ("  snap / s",        "Refresh and show the live market snapshot"),
        ("  ctx: <question>", "Show raw retrieved context (no LLM, free)"),
        ("  rebuild",         "Force-rebuild all RAG indexes"),
        ("  clear",           "Clear the screen"),
        ("  help / ?",        "Show this help"),
        ("  exit / q",        "Quit"),
    ]
    print(c("  Commands:", CYAN, bold=True))
    for cmd, desc in cmds:
        print(c(cmd, YELLOW) + c(f"  —  {desc}", GREY))
    print()


# ── Input prompt styling ──────────────────────────────────────────────────────
def prompt_input():
    try:
        return input(c("  ❯ ", CYAN, bold=True)).strip()
    except (EOFError, KeyboardInterrupt):
        return "exit"


# ── Answer display ─────────────────────────────────────────────────────────────
def print_answer(text: str):
    print()
    print(c("  ┌─ TrendCaster ─────────────────────────────────────────", CYAN))
    for line in text.split("\n"):
        print(c("  │ ", CYAN) + line)
    print(c("  └────────────────────────────────────────────────────────", CYAN))
    print()


def print_context(text: str):
    print()
    print(c("  ┌─ Retrieved Context ────────────────────────────────────", GREY))
    for line in text.split("\n"):
        print(c("  │ ", GREY) + c(line, GREY))
    print(c("  └────────────────────────────────────────────────────────", GREY))
    print()


def print_error(msg: str):
    print(c(f"  [Error] {msg}", RED))


def print_status(msg: str):
    print(c(f"  {msg}", YELLOW))


# ── Core QA logic ─────────────────────────────────────────────────────────────
def handle_question(question: str, no_llm: bool = False):
    """Route question → retrieve → (optionally) answer."""
    from llmEngine import detect_intent

    intent = detect_intent(question)

    # Static responses
    if intent == "greeting":
        print_answer(
            "Hey! I'm TrendCaster — your Indian market analyst.\n"
            "Ask me about any sector, gold, crude oil, Nifty, or\n"
            "type 'snap' to see the live market snapshot."
        )
        return

    if intent == "identity":
        print_answer(
            "I'm TrendCaster — I analyse live Indian market data\n"
            "using quantitative signals (trend strength, momentum,\n"
            "cycle position, volatility regime) and answer your\n"
            "market questions with real numbers."
        )
        return

    if intent == "unknown":
        print_answer(
            "I'm specialised in Indian financial markets.\n"
            "Try asking about Nifty, gold, a sector, or\n"
            "whether now is a good time to invest."
        )
        return

    # Finance intent → retrieve
    print_status("Retrieving context...")
    try:
        from retriever import retrieve_context
        context = retrieve_context(question, n_results=5)
    except Exception as e:
        print_error(f"Retrieval failed: {e}")
        return

    if no_llm:
        print_context(context)
        return

    # LLM answer
    print_status("Generating answer...")
    try:
        from llmEngine import generate_answer
        answer = generate_answer(context, question)
        print_answer(answer)
    except Exception as e:
        print_error(f"LLM error: {e}")
        print_context(context)   # Fall back to showing context


# ── Main loop ──────────────────────────────────────────────────────────────────
def run_console(no_llm: bool = False, rebuild: bool = False):
    os.system("cls" if os.name == "nt" else "clear")

    state    = load_state()
    date_str = state.get("date", datetime.now().strftime("%Y-%m-%d"))
    print_header(date_str)

    if rebuild:
        print_status("Rebuilding RAG indexes...")
        try:
            from retriever import rebuild_all_indexes
            rebuild_all_indexes(force=True)
            print_status("Indexes rebuilt ✓\n")
        except Exception as e:
            print_error(f"Rebuild failed: {e}\n")

    if no_llm:
        print(c("  [Context-only mode — no LLM calls will be made]\n", YELLOW))

    print_snapshot(state)
    print_help()

    while True:
        raw = prompt_input()

        if not raw:
            continue

        low = raw.lower()

        if low in ("exit", "q", "quit"):
            print(c("\n  Goodbye!\n", CYAN))
            break

        elif low in ("snap", "s", "snapshot"):
            state = load_state()
            print_snapshot(state)

        elif low in ("help", "?"):
            print_help()

        elif low == "clear":
            os.system("cls" if os.name == "nt" else "clear")
            print_header(date_str)
            print_snapshot(state)

        elif low == "rebuild":
            print_status("Rebuilding RAG indexes...")
            try:
                from retriever import rebuild_all_indexes
                rebuild_all_indexes(force=False)
                print_status("Indexes rebuilt ✓\n")
            except Exception as e:
                print_error(f"Rebuild failed: {e}\n")

        elif low.startswith("ctx:"):
            question = raw[4:].strip()
            if question:
                print_status("Retrieving context (no LLM)...")
                try:
                    from retriever import retrieve_context
                    ctx = retrieve_context(question, n_results=5)
                    print_context(ctx)
                except Exception as e:
                    print_error(str(e))

        else:
            handle_question(raw, no_llm=no_llm)


# ── Entrypoint ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="TrendCaster QA Console")
    parser.add_argument("--no-llm",  action="store_true", help="Retrieval-only mode (no Groq API)")
    parser.add_argument("--rebuild", action="store_true", help="Force-rebuild RAG indexes on start")
    args = parser.parse_args()

    run_console(no_llm=args.no_llm, rebuild=args.rebuild)
