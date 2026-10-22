@echo off
echo ============================================
echo   Voice to Text Note App - Starting Server
echo ============================================
echo.
echo Checking Python installation...
python --version
echo.
echo Installing dependencies...
pip install -r requirements.txt
echo.
echo Starting Flask server...
echo.
echo Application will be available at:
echo http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.
python app.py
 