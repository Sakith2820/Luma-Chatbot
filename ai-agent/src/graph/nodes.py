from src.domain.schemas import GraphState
from src.config.settings import MAX_CONTEXT_CHARS
from src.llm.groq_client import create_groq_model
from src.prompts.rag_prompt import RAG_SYSTEM_PROMPT
from src.services.chat_service import create_messages, response_text
from src.vectorstore.chroma_store import retrieve_documents


def prepare_question(state: GraphState) -> GraphState:
    state.question = state.question.strip()
    return state


def retrieve_context(state: GraphState) -> GraphState:
    documents = retrieve_documents(state.question, state.chat_id)
    context_parts = []
    for index, document in enumerate(documents, start=1):
        page = document.metadata.get("page")
        page_label = f", page {page + 1}" if isinstance(page, int) else ""
        context_parts.append(
            f"[Source {index}{page_label}]\n{document.page_content.strip()}"
        )
    state.context = "\n\n".join(context_parts)
    if len(state.context) > MAX_CONTEXT_CHARS:
        state.context = state.context[:MAX_CONTEXT_CHARS].rstrip() + (
            "\n\n[Additional retrieved context omitted to stay within the model limit.]"
        )
    return state


def generate_answer(state: GraphState) -> GraphState:
    messages = create_messages(
        state.question,
        state.history,
        context=state.context,
        system_prompt=RAG_SYSTEM_PROMPT if state.use_retrieval else None,
    )
    response = create_groq_model().invoke(messages)
    state.answer = response_text(response.content)
    return state
