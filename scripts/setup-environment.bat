@echo off
echo Setting up Auterity development environment...

REM API service Python setup
cd services\api
if not exist .venv (
    echo Creating Python virtual environment...
    python -m venv .venv
)
call .venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..

REM Frontend Node.js setup
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)
cd ..

echo Environment setup complete!
echo - API service: cd services\api && .venv\Scripts\activate.bat
echo - Frontend: cd frontend && npm run dev
