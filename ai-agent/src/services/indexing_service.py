from pathlib import Path

from src.documents.chunker import split_documents
from src.documents.loader import load_pdf
from src.config.settings import SUMMARY_MAX_INPUT_CHARS, SUMMARY_MAX_OUTPUT_TOKENS
from src.llm.groq_client import create_groq_model
from src.vectorstore.chroma_store import index_documents


def index_pdf(path: str | Path, chat_id: str) -> int:
    documents = split_documents(load_pdf(path))
    return index_documents(documents, chat_id)


def summarize_pdf(path: str | Path) -> str:
    documents = load_pdf(path)
    content = "\n\n".join(document.page_content for document in documents)
    if not content.strip():
        return "The document does not contain extractable text."

    if len(content) > SUMMARY_MAX_INPUT_CHARS:
        start_length = SUMMARY_MAX_INPUT_CHARS * 3 // 4
        end_length = SUMMARY_MAX_INPUT_CHARS - start_length
        content = (
            content[:start_length]
            + "\n\n[Middle of document omitted to stay within the model token limit.]\n\n"
            + content[-end_length:]
        )

    response = create_groq_model().invoke(
        [
            (
                "system",
                "Summarize the supplied document excerpts accurately. Cover its "
                "purpose, main topics, key facts, and conclusions. The middle may "
                "be omitted, so do not claim details that are not in the excerpts.",
            ),
            ("human", content),
        ],
        max_tokens=SUMMARY_MAX_OUTPUT_TOKENS,
    )
    return response.content if isinstance(response.content, str) else str(response.content)
