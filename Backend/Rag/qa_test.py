import os
import sys
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, "..", ".env"))
sys.path.append(BASE_DIR)

from ragRunner import ask_rag, rebuild_index

TEST_QUESTIONS = [
    "What is the current market trend for Nifty?",
    "Should I invest in gold right now?",
    "Which sector is performing best?",
    "What is the overall macro regime?",
    "Is crude oil a good investment?",
    "What is the risk in the market right now?",
]


def run_tests():
    print("=" * 60)
    print("TrendCaster RAG - Q&A Test")
    print("=" * 60)

    for question in TEST_QUESTIONS:
        print(f"\nQ: {question}")
        print("-" * 40)
        try:
            answer = ask_rag(question)
            print(answer)
        except Exception as e:
            print(f"[ERROR] {e}")
        print("=" * 60)


def interactive():
    print("\nTrendCaster RAG - Interactive Mode")
    print("Type 'exit' to quit\n")

    while True:
        question = input("Your Question: ").strip()
        if question.lower() == "exit":
            break
        if not question:
            continue
        try:
            answer = ask_rag(question)
            print(f"\n{answer}\n")
        except Exception as e:
            print(f"[ERROR] {e}\n")


if __name__ == "__main__":
    mode = input("Mode? (test / interactive): ").strip().lower()

    if mode == "test":
        run_tests()
    else:
        interactive()
