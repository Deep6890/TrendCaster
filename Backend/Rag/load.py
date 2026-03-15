import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_documents(folder_path):
    documents = []
    full_path = os.path.join(BASE_DIR, folder_path)

    for file in os.listdir(full_path):
        if file.endswith(".txt"):
            with open(os.path.join(full_path, file), "r", encoding="utf-8") as f:
                text = f.read()
            documents.append({"text": text, "source": file})

    return documents

explain_docs = load_documents("KnowledgeBasedData")
market_docs  = load_documents("LogicalData")
all_docs     = explain_docs + market_docs
