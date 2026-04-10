"""
Rag/loaders/txt_loader.py

LangChain-based loader for .txt files.
Loads from KnowledgeBasedData/ and LogicalData/ using LangChain's
TextLoader + Document schema so downstream code gets proper Document objects.
"""

import os
from langchain_community.document_loaders import TextLoader
from langchain_core.documents import Document

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_txt_folder(folder_name: str) -> list[Document]:
    """
    Load all .txt files from a named sub-folder and return a list of
    LangChain Document objects with source metadata.

    Args:
        folder_name: sub-folder relative to Rag/ (e.g. 'KnowledgeBasedData')
    Returns:
        list of langchain Document
    """
    folder_path = os.path.join(BASE_DIR, folder_name)
    if not os.path.isdir(folder_path):
        print(f"[TXT Loader] Folder not found: {folder_path}")
        return []

    documents: list[Document] = []

    for filename in sorted(os.listdir(folder_path)):
        if not filename.endswith(".txt"):
            continue
        full_path = os.path.join(folder_path, filename)
        try:
            loader = TextLoader(full_path, encoding="utf-8")
            docs   = loader.load()
            # Tag each doc with its source
            for doc in docs:
                doc.metadata["source"]   = filename
                doc.metadata["category"] = folder_name
            documents.extend(docs)
        except Exception as e:
            print(f"[TXT Loader] Failed to load {filename}: {e}")

    print(f"[TXT Loader] Loaded {len(documents)} docs from '{folder_name}'")
    return documents


def load_all_txt_docs() -> list[Document]:
    """
    Load KnowledgeBasedData + LogicalData and return combined list.
    LogicalData (market state) is always placed first for priority retrieval.
    """
    market_docs  = load_txt_folder("LogicalData")
    knowledge_docs = load_txt_folder("KnowledgeBasedData")
    all_docs = market_docs + knowledge_docs
    print(f"[TXT Loader] Total txt docs: {len(all_docs)}")
    return all_docs
