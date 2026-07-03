from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import api_router

app = FastAPI()
app.include_router(api_router)

origins = [
    "http://localhost:3000",
    "https://gtamodi.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="[IP_ADDRESS]", port=8000)