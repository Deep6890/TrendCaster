"""
Rag/qa_test.py

TrendCaster RAG — Test Harness
Supports three modes:
    python qa_test.py test          → runs canned questions
    python qa_test.py interactive   → REPL loop
    python qa_test.py context       → show raw context (no LLM)
"""

import os
import sys
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, "..", ".env"))
sys.path.insert(0, BASE_DIR)

from ragRunner import ask_rag, rebuild_index, retrieve_context


TEST_QUESTIONS = [
    # Market state queries
    "What is the current market trend for Nifty?",
    "Which sector is performing best right now?",
    "What is the overall macro regime?",
    # Asset specific
    "Should I invest in gold right now?",
    "Is crude oil a good investment?",
    "How is the IT sector doing?",
    # Risk
    "What is the risk in the market right now?",
    "Is the market in a bullish or bearish regime?",
    # General knowledge
    "What is SIP and how does it work?",
    "How does inflation affect my investments?",
]


def run_tests():
    print("=" * 70)
    print("TrendCaster RAG — Q&A Test Suite")
    print("=" * 70)
    passed = 0

    for question in TEST_QUESTIONS:
        print(f"\nQ: {question}")
        print("-" * 50)
        try:
            answer = ask_rag(question)
            print(answer)
            passed += 1
        except Exception as e:
            print(f"[ERROR] {e}")
        print("=" * 70)

    print(f"\n✅ {passed}/{len(TEST_QUESTIONS)} queries completed successfully")


def show_context(question: str):
    """Show what context the retriever finds — useful for debugging."""
    print(f"\n[Context for: '{question}']\n" + "=" * 60)
    ctx = retrieve_context(question, n_results=5)
    print(ctx)
    print("=" * 60)


def interactive():
    print("\nTrendCaster RAG — Interactive Mode")
    print("Commands: 'exit' to quit | 'ctx: <question>' to show raw context\n")

    while True:
        raw = input("Your Question: ").strip()
        if not raw:
            continue
        if raw.lower() == "exit":
            break
        if raw.lower().startswith("ctx:"):
            show_context(raw[4:].strip())
        else:
            try:
                answer = ask_rag(raw)
                print(f"\n{answer}\n")
            except Exception as e:
                print(f"[ERROR] {e}\n")


if __name__ == "__main__":
    mode = sys.argv[1].lower() if len(sys.argv) > 1 else ""

    if mode == "rebuild":
        rebuild_index(force=True)
    elif mode == "test":
        run_tests()
    elif mode == "context" and len(sys.argv) > 2:
        show_context(" ".join(sys.argv[2:]))
    else:
        interactive()
