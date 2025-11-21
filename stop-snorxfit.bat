@echo off
echo 🛑 Deteniendo SnorxFit - Frontend y Backend
echo ==========================================

echo.
echo 🔄 Cerrando procesos de Node.js...
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend detenido
) else (
    echo ⚠️  No se encontraron procesos de backend
)

echo.
echo 🔄 Cerrando procesos de npm...
taskkill /F /IM npm.exe 2>nul
taskkill /F /IM cmd.exe /FI "WINDOWTITLE eq SnorxFit*" 2>nul

echo.
echo ✅ SnorxFit detenido completamente
echo.
pause