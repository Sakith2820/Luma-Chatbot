from typing import Literal

from pydantic import BaseModel, Field


class HistoryMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatInput(BaseModel):
    message: str = Field(min_length=1)
    history: list[HistoryMessage] = Field(default_factory=list)
    use_retrieval: bool = False
    chat_id: str = Field(min_length=1)


class ChatOutput(BaseModel):
    response: str


class GraphState(BaseModel):
    question: str
    history: list[HistoryMessage] = Field(default_factory=list)
    use_retrieval: bool = False
    chat_id: str
    context: str = ""
    answer: str = ""
