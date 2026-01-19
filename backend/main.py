from fastapi import FastAPI
from backend.routes.interviews import router as interviews_router

app = FastAPI(
    title="Interview Infra API",
    version="1.0.0",
)

app.include_router(interviews_router)
