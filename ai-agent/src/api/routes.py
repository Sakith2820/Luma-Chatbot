from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, Header, HTTPException, UploadFile

from src.domain.schemas import ChatInput, ChatOutput
from src.services.chat_service import generate_response
from src.services.indexing_service import index_pdf, summarize_pdf
from src.vectorstore.chroma_store import indexed_document_count

router = APIRouter()


@router.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@router.get("/documents/status")
def documents_status(x_chat_id: str = Header(...)) -> dict[str, int]:
    try:
        return {"chunks": indexed_document_count(x_chat_id)}
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error


@router.post("/documents/index")
async def index_document(
    file: UploadFile = File(...),
    x_chat_id: str = Header(...),
) -> dict[str, int | str]:
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=422, detail="Only PDF files are supported")

    try:
        with NamedTemporaryFile(suffix=".pdf", delete=False) as temporary_file:
            temporary_path = Path(temporary_file.name)
            temporary_file.write(await file.read())
        chunks = index_pdf(temporary_path, x_chat_id)
        summary = summarize_pdf(temporary_path)
        return {
            "filename": file.filename or "document.pdf",
            "chunks": chunks,
            "summary": summary,
        }
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    finally:
        if "temporary_path" in locals():
            temporary_path.unlink(missing_ok=True)


@router.post("/generate", response_model=ChatOutput)
def generate(chat_input: ChatInput) -> ChatOutput:
    try:
        return ChatOutput(response=generate_response(chat_input))
    except RuntimeError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
