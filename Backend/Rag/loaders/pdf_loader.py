"""
Rag/loaders/pdf_loader.py

LlamaIndex-based PDF loader for the Rag/data/ folder.
Drop any PDF files into Rag/data/ and they will be automatically
ingested the next time the index is rebuilt.

This module purposely does NOT call an LLM — it only reads and chunks PDFs.
"""

import os
from pathlib import Path

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DATA_DIR = os.path.join(BASE_DIR, "data")


def load_pdf_documents():
    """
    Use LlamaIndex SimpleDirectoryReader to load all PDFs from Rag/data/.
    Returns a list of LlamaIndex Document objects.
    If no PDFs found, returns empty list.
    """
    try:
        from llama_index.core import SimpleDirectoryReader
    except ImportError:
        print("[PDF Loader] llama-index not installed. Skipping PDF loading.")
        return []

    os.makedirs(PDF_DATA_DIR, exist_ok=True)

    # Check if any PDFs exist
    pdf_files = list(Path(PDF_DATA_DIR).glob("*.pdf"))
    if not pdf_files:
        print(f"[PDF Loader] No PDFs found in {PDF_DATA_DIR}. Drop PDFs there to include them.")
        return []

    try:
        reader = SimpleDirectoryReader(
            input_dir=PDF_DATA_DIR,
            required_exts=[".pdf"],
            recursive=False,
        )
        docs = reader.load_data()

        # Annotate metadata
        for doc in docs:
            doc.metadata["category"] = "pdf_document"

        print(f"[PDF Loader] Loaded {len(docs)} pages from {len(pdf_files)} PDF(s)")
        return docs

    except Exception as e:
        print(f"[PDF Loader] Error loading PDFs: {e}")
        return []


def get_pdf_summary() -> dict:
    """Return info about what PDFs are in the data/ folder."""
    os.makedirs(PDF_DATA_DIR, exist_ok=True)
    pdf_files = list(Path(PDF_DATA_DIR).glob("*.pdf"))
    return {
        "folder": PDF_DATA_DIR,
        "count": len(pdf_files),
        "files": [f.name for f in pdf_files],
    }
