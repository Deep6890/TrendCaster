"""
Rag/retriever.py

Unified retriever that merges results from:
    1. LangChain Chroma index  (KnowledgeBasedData + LogicalData .txt files)
    2. LlamaIndex              (PDF files in Rag/data/)

Priority rules:
    - LogicalData (market state docs) always rank highest
    - PDF content ranks second
    - General knowledge fills remaining slots

NO LLM output here. This module only retrieves context strings.
"""

import os
import sys

# Ensure Rag/ is on the path so sub-imports work from anywhere
_RAG_DIR = os.path.dirname(os.path.abspath(__file__))
if _RAG_DIR not in sys.path:
    sys.path.insert(0, _RAG_DIR)


def retrieve_context(user_question: str, n_results: int = 6) -> str:
    """
    Main context retrieval function.
    Returns a single formatted context string ready to be injected into a prompt.

    Args:
        user_question: the raw user question
        n_results: total number of chunks to return
    Returns:
        str — formatted context block
    """
    market_chunks   = []
    pdf_chunks      = []
    general_chunks  = []

    # ── 1. LangChain Chroma retrieval ────────────────────────────────────────
    try:
        from indexing.langchain_index import get_langchain_retriever
        retriever = get_langchain_retriever(k=n_results + 2)
        results   = retriever.invoke(user_question)

        for doc in results:
            source   = doc.metadata.get("source", "")
            category = doc.metadata.get("category", "")
            text     = doc.page_content.strip()

            if category == "LogicalData" or source.startswith("market_state"):
                market_chunks.append((text, source))
            else:
                general_chunks.append((text, source))

    except Exception as e:
        print(f"[Retriever] LangChain retrieval error: {e}")

    # ── 2. LlamaIndex PDF retrieval ───────────────────────────────────────────
    try:
        from indexing.llama_index import query_llama_index
        pdf_texts = query_llama_index(user_question, top_k=3)
        pdf_chunks = [(t, "pdf_document") for t in pdf_texts]
    except Exception as e:
        print(f"[Retriever] LlamaIndex retrieval error: {e}")

    # ── 3. Merge with priority ordering ──────────────────────────────────────
    combined = market_chunks + pdf_chunks + general_chunks
    combined = combined[:n_results]

    # ── 4. Format context string ──────────────────────────────────────────────
    if not combined:
        return "No relevant context found."

    lines = []
    for i, (text, source) in enumerate(combined, start=1):
        lines.append(f"[Source {i}: {source}]\n{text}")

    return "\n\n".join(lines)


def rebuild_all_indexes(force: bool = False):
    """
    Rebuild both indexes (LangChain + LlamaIndex).
    Call this after adding new .txt or .pdf files.

    Args:
        force: if True, wipe and rebuild from scratch
    """
    print("\n[Retriever] Rebuilding LangChain index...")
    try:
        from indexing.langchain_index import build_langchain_index
        build_langchain_index(force_rebuild=force)
        print("[Retriever] LangChain index ready.")
    except Exception as e:
        print(f"[Retriever] LangChain index error: {e}")

    print("\n[Retriever] Rebuilding LlamaIndex (PDF) index...")
    try:
        from indexing.llama_index import build_llama_index
        build_llama_index(force_rebuild=force)
        print("[Retriever] LlamaIndex ready.")
    except Exception as e:
        print(f"[Retriever] LlamaIndex error: {e}")

    print("\n[Retriever] All indexes rebuilt.")
