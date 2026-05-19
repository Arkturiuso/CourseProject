from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import config
from app.routers.auth import router as auth_router  # <-- добавь

app = FastAPI(title="Clash Tournaments API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}