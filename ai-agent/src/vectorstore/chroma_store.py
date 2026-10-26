import hashlib

import chromadb
from langchain_chroma import Chroma
from langchain_core.documents import Document

from src.config.settings import (
    CHROMA_PERSIST_DIRECTORY,
    EMBEDDING_MODEL,
    EMBEDDING_PROVIDER,
    RETRIEVAL_K,
    RETRIEVAL_SCORE_THRESHOLD,
)
from src.embeddings.factory import create_embeddings


def _collection_name(chat_id: str) -> str:
    provider = EMBEDDING_PROVIDER or "unset"
    model = EMBEDDING_MODEL or "default"
    digest = hashlib.sha1(f"{provider}:{model}".encode()).hexdigest()[:12]
    chat_digest = hashlib.sha1(chat_id.encode()).hexdigest()[:12]
    return f"luma_documents_{digest}_{chat_digest}"


def create_vector_store(chat_id: str) -> Chroma:
    return Chroma(
        collection_name=_collection_name(chat_id),
        embedding_function=create_embeddings(),
        persist_directory=CHROMA_PERSIST_DIRECTORY,
    )


def index_documents(documents: list[Document], chat_id: str) -> int:
    if not documents:
        return 0

    create_vector_store(chat_id).add_documents(documents)
    return len(documents)


def retrieve_documents(question: str, chat_id: str) -> list[Document]:
    results = create_vector_store(chat_id).similarity_search_with_relevance_scores(
        question,
        k=RETRIEVAL_K,
    )
    return [
        document
        for document, score in results
        if score >= RETRIEVAL_SCORE_THRESHOLD
    ]


def indexed_document_count(chat_id: str) -> int:
    client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIRECTORY)
    try:
        return client.get_collection(_collection_name(chat_id)).count()
    except Exception:
        return 0
