from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ImageGenerateRequest(BaseModel):
    prompt: str
    style: str = "realistic"
    size: str = "1:1"
    batch_size: int = 1
    enhance_prompt: bool = False

class ImageGenerateResponse(BaseModel):
    id: str
    images: List[str]  # List of Base64 strings or URLs
    prompt: str
    enhanced_prompt: Optional[str] = None
    style: str
    size: str
    created_at: datetime

class SummarizeRequest(BaseModel):
    text: str
    mode: str = "summary"  # summary, bullet_points, key_points, outline
    length: str = "medium"  # short, medium, long

class SummarizeResponse(BaseModel):
    id: str
    summary: str
    key_points: List[str]
    created_at: datetime

class TranslationRequest(BaseModel):
    text: str
    source_lang: str = "Auto"
    target_lang: str

class TranslationResponse(BaseModel):
    id: str
    translated_text: str
    pronunciation_guide: str
    created_at: datetime

class RAGChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class RAGChatResponse(BaseModel):
    reply: str
    context_used: List[str]
    created_at: datetime
