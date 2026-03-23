import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOGIC_DIR = os.path.join(BASE_DIR, "..", "Logic")
sys.path.append(BASE_DIR)
sys.path.append(LOGIC_DIR)

from logicalToDoc import convert_and_save
from connector import build_vector_store, query
from llmEngine import generate_answer, detect_intent

# Convert latest market JSON → RAG .txt document
def update_market_doc(llm_input_dict):
    output_dir = os.path.join(BASE_DIR, "LogicalData")
    convert_and_save(llm_input_dict, output_dir)
    print("[RAG] Market document updated")

# Rebuild vector store from all documents
def rebuild_index():
    print("[RAG] Rebuilding vector index...")
    build_vector_store()
    print("[RAG] Index ready")


# Query - retrieve context for user question
def retrieve_context(user_question, n_results=5):
    docs, metas = query(user_question, n_results=n_results)

    context = ""
    for i, (doc, meta) in enumerate(zip(docs, metas)):
        context += f"[Source: {meta['source']}]\n{doc}\n\n"
    return context.strip()

# Ask - full RAG + LLM answer with intent routing
def ask_rag(user_question: str) -> str:
    intent = detect_intent(user_question)

    if intent == "greeting":
        return "Hey! I'm TrendCaster. Ask me anything about the market - like which sector is doing well, should you buy gold, or what's happening with Nifty right now!"

    if intent == "identity":
        return "I'm TrendCaster, your market buddy! I look at real market data and tell you what's going on in simple words. Ask me about any sector, gold, oil, or whether now is a good time to invest."

    if intent == "unknown":
        return "I'm only good at market stuff! Try asking me about gold, Nifty, crude oil, or any sector you're curious about."

    # finance intent - run full RAG
    context = retrieve_context(user_question)
    answer  = generate_answer(context, user_question)
    return answer

# Full pipeline: update doc + rebuild index
def run_rag_pipeline(llm_input_dict):
    print("\n[RAG] Starting RAG Pipeline...\n")
    update_market_doc(llm_input_dict)
    rebuild_index()
    print("\n[RAG] Pipeline Complete\n")

# Standalone test
if __name__ == "__main__":
    rebuild_index()

    question = "Should I invest in crude oil right now?"
    print(f"\nQuery: {question}\n")
    answer = ask_rag(question)
    print("Answer:")
    print(answer)
