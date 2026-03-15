from sentence_transformers import SentenceTransformer
from spliter import get_chunks

def get_embeddings():
    model = SentenceTransformer("all-MiniLM-L6-v2")
    chunks = get_chunks()
    texts = [c["text"] for c in chunks]
    embeddings = model.encode(texts)
    return chunks, embeddings
