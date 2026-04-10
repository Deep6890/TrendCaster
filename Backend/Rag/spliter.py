"""
Rag/spliter.py  — LEGACY SHIM
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Wraps the new LangChain splitter so old `from spliter import get_chunks`
imports keep working.
New code should call indexing/langchain_index.py directly.
"""
import os
import sys

_RAG_DIR = os.path.dirname(os.path.abspath(__file__))
if _RAG_DIR not in sys.path:
    sys.path.insert(0, _RAG_DIR)

from langchain_text_splitters import RecursiveCharacterTextSplitter
from load import all_docs     # ← uses the shim above

_splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,
    chunk_overlap=120,
    separators=["\n\n", "\n", " ", ""],
)


def get_chunks() -> list[dict]:
    """Return list of {text, source} dicts — matches old connector.py API."""
    chunks = []
    for doc in all_docs:
        parts = _splitter.split_text(doc["text"])
        for part in parts:
            chunks.append({"text": part, "source": doc["source"]})
    return chunks
