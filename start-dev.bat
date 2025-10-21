@echo off
echo Starting Vinagaya Transport Development Servers...
echo.
echo Backend will start on https://vinayagatransport-backend1.onrender.com
echo Frontend will start on http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Install dependencies if needed
if not exist "backend/node_modules" (
    echo Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

if not exist "frontend/node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

echo Starting servers...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo Both servers are starting! Check the opened windows for output.
echo Frontend: http://localhost:5173
echo Backend API: https://vinayagatransport-backend1.onrender.com/api
pause

