"""
Rag/indexing/llama_index.py

LlamaIndex-based index for PDF documents placed in Rag/data/.
Uses a persistent VectorStoreIndex backed by SimpleVectorStore.

NO LLM output — only builds index and returns a retriever/query engine.
Set llm=None to ensure zero LLM calls during indexing.
"""

import os

BASE_DIR         = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LLAMA_STORE_DIR  = os.path.join(BASE_DIR, "llama_index_store")


def _get_service_context():
    """
    Build a ServiceContext / Settings with:
        - embed_model: local HuggingFace all-MiniLM-L6-v2
        - llm: None (no LLM during indexing — retrieval only)
    LlamaIndex ≥ 0.10 uses the global Settings object.
    """
    try:
        # LlamaIndex ≥ 0.10 style
        from llama_index.core import Settings
        from llama_index.embeddings.huggingface import HuggingFaceEmbedding

        Settings.embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
        Settings.llm = None          # ← NO LLM output
        return None                  # Settings is global in new llama-index
    except ImportError:
        return None


def build_llama_index(force_rebuild: bool = False):
    """
    Build or load a LlamaIndex VectorStoreIndex from PDFs in Rag/data/.
    Persists state to llama_index_store/.

    Returns:
        VectorStoreIndex or None if no PDFs found.
    """
    try:
        from llama_index.core import (
            VectorStoreIndex,
            StorageContext,
            load_index_from_storage,
        )
    except ImportError:
        print("[LlamaIndex] llama-index not installed. Skipping PDF index.")
        return None

    _get_service_context()

    from loaders.pdf_loader import load_pdf_documents, get_pdf_summary

    pdf_info = get_pdf_summary()
    if pdf_info["count"] == 0:
        print(f"[LlamaIndex] No PDFs in {pdf_info['folder']}. Index skipped.")
        return None

    # If persisted index exists and no force-rebuild, load it
    if not force_rebuild and os.path.isdir(LLAMA_STORE_DIR):
        try:
            storage_ctx = StorageContext.from_defaults(persist_dir=LLAMA_STORE_DIR)
            index = load_index_from_storage(storage_ctx)
            print(f"[LlamaIndex] Loaded existing index from {LLAMA_STORE_DIR}")
            return index
        except Exception as e:
            print(f"[LlamaIndex] Could not load existing index ({e}). Rebuilding...")

    # Build fresh index from PDF docs
    docs = load_pdf_documents()
    if not docs:
        return None

    index = VectorStoreIndex.from_documents(docs, show_progress=True)
    os.makedirs(LLAMA_STORE_DIR, exist_ok=True)
    index.storage_context.persist(persist_dir=LLAMA_STORE_DIR)
    print(f"[LlamaIndex] Index built and saved to {LLAMA_STORE_DIR}")
    return index


def get_llama_retriever(similarity_top_k: int = 4):
    """
    Load or build the LlamaIndex and return a retriever.
    Returns None if no PDFs are present.
    """
    index = build_llama_index()
    if index is None:
        return None
    return index.as_retriever(similarity_top_k=similarity_top_k)


def query_llama_index(question: str, top_k: int = 4) -> list[str]:
    """
    Retrieve relevant chunks from PDF index for a given question.
    Returns list of text strings (no LLM synthesis).
    """
    retriever = get_llama_retriever(similarity_top_k=top_k)
    if retriever is None:
        return []

    nodes = retriever.retrieve(question)
    return [node.get_content() for node in nodes]
