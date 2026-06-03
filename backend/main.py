from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.hello import router as hello_router
from routes.roadmap import router as roadmap_router
from routes.resume_match import router as resume_match_router

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hello_router)
app.include_router(roadmap_router)
app.include_router(resume_match_router)
@app.get("/")
def home():
    return {"message": "Backend Running"}

# @app.get("/hello")
# def hello():
#     return {"message": "Hello from FastAPI Backend"}