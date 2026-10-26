from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from src.domain.schemas import ChatInput
from src.llm.groq_client import create_groq_model
from src.prompts.system_prompt import SYSTEM_PROMPT


def create_messages(
    question: str,
    history: list,
    context: str = "",
    system_prompt: str | None = None,
) -> list:
    prompt = system_prompt or SYSTEM_PROMPT
    if context:
        prompt = f"{prompt}\n\n<document_context>\n{context}\n</document_context>"

    messages = [SystemMessage(content=prompt)]
    for item in history:
        message_class = HumanMessage if item.role == "user" else AIMessage
        messages.append(message_class(content=item.content))
    messages.append(HumanMessage(content=question.strip()))
    return messages


def response_text(content: str | list) -> str:
    if isinstance(content, str):
        return content

    return "".join(
        block["text"]
        for block in content
        if isinstance(block, dict) and block.get("type") == "text"
    )


def generate_response(chat_input: ChatInput) -> str:
    try:
        from src.graph.builder import build_chat_graph

        result = build_chat_graph().invoke(
            {
                "question": chat_input.message,
                "history": chat_input.history,
                "use_retrieval": chat_input.use_retrieval,
                "chat_id": chat_input.chat_id,
            }
        )
    except Exception as error:
        raise RuntimeError(str(error)) from error

    return result["answer"]
