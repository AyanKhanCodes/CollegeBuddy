from fastapi import FastAPI

app = FastAPI(title="CollegeBuddy API")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
