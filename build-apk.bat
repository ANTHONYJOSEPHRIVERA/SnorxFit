@echo off
echo 🚀 SnorxFit - Generador de APK OPTIMIZADO
echo =======================================
echo.

echo 📦 Paso 1: Construyendo proyecto React...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Error en build
    pause
    exit /b 1
)

echo.
echo � Paso 2: Sincronizando con Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Error sincronizando
    pause
    exit /b 1
)

echo.
echo 🏗️ Paso 3: Abriendo Android Studio...
call npx cap open android

echo.
echo ✅ ¡Proyecto listo para APK!
echo.
echo 📋 En Android Studio:
echo    Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo.
echo 📍 APK estará en:
echo    android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause