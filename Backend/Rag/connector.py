import os
import hashlib
import json
import chromadb
from sentence_transformers import SentenceTransformer

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
CHROMA_PATH = os.path.join(BASE_DIR, "chroma_db")
HASH_FILE   = os.path.join(BASE_DIR, "chroma_db", "chunk_hashes.json")

model = SentenceTransformer("all-MiniLM-L6-v2")


def get_client():
    return chromadb.PersistentClient(path=CHROMA_PATH)


def get_collection():
    client = get_client()
    return client.get_or_create_collection("market_rag")

# Hash helpers - track what's already indexed
def load_hashes() -> dict:
    if os.path.exists(HASH_FILE):
        with open(HASH_FILE, "r") as f:
            return json.load(f)
    return {}

def save_hashes(hashes: dict):
    os.makedirs(os.path.dirname(HASH_FILE), exist_ok=True)
    with open(HASH_FILE, "w") as f:
        json.dump(hashes, f)

def chunk_hash(text: str) -> str:
    return hashlib.md5(text.encode()).hexdigest()

# Build / update vector store (only adds new chunks)
def build_vector_store():
    from spliter import get_chunks

    chunks     = get_chunks()
    collection = get_collection()
    old_hashes = load_hashes()
    new_hashes = {}

    to_add_chunks = []
    to_add_ids    = []

    for i, chunk in enumerate(chunks):
        h = chunk_hash(chunk["text"])
        chunk_id = f"{chunk['source']}_{i}"
        new_hashes[chunk_id] = h

        if old_hashes.get(chunk_id) != h:
            to_add_chunks.append(chunk)
            to_add_ids.append(chunk_id)

    if to_add_chunks:
        texts      = [c["text"] for c in to_add_chunks]
        embeddings = model.encode(texts)

        collection.upsert(
            ids        = to_add_ids,
            documents  = texts,
            embeddings = [e.tolist() for e in embeddings],
            metadatas  = [{"source": c["source"]} for c in to_add_chunks]
        )
        print(f"[RAG] Added/updated {len(to_add_chunks)} chunks")
    else:
        print("[RAG] Vector store up to date, no changes")

    save_hashes(new_hashes)
    print(f"[RAG] Total chunks in store: {collection.count()}")
    return collection

# Query - LogicalData gets highest priority
def query(user_question: str, n_results: int = 5):
    collection      = get_collection()
    query_embedding = model.encode([user_question])[0].tolist()

    # First fetch more results than needed
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=20
    )

    docs   = results["documents"][0]
    metas  = results["metadatas"][0]

    # Separate LogicalData (market state) from KnowledgeBasedData
    market_docs  = [(d, m) for d, m in zip(docs, metas) if m["source"].startswith("market_state")]
    general_docs = [(d, m) for d, m in zip(docs, metas) if not m["source"].startswith("market_state")]

    # Always put market data first, fill rest with general knowledge
    combined = market_docs + general_docs
    combined = combined[:n_results]

    final_docs  = [d for d, m in combined]
    final_metas = [m for d, m in combined]

    return final_docs, final_metas
