@echo off
echo Starting QuantBet Backend...
cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo Installing dependencies (this may take a while)...
pip install -r requirements.txt

echo Starting server...
uvicorn app.main:app --reload
