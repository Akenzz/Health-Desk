import os
import sys
from pathlib import Path

project_root = Path(__file__).resolve().parent
venv_site_packages = next(
    (path for path in (project_root / ".venv" / "lib").glob("python*/site-packages") if path.is_dir()),
    None,
)

if venv_site_packages is not None:
    sys.path.insert(0, str(venv_site_packages))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.predict_disease import app as predict_app
from services.medical_bot import app as medical_bot_app

app = FastAPI(title="HealthDesk AI Unified Server", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/predict-disease", predict_app)
app.mount("/medical-bot", medical_bot_app)


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Unified server is running.",
        "routes": {
            "predict-disease": {
                "base": "/predict-disease/",
                "predict": "/predict-disease/predict",
            },
            "medical-bot": {
                "base": "/medical-bot/",
                "chat": "/medical-bot/chat",
            },
        },
    }


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload_enabled = os.getenv("RELOAD", "false").lower() == "true"

    try:
        import uvicorn

        uvicorn.run(app, host=host, port=port, reload=reload_enabled)
    except ModuleNotFoundError:
        venv_python = Path(__file__).resolve().parent / ".venv" / "bin" / "python"
        if venv_python.exists():
            os.execv(
                str(venv_python),
                [
                    str(venv_python),
                    "-m",
                    "uvicorn",
                    "app:app",
                    "--host",
                    host,
                    "--port",
                    str(port),
                ],
            )

        raise RuntimeError(
            "uvicorn is not installed in the current interpreter and the local .venv was not found."
        ) from None
