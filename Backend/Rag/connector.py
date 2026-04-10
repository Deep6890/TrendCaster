"""
Rag/connector.py  — LEGACY SHIM
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Old piplineRunner.py imported `from Rag.ragRunner import run_rag_pipeline`
which in turn imported `from connector import build_vector_store, query`.

This shim delegates to the new indexing layer so old import chains don't break.
New code should use retriever.py directly.
"""

import os
import sys

_RAG_DIR = os.path.dirname(os.path.abspath(__file__))
if _RAG_DIR not in sys.path:
    sys.path.insert(0, _RAG_DIR)


def build_vector_store():
    """
    Legacy build function → delegates to LangChain index builder.
    """
    from indexing.langchain_index import build_langchain_index
    return build_langchain_index(force_rebuild=False)


def query(user_question: str, n_results: int = 5):
    """
    Legacy query function → delegates to unified retriever.
    Returns (list[str], list[dict]) to match old API.
    """
    from retriever import retrieve_context

    context_str = retrieve_context(user_question, n_results=n_results)

    # Parse back into lists for old callers
    blocks = context_str.split("\n\n")
    docs   = []
    metas  = []
    for block in blocks:
        lines = block.split("\n", 1)
        if len(lines) == 2:
            source_line, text = lines
            source = source_line.replace("[Source", "").replace("]", "").strip()
            # Remove the "N: " prefix
            source = ":".join(source.split(":")[1:]).strip() if ":" in source else source
            docs.append(text.strip())
            metas.append({"source": source})
        else:
            docs.append(block.strip())
            metas.append({"source": "unknown"})

    return docs, metas
