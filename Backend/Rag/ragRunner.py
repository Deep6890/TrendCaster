"""
Rag/ragRunner.py

TrendCaster RAG Pipeline Orchestrator.

Responsibilities:
    1. update_market_doc  — convert latest market JSON → LogicalData .txt
    2. rebuild_index      — rebuild both LangChain + LlamaIndex stores
    3. retrieve_context   — unified context retrieval (no LLM)
    4. ask_rag            — intent routing + LLM answer (optional)
    5. run_rag_pipeline   — called by piplineRunner after each data run
"""

import os
import sys

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
LOGIC_DIR = os.path.join(BASE_DIR, "..", "Logic")

for _p in [BASE_DIR, LOGIC_DIR]:
    if _p not in sys.path:
        sys.path.insert(0, _p)


# ── Step 1: Update market document ───────────────────────────────────────────

def update_market_doc(llm_input_dict: dict) -> str:
    """Convert latest market JSON → readable .txt in LogicalData/."""
    from logicalToDoc import convert_and_save
    output_dir = os.path.join(BASE_DIR, "LogicalData")
    path = convert_and_save(llm_input_dict, output_dir)
    print("[RAG] Market document updated")
    return path


# ── Step 2: Rebuild indexes ──────────────────────────────────────────────────

def rebuild_index(force: bool = False):
    """Rebuild both LangChain Chroma + LlamaIndex stores."""
    from retriever import rebuild_all_indexes
    rebuild_all_indexes(force=force)
    print("[RAG] Index rebuild complete")


# ── Step 3: Retrieve context (NO LLM) ────────────────────────────────────────

def retrieve_context(user_question: str, n_results: int = 6) -> str:
    """
    Retrieve relevant context chunks for a question.
    Returns a formatted context string — does NOT call any LLM.
    """
    from retriever import retrieve_context as _retrieve
    return _retrieve(user_question, n_results=n_results)


# ── Step 4: Full RAG answer (LLM) ────────────────────────────────────────────

def ask_rag(user_question: str, user_context: dict = None) -> str:
    """Full RAG pipeline: intent → retrieve → LLM answer."""
    from llmEngine import detect_intent, generate_answer

    intent = detect_intent(user_question)

    if intent == "greeting":
        return (
            "Hey! I'm TrendCaster — your market intelligence buddy. "
            "Ask me about Nifty, gold, any sector, or whether now's a good time to invest!"
        )
    if intent == "identity":
        return (
            "I'm TrendCaster! I analyse real quantitative market data and explain it clearly. "
            "Ask me about sectors, gold, crude oil, macro trends, or market rankings."
        )
    if intent == "unknown":
        return (
            "I'm specialised in Indian financial markets. Try asking me about Nifty, "
            "gold, a specific sector, or your investment options."
        )

    context = retrieve_context(user_question)
    answer  = generate_answer(context, user_question)
    return answer


# ── Step 5: Full pipeline (called by piplineRunner.py) ───────────────────────

def run_rag_pipeline(llm_input_dict: dict):
    """
    Called after each data pipeline run:
        1. Save new market doc
        2. Rebuild indexes incrementally (not force)
    """
    print("\n[RAG] Starting RAG Pipeline...")
    update_market_doc(llm_input_dict)
    rebuild_index(force=False)
    print("[RAG] Pipeline Complete\n")


# ── Standalone entrypoint ─────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="TrendCaster RAG Runner")
    parser.add_argument("--rebuild", action="store_true", help="Force rebuild all indexes")
    parser.add_argument("--query", type=str, help="Run a single query")
    args = parser.parse_args()

    if args.rebuild:
        rebuild_index(force=True)

    if args.query:
        print(f"\nQuery: {args.query}\n")
        print(ask_rag(args.query))
    elif not args.rebuild:
        # Default: interactive mode
        print("\nTrendCaster RAG — Interactive Mode (type 'exit' to quit)\n")
        while True:
            q = input("Your Question: ").strip()
            if q.lower() == "exit":
                break
            if q:
                print(f"\n{ask_rag(q)}\n")
