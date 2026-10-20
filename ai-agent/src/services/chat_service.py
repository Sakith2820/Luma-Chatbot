from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from src.domain.schemas import ChatInput
from src.llm.groq_client import create_groq_model
from src.prompts.system_prompt import SYSTEM_PROMPT


def create_messages(chat_input: ChatInput) -> list:
    messages = [SystemMessage(content=SYSTEM_PROMPT)]
    for item in chat_input.history:
        message_class = HumanMessage if item.role == "user" else AIMessage
        messages.append(message_class(content=item.content))
    messages.append(HumanMessage(content=chat_input.message.strip()))
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
        response = create_groq_model().invoke(create_messages(chat_input))
    except Exception as error:
        raise RuntimeError(str(error)) from error

    return response_text(response.content)
