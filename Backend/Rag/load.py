"""
Rag/load.py  — LEGACY SHIM
~~~~~~~~~~~~~~~~~~~~~~~~~~
Old code imported `from load import all_docs`.
This shim provides `all_docs` via the new LangChain loader so older scripts
don't break, while new code should use loaders/txt_loader.py directly.
"""
import os
import sys

_RAG_DIR = os.path.dirname(os.path.abspath(__file__))
if _RAG_DIR not in sys.path:
    sys.path.insert(0, _RAG_DIR)

from loaders.txt_loader import load_all_txt_docs

# Build the list once at import time (matches old behaviour)
_langchain_docs = load_all_txt_docs()

# Convert LangChain Documents → old dict format {text, source}
all_docs = [
    {"text": d.page_content, "source": d.metadata.get("source", "unknown")}
    for d in _langchain_docs
]
