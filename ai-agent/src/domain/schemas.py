from typing import Literal

from pydantic import BaseModel, Field


class HistoryMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatInput(BaseModel):
    message: str = Field(min_length=1)
    history: list[HistoryMessage] = Field(default_factory=list)


class ChatOutput(BaseModel):
    response: str
