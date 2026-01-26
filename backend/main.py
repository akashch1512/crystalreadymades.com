import os
import sys

VENV_PYTHON = os.path.join(".venv", "Scripts", "python.exe")

os.execv(
    VENV_PYTHON,
    [
        VENV_PYTHON,
        "-m",
        "uvicorn",
        "app.start:app",
        "--reload"
    ]
)
