# 🔑 Guía para Obtener una Nueva API Key de Google Gemini

## 📌 PASOS PARA CREAR TU API KEY:

### 1️⃣ **Ir a Google AI Studio**
   - Abre tu navegador
   - Ve a: https://makersuite.google.com/app/apikey
   - O busca: "Google AI Studio API Key"

### 2️⃣ **Iniciar Sesión**
   - Usa tu cuenta de Google
   - Acepta los términos y condiciones

### 3️⃣ **Crear API Key**
   - Click en "Create API Key" o "Crear clave de API"
   - Selecciona un proyecto existente o crea uno nuevo
   - Copia la API key que te genera

### 4️⃣ **Configurar en tu Proyecto**
   - Abre el archivo: `C:\xampp\htdocs\FICTIA\.env`
   - Reemplaza la línea:
     ```
     REACT_APP_API_KEY=TU_NUEVA_API_KEY_AQUI
     ```

### 5️⃣ **Reiniciar el Servidor**
   - Detén el servidor (Ctrl+C en la terminal)
   - Ejecuta: `npm start`

---

## ⚡ ALTERNATIVA: Verificar API Key Actual

### Verificar si la API key actual está activa:

1. **Ir a Google Cloud Console:**
   - https://console.cloud.google.com/apis/credentials

2. **Verificar estado:**
   - Busca tu API key en la lista
   - Verifica que esté "Habilitada"
   - Verifica que no haya excedido el límite de cuotas

3. **Verificar cuotas:**
   - https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas

---

## 🔧 SOLUCIÓN RÁPIDA: Probar con una API key temporal

Si quieres probar rápidamente, puedes:

1. Crear una nueva API key en: https://makersuite.google.com/app/apikey
2. Copiar la nueva API key
3. Actualizar el archivo `.env` con la nueva key
4. Reiniciar el servidor con `npm start`

---

## 📊 LÍMITES DE LA API GRATUITA:

- ✅ **60 solicitudes por minuto**
- ✅ **1500 solicitudes por día** (gratis)
- ✅ **1 millón de tokens por mes** (gratis)

Si excediste estos límites, necesitas:
- Esperar 24 horas para que se resetee
- O crear una nueva API key
- O actualizar a un plan de pago

---

## 🚨 ERRORES COMUNES:

### Error: "API key not valid"
- ✅ Solución: Crear una nueva API key

### Error: "Quota exceeded"
- ✅ Solución: Esperar 24 horas o crear nueva key

### Error: "Permission denied"
- ✅ Solución: Habilitar Gemini API en Google Cloud Console

---

## 💡 DESPUÉS DE OBTENER LA NUEVA API KEY:

Yo te ayudaré a actualizarla en el archivo `.env` automáticamente.
Solo avísame cuando la tengas lista! 🚀
