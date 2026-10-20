from fastapi import APIRouter, HTTPException

from src.domain.schemas import ChatInput, ChatOutput
from src.services.chat_service import generate_response

router = APIRouter()


@router.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@router.post("/generate", response_model=ChatOutput)
def generate(chat_input: ChatInput) -> ChatOutput:
    try:
        return ChatOutput(response=generate_response(chat_input))
    except RuntimeError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
