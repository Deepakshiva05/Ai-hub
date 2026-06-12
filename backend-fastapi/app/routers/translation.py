from fastapi import APIRouter, HTTPException, Depends
from ..models import TranslationRequest, TranslationResponse
from ..database import get_db
from ..config import HUGGINGFACE_API_KEY
import httpx
import datetime
import uuid

router = APIRouter(prefix="/api/translate", tags=["translation"])

PRONUNCIATION_KEYS = {
    "Hola": "OH-lah",
    "Bonjour": "bohn-ZHOOR",
    "Hallo": "HAH-loh",
    "こんにちは (Konnichiwa)": "kon-nee-chee-wah",
    "नमस्ते (Namaste)": "nuh-mus-tay",
    "你好 (Nǐ hǎo)": "nee how",
    "Gracias": "GRAH-syahs",
    "Merci": "mair-SEE",
    "Danke": "DAHN-kuh",
    "ありがとう (Arigatou)": "ah-ree-gah-toh",
    "धन्यवाद (Dhanyavaad)": "dhun-yuh-vaadh",
    "谢谢 (Xièxiè)": "syeh-syeh",
    "¿Cómo estás?": "KOH-moh ess-TAHSS",
    "Comment ça va?": "koh-mahn sah vah",
    "Wie geht es dir?": "vee gayt es deer",
    "お元気ですか (Ogenki desu ka)": "oh-gen-kee dess kah",
    "आप कैसे हैं (Aap kaise hain)": "aap kai-say hain",
    "你好吗 (Nǐ hǎo ma)": "nee how mah"
}

MOCK_PHRASES = {
    "hello": {
        "spanish": "Hola", "french": "Bonjour", "german": "Hallo", 
        "japanese": "こんにちは (Konnichiwa)", "hindi": "नमस्ते (Namaste)", "chinese": "你好 (Nǐ hǎo)"
    },
    "thank you": {
        "spanish": "Gracias", "french": "Merci", "german": "Danke", 
        "japanese": "ありがとう (Arigatou)", "hindi": "धन्यवाद (Dhanyavaad)", "chinese": "谢谢 (Xièxiè)"
    },
    "how are you": {
        "spanish": "¿Cómo estás?", "french": "Comment ça va?", "german": "Wie geht es dir?",
        "japanese": "お元気ですか (Ogenki desu ka)", "hindi": "आप कैसे हैं (Aap kaise hain)", "chinese": "你好吗 (Nǐ hǎo ma)"
    },
    "goodbye": {
        "spanish": "Adiós", "french": "Au revoir", "german": "Auf Wiedersehen",
        "japanese": "さようなら (Sayounara)", "hindi": "अलविदा (Alvida)", "chinese": "再见 (Zàijiàn)"
    }
}

def get_pronunciation(text: str, target_lang: str) -> str:
    for k, v in PRONUNCIATION_KEYS.items():
        if k in text:
            return v
    words = text.split()
    guide = []
    for w in words:
        w_clean = "".join(c for c in w if c.isalnum()).lower()
        if w_clean in ["la", "le", "el", "los", "un", "una"]:
            guide.append(w_clean.upper())
        elif len(w_clean) > 3:
            guide.append(w_clean[:3].upper() + "-" + w_clean[3:].lower())
        else:
            guide.append(w_clean.upper())
    return " ".join(guide) if guide else "No guide available"

@router.post("", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest, db = Depends(get_db)):
    text = request.text
    target = request.target_lang.lower()
    
    translated_text = ""
    pronunciation_guide = ""
    use_fallback = True
    
    if HUGGINGFACE_API_KEY and HUGGINGFACE_API_KEY != "hf_YOUR_API_KEY_HERE" and HUGGINGFACE_API_KEY.strip() != "":
        try:
            headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
            lang_codes = {
                "spanish": "spa_Latn", "french": "fra_Latn", "german": "deu_Latn",
                "japanese": "jpn_Jpan", "hindi": "hin_Deva", "chinese": "zho_Hans"
            }
            tgt_code = lang_codes.get(target, "spa_Latn")
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M",
                    headers=headers,
                    json={
                        "inputs": text,
                        "parameters": {"src_lang": "eng_Latn", "tgt_lang": tgt_code}
                    }
                )
                if response.status_code == 200:
                    result = response.json()
                    if isinstance(result, list) and len(result) > 0 and "translation_text" in result[0]:
                        translated_text = result[0]["translation_text"]
                        pronunciation_guide = get_pronunciation(translated_text, target)
                        use_fallback = False
        except Exception:
            pass
            
    if use_fallback:
        text_lower = text.lower().strip("?!. ")
        if text_lower in MOCK_PHRASES:
            translated_text = MOCK_PHRASES[text_lower].get(target, f"Translation of '{text}'")
        else:
            lang_suffixes = {
                "spanish": "o", "french": "e", "german": "en", "japanese": "す", "hindi": "जी", "chinese": "吗"
            }
            suffix = lang_suffixes.get(target, "")
            translated_text = f"{text} {suffix} [translated to {request.target_lang}]"
            
        pronunciation_guide = get_pronunciation(translated_text, target)
        
    doc_id = str(uuid.uuid4())
    trans_doc = {
        "_id": doc_id,
        "original_text": text,
        "translated_text": translated_text,
        "pronunciation_guide": pronunciation_guide,
        "source_lang": request.source_lang,
        "target_lang": request.target_lang,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    db["translations"].insert_one(trans_doc)
    
    db["activity_logs"].insert_one({
        "_id": str(uuid.uuid4()),
        "activity_type": "translation",
        "description": f"Translated text to {request.target_lang}: '{text[:40]}...'",
        "created_at": datetime.datetime.utcnow().isoformat()
    })
    
    return TranslationResponse(
        id=doc_id,
        translated_text=translated_text,
        pronunciation_guide=pronunciation_guide,
        created_at=datetime.datetime.utcnow()
    )

@router.get("/history")
async def get_history(limit: int = 15, db = Depends(get_db)):
    translations = db["translations"].find(sort=[("created_at", -1)], limit=limit)
    formatted = []
    for t in translations:
        formatted.append({
            "id": t["_id"],
            "original_text": t["original_text"],
            "translated_text": t["translated_text"],
            "pronunciation_guide": t.get("pronunciation_guide", ""),
            "source_lang": t.get("source_lang", "Auto"),
            "target_lang": t["target_lang"],
            "created_at": t["created_at"]
        })
    return formatted
