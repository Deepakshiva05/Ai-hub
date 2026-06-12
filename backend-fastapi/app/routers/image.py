from fastapi import APIRouter, HTTPException, Depends
from ..models import ImageGenerateRequest, ImageGenerateResponse
from ..database import get_db
from ..config import HUGGINGFACE_API_KEY
import httpx
import base64
import datetime
import uuid
import random

router = APIRouter(prefix="/api/image", tags=["image"])

STYLE_MODIFIERS = {
    "neon": "cyberpunk style, glowing neon lights, futuristic, highly detailed, octane render, 8k resolution, synthwave aesthetic",
    "realistic": "photorealistic, ultra realistic, professional photography, highly detailed, 8k resolution, dramatic lighting",
    "cyber": "cyberpunk theme, high-tech, futuristic city, glowing holographic elements, digital art, cinematic lighting",
    "abstract": "abstract expressionism, vibrant colors, fluid shapes, modern art style, complex geometric patterns, premium digital painting",
    "gold": "premium luxury aesthetic, golden gradients, elegant lines, dark background with metallic gold accents, ornate details, 3D render"
}

def enhance_prompt_text(prompt: str, style: str) -> str:
    modifier = STYLE_MODIFIERS.get(style, "")
    return f"{prompt}, {modifier}"

@router.post("/generate", response_model=ImageGenerateResponse)
async def generate_image(request: ImageGenerateRequest, db = Depends(get_db)):
    prompt = request.prompt
    style = request.style
    
    enhanced_prompt = enhance_prompt_text(prompt, style) if request.enhance_prompt else prompt
    
    images_base64 = []
    use_fallback = True
    
    if HUGGINGFACE_API_KEY and HUGGINGFACE_API_KEY != "hf_YOUR_API_KEY_HERE" and HUGGINGFACE_API_KEY.strip() != "":
        try:
            headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
            async with httpx.AsyncClient(timeout=30.0) as client:
                for _ in range(request.batch_size):
                    response = await client.post(
                        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
                        headers=headers,
                        json={"inputs": enhanced_prompt}
                    )
                    if response.status_code == 200:
                        image_bytes = response.content
                        base64_image = base64.b64encode(image_bytes).decode("utf-8")
                        images_base64.append(f"data:image/jpeg;base64,{base64_image}")
                    else:
                        break  # Fall back if error
            if len(images_base64) == request.batch_size:
                use_fallback = False
        except Exception:
            pass
            
    if use_fallback:
        # Fallback to premium geometric SVGs based on prompt
        images_base64 = []
        for i in range(request.batch_size):
            color1, color2, color3 = "#6366f1", "#8b5cf6", "#06b6d4"
            if style == "neon":
                color1, color2, color3 = "#ec4899", "#8b5cf6", "#06b6d4"
            elif style == "cyber":
                color1, color2, color3 = "#0f172a", "#06b6d4", "#6366f1"
            elif style == "abstract":
                color1, color2, color3 = "#f59e0b", "#ec4899", "#8b5cf6"
            elif style == "gold":
                color1, color2, color3 = "#020617", "#d97706", "#f59e0b"
                
            seed = random.randint(10, 80)
            svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
              <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="{color1}" />
                  <stop offset="100%" stop-color="{color2}" />
                </linearGradient>
                <radialGradient id="g2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="{color3}" stop-opacity="0.7"/>
                  <stop offset="100%" stop-color="{color2}" stop-opacity="0"/>
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <rect width="100%" height="100%" fill="url(#g1)" />
              <circle cx="{256 + (i * 20 - 10)}" cy="256" r="130" fill="url(#g2)" filter="url(#glow)" />
              <path d="M {100 + seed} 380 L 256 {130 + seed} L {412 - seed} 380 Z" fill="none" stroke="white" stroke-width="2" opacity="0.4" />
              <circle cx="256" cy="256" r="70" fill="none" stroke="{color3}" stroke-width="3" opacity="0.8" />
              <text x="50%" y="90%" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" opacity="0.7">{prompt[:30]}...</text>
            </svg>"""
            base64_svg = base64.b64encode(svg_content.encode("utf-8")).decode("utf-8")
            images_base64.append(f"data:image/svg+xml;base64,{base64_svg}")

    doc_id = str(uuid.uuid4())
    generation_doc = {
        "_id": doc_id,
        "images": images_base64,
        "prompt": prompt,
        "enhanced_prompt": enhanced_prompt,
        "style": style,
        "size": request.size,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    db["image_generations"].insert_one(generation_doc)
    
    # Log activity
    db["activity_logs"].insert_one({
        "_id": str(uuid.uuid4()),
        "activity_type": "image_generation",
        "description": f"Generated {request.batch_size} image(s) ({style}) for prompt: '{prompt[:40]}...'",
        "created_at": datetime.datetime.utcnow().isoformat()
    })
    
    return ImageGenerateResponse(
        id=doc_id,
        images=images_base64,
        prompt=prompt,
        enhanced_prompt=enhanced_prompt,
        style=style,
        size=request.size,
        created_at=datetime.datetime.utcnow()
    )

@router.get("/history")
async def get_history(limit: int = 15, db = Depends(get_db)):
    generations = db["image_generations"].find(sort=[("created_at", -1)], limit=limit)
    formatted = []
    for gen in generations:
        formatted.append({
            "id": gen["_id"],
            "images": gen["images"],
            "prompt": gen["prompt"],
            "enhanced_prompt": gen.get("enhanced_prompt"),
            "style": gen["style"],
            "size": gen["size"],
            "created_at": gen["created_at"]
        })
    return formatted
