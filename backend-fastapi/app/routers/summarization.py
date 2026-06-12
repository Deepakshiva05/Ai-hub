from fastapi import APIRouter, HTTPException, Depends
from ..models import SummarizeRequest, SummarizeResponse
from ..database import get_db
from ..config import HUGGINGFACE_API_KEY
import httpx
import datetime
import uuid
import collections
import re

router = APIRouter(prefix="/api/summarize", tags=["summarization"])

def local_summarize(text: str, mode: str, length: str):
    # Splitting sentences
    sentences = re.split(r'(?<=[.!?]) +', text.strip())
    sentences = [s.strip() for s in sentences if len(s.strip()) > 10]
    
    if not sentences:
        return "Provided text is too short for a summary.", ["Text too short to extract key points."]
        
    words = re.findall(r'\w+', text.lower())
    stopwords = {"the", "a", "an", "and", "or", "but", "if", "then", "else", "when", "at", "by", "from", "for", "in", "out", "on", "off", "over", "under", "to", "with", "is", "was", "were", "are", "be", "been", "has", "have", "had", "that", "this", "these", "those", "it", "its", "he", "she", "they", "we", "us", "him", "her", "them", "i", "me", "my", "your", "their", "our"}
    filtered_words = [w for w in words if w not in stopwords]
    word_freq = collections.Counter(filtered_words)
    
    sentence_scores = []
    for s in sentences:
        score = sum(word_freq[w] for w in re.findall(r'\w+', s.lower()))
        sentence_scores.append((s, score))
        
    sorted_sentences = sorted(sentence_scores, key=lambda x: x[1], reverse=True)
    
    limit = 3
    if length == "short":
        limit = 2
    elif length == "medium":
        limit = 4
    elif length == "long":
        limit = 6
        
    top_sentences = sorted_sentences[:limit]
    top_sentences = sorted(top_sentences, key=lambda x: sentences.index(x[0]))
    
    summary = " ".join([x[0] for x in top_sentences])
    key_points = [x[0] for x in sorted_sentences[:min(len(sorted_sentences), 5)]]
    
    return summary, key_points

@router.post("", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest, db = Depends(get_db)):
    text = request.text
    if len(text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Text must be at least 20 characters long.")
        
    summary = ""
    key_points = []
    use_fallback = True
    
    if HUGGINGFACE_API_KEY and HUGGINGFACE_API_KEY != "hf_YOUR_API_KEY_HERE" and HUGGINGFACE_API_KEY.strip() != "":
        try:
            headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
            min_len = 30
            max_len = 150
            if request.length == "short":
                max_len = 65
            elif request.length == "long":
                max_len = 250
                
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                    headers=headers,
                    json={
                        "inputs": text,
                        "parameters": {"min_length": min_len, "max_length": max_len}
                    }
                )
                if response.status_code == 200:
                    result = response.json()
                    if isinstance(result, list) and len(result) > 0 and "summary_text" in result[0]:
                        summary = result[0]["summary_text"]
                        # Extract key points from text locally
                        _, key_points = local_summarize(text, "key_points", "medium")
                        use_fallback = False
        except Exception:
            pass
            
    if use_fallback:
        summary, key_points = local_summarize(text, request.mode, request.length)
        
    doc_id = str(uuid.uuid4())
    summary_doc = {
        "_id": doc_id,
        "original_text": text,
        "summary": summary,
        "key_points": key_points,
        "mode": request.mode,
        "length": request.length,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    db["summaries"].insert_one(summary_doc)
    
    # Log activity
    db["activity_logs"].insert_one({
        "_id": str(uuid.uuid4()),
        "activity_type": "summarization",
        "description": f"Summarized text of {len(text)} characters ({request.length})",
        "created_at": datetime.datetime.utcnow().isoformat()
    })
    
    return SummarizeResponse(
        id=doc_id,
        summary=summary,
        key_points=key_points,
        created_at=datetime.datetime.utcnow()
    )

@router.get("/history")
async def get_history(limit: int = 15, db = Depends(get_db)):
    summaries = db["summaries"].find(sort=[("created_at", -1)], limit=limit)
    formatted = []
    for s in summaries:
        formatted.append({
            "id": s["_id"],
            "summary": s["summary"],
            "key_points": s["key_points"],
            "mode": s.get("mode", "summary"),
            "length": s.get("length", "medium"),
            "created_at": s["created_at"]
        })
    return formatted
