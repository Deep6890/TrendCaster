from langchain_text_splitters import RecursiveCharacterTextSplitter
from load import all_docs

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

def get_chunks():
    chunks = []
    for doc in all_docs:
        parts = splitter.split_text(doc["text"])
        for part in parts:
            chunks.append({"text": part, "source": doc["source"]})
    return chunks
