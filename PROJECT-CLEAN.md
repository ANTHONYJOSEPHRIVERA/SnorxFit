# SnorxFit - Proyecto Limpio para APK

## 📱 SOLO LO NECESARIO PARA GENERAR APK:

### ✅ Archivos Esenciales:
- `src/` - Tu aplicación React
- `android/` - Proyecto Android (Capacitor)
- `build/` - Build de producción
- `capacitor.config.ts` - Configuración
- `build-apk.bat` - Script optimizado

### 🗑️ Eliminado:
- ❌ SnorxFit-Mobile (proyecto Expo duplicado)
- ❌ SnorxFit-APK (proyecto Cordova)
- ❌ Dependencias innecesarias (qrcode, expo, cordova)
- ❌ Scripts y guías temporales

### 🚀 Para generar APK:
1. `npm run build` (actualizar build)
2. `npx cap sync android` (sincronizar)
3. `npx cap open android` (abrir Android Studio)
4. Build > Build APK

### 💾 Espacio liberado: ~500MB+
