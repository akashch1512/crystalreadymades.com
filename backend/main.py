import os
import sys

VENV_PYTHON = os.path.join(".venv", "Scripts", "python.exe")

if not os.path.exists(VENV_PYTHON):
    print("❌ .venv not found")
    sys.exit(1)

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