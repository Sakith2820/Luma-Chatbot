from langchain_groq import ChatGroq

from src.config.settings import GROQ_API_KEY, GROQ_MODEL, GROQ_TEMPERATURE


def create_groq_model() -> ChatGroq:
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not set")

    return ChatGroq(
        api_key=GROQ_API_KEY,
        model=GROQ_MODEL,
        temperature=GROQ_TEMPERATURE,
    )
