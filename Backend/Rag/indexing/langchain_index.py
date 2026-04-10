"""
Rag/indexing/langchain_index.py

LangChain-based Chroma vector store for .txt documents
(KnowledgeBasedData + LogicalData).

Uses:
    - langchain_community TextLoader  (via loaders/txt_loader.py)
    - langchain_text_splitters        RecursiveCharacterTextSplitter
    - sentence-transformers           all-MiniLM-L6-v2  (local, no API key)
    - langchain_chroma                Chroma vector store

NO LLM output here — retrieval only.
"""

import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

BASE_DIR    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROMA_PATH = os.path.join(BASE_DIR, "chroma_db")

COLLECTION_NAME  = "trendcaster_txt"
EMBEDDING_MODEL  = "all-MiniLM-L6-v2"

# Chunk settings — balanced for financial text
CHUNK_SIZE    = 600
CHUNK_OVERLAP = 120


def _get_embeddings():
    return SentenceTransformerEmbeddings(model_name=EMBEDDING_MODEL)


def build_langchain_index(force_rebuild: bool = False) -> Chroma:
    """
    Build or update the LangChain Chroma index with all .txt docs.

    Args:
        force_rebuild: if True, wipe existing store and rebuild from scratch.
    Returns:
        Chroma vector store instance.
    """
    from loaders.txt_loader import load_all_txt_docs

    embeddings = _get_embeddings()

    if force_rebuild and os.path.isdir(CHROMA_PATH):
        # On Windows, SQLite files may be locked; skip rmtree — Chroma upsert
        # handles deduplication via content hashing automatically.
        print("[LangChain Index] force_rebuild=True → will upsert/overwrite existing store.")

    # Load and split raw docs
    docs = load_all_txt_docs()
    if not docs:
        print("[LangChain Index] No documents to index.")
        return Chroma(
            collection_name=COLLECTION_NAME,
            embedding_function=embeddings,
            persist_directory=CHROMA_PATH,
        )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", " ", ""],
    )
    chunks = splitter.split_documents(docs)
    print(f"[LangChain Index] Split into {len(chunks)} chunks")

    # Build / upsert Chroma store
    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=COLLECTION_NAME,
        persist_directory=CHROMA_PATH,
    )

    print(f"[LangChain Index] Index built — {vector_store._collection.count()} vectors stored")
    return vector_store


def get_langchain_retriever(k: int = 5):
    """
    Load existing Chroma store and return a retriever.
    Call build_langchain_index() first if the store doesn't exist yet.

    Args:
        k: number of chunks to retrieve per query
    Returns:
        LangChain retriever object
    """
    embeddings   = _get_embeddings()
    vector_store = Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=CHROMA_PATH,
    )
    return vector_store.as_retriever(
        search_type="mmr",              # Maximal Marginal Relevance — avoids duplicate chunks
        search_kwargs={"k": k, "fetch_k": k * 4},
    )
