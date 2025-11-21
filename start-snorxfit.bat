@echo off
echo 🚀 Iniciando SnorxFit - Frontend y Backend
echo =====================================

echo.
echo 📊 Verificando base de datos...
cd backend
node test-connection.js
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error de base de datos. Verifica que XAMPP esté funcionando.
    pause
    exit /b 1
)

echo.
echo 🌟 Iniciando Backend (Puerto 5000)...
start "SnorxFit Backend" cmd /k "node server.js"

echo ⏳ Esperando 3 segundos para que el backend inicie...
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Iniciando Frontend (Puerto 3000)...
cd ..
start "SnorxFit Frontend" cmd /k "npm start"

echo.
echo ✅ SnorxFit iniciado exitosamente!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo 💾 Base de datos: snorxfit_db
echo.
echo ⚠️  NO CIERRES ESTA VENTANA
echo    Los servidores se ejecutan en ventanas separadas
echo.
pause