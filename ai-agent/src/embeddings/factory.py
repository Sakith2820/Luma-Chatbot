from langchain_core.embeddings import Embeddings

from src.config.settings import EMBEDDING_MODEL, EMBEDDING_PROVIDER


def create_embeddings() -> Embeddings:
    if EMBEDDING_PROVIDER == "openai":
        from langchain_openai import OpenAIEmbeddings

        return OpenAIEmbeddings(model=EMBEDDING_MODEL or "text-embedding-3-small")

    if EMBEDDING_PROVIDER == "gemini":
        from langchain_google_genai import GoogleGenerativeAIEmbeddings

        return GoogleGenerativeAIEmbeddings(
            model=EMBEDDING_MODEL or "models/gemini-embedding-001",
        )

    if EMBEDDING_PROVIDER == "huggingface":
        from langchain_huggingface import HuggingFaceEmbeddings

        return HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL or "sentence-transformers/all-MiniLM-L6-v2",
        )

    raise RuntimeError(
        "EMBEDDING_PROVIDER is not configured. "
        "Set it to 'openai', 'gemini', or 'huggingface' before indexing documents."
    )
