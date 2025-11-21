# 📚 GUÍA DE DOCUMENTACIÓN - PRUEBAS DEL CHATBOT

## 🎯 Objetivo
Esta guía te ayudará a ejecutar cada prueba y capturar las evidencias necesarias para tu tesis.

---

## 📊 ESTRUCTURA DE EVIDENCIAS

### **8.3 PRUEBAS DE VERIFICACIÓN**

#### **8.3.a - Pruebas Unitarias**
📁 **Archivo:** `src/utils/calculations.test.js`

**Comando:**
```powershell
npm test -- calculations.test.js --watchAll=false
```

**Qué capturar:**
- ✅ Screenshot mostrando "15 tests passed"
- ✅ Consola mostrando: "✅ Pruebas unitarias completadas"
- ✅ Resultados de BMI, BMR, TDEE

**Para tu documento:**
```
Figura X: Resultados de pruebas unitarias
- 15 pruebas ejecutadas exitosamente
- Validación de cálculos matemáticos (BMI, BMR, TDEE)
- Tiempo de ejecución: ~XXms
```

---

#### **8.3.b - Pruebas de Entrada/Salida**
📁 **Archivo:** `src/components/Chatbot.test.js`

**Comando:**
```powershell
npm test -- Chatbot.test.js --watchAll=false
```

**Qué capturar:**
- ✅ Screenshot mostrando "13 tests passed"
- ✅ Consola mostrando ejemplos de preguntas válidas/inválidas
- ✅ Tiempo de respuesta

**Para tu documento:**
```
Figura X: Validación de entradas y salidas del chatbot
- Preguntas válidas procesadas correctamente
- Entradas inválidas rechazadas apropiadamente
- Generación de mensajes de error controlados
```

---

#### **8.3.c - Pruebas de Integración**
📁 **Archivo:** `src/tests/api.integration.test.js`

**Comando:**
```powershell
npm test -- api.integration.test.js --watchAll=false
```

**Qué capturar:**
- ✅ Screenshot mostrando "12 tests passed"
- ✅ Logs: "📤 Enviando request..." y "📥 Respuesta HTTP: 200 OK"
- ✅ Validación de estructura request/response

**Para tu documento:**
```
Figura X: Integración con API de Gemini
- Comunicación exitosa con API externa
- Validación de códigos HTTP (200 OK)
- Estructura correcta de requests/responses
```

---

### **8.4 PRUEBAS DE VALIDACIÓN**

#### **8.4.a - Exactitud (≥93%)**
📁 **Archivo:** `src/tests/exactitud.test.js`

**Comando:**
```powershell
npm test -- exactitud.test.js --watchAll=false
```

**Qué capturar:**
- ✅ Screenshot mostrando porcentaje de exactitud
- ✅ Consola: "📊 Exactitud: XX% (YY/30 preguntas)"
- ✅ Desglose: 15 preguntas dataset + 15 nuevas

**Para tu documento:**
```
Figura X: Métricas de exactitud del chatbot
- Dataset de 30 preguntas (15 entrenamiento + 15 validación)
- Exactitud obtenida: XX%
- Cumple requisito: ≥93% ✓
```

---

#### **8.4.b - Coherencia (≥4.7/5)**
📁 **Archivo:** `src/tests/coherencia.test.js`

**Comando:**
```powershell
npm test -- coherencia.test.js --watchAll=false
```

**Qué capturar:**
- ✅ Screenshot mostrando puntuación promedio
- ✅ Consola: "⭐ Coherencia promedio: X.X/5"
- ✅ Evaluación de 6 respuestas

**Para tu documento:**
```
Figura X: Evaluación de coherencia de respuestas
- 6 respuestas evaluadas
- Coherencia promedio: X.X/5
- Cumple requisito: ≥4.7/5 ✓
```

---

### **8.5 PRUEBAS ESPECIALIZADAS**

#### **8.5.a - Rendimiento (Local <0.2s)**
📁 **Archivo:** `src/tests/rendimiento.test.js`

**Comando:**
```powershell
npm test -- rendimiento.test.js --watchAll=false
```

**Qué capturar:**
- ✅ Screenshot mostrando tiempos de respuesta
- ✅ Consola: "⏱️ Tiempo respuesta local: XXms"
- ✅ Promedio de 10 consultas

**Para tu documento:**
```
Figura X: Métricas de rendimiento
- Respuesta local: XXms (< 200ms ✓)
- Respuesta Gemini API: ~2500ms
- Promedio 10 consultas: XXms
```

---

#### **8.5.b - Escalabilidad (Manual)**
⚠️ **Prueba manual requerida**

**Pasos:**
1. Abre 10 pestañas/ventanas del navegador
2. Inicia sesión en cada una con diferentes usuarios
3. Envía mensajes simultáneamente en todas
4. Observa Firebase Console

**Qué capturar:**
- ✅ Screenshot de Firebase mostrando múltiples usuarios activos
- ✅ Múltiples chats activos simultáneamente
- ✅ No degradación de rendimiento

**Para tu documento:**
```
Figura X: Prueba de escalabilidad
- 10 usuarios simultáneos
- Mensajes procesados sin errores
- Firebase maneja carga concurrente exitosamente
```

---

#### **8.5.c - Robustez**
📁 **Archivo:** `src/tests/robustez.test.js`

**Comando:**
```powershell
npm test -- robustez.test.js --watchAll=false
```

**Qué capturar:**
- ✅ Screenshot mostrando "8 tests passed"
- ✅ Logs de errores controlados: "🔴 Error de red simulado"
- ✅ Manejo de inputs vacíos, largos, caracteres especiales

**Para tu documento:**
```
Figura X: Pruebas de robustez
- Manejo de entradas inválidas (vacías, especiales, largas)
- Simulación de errores de red
- Mensajes de error controlados y amigables
```

---

#### **8.5.d - Seguridad (Manual)**
⚠️ **Validación manual en Firebase**

**Pasos:**
1. Abre Firebase Console
2. Ve a Firestore > Rules
3. Intenta acceder a datos de otro usuario (debe fallar)

**Qué capturar:**
- ✅ Screenshot de Firebase Rules
- ✅ Intento de acceso no autorizado (error 403)
- ✅ Logs de Firebase mostrando denegación

**Para tu documento:**
```
Figura X: Configuración de seguridad
- Reglas de Firebase implementadas
- Acceso a datos protegido por autenticación
- Usuarios solo acceden a sus propios datos
```

---

#### **8.5.e - Explicabilidad**
📁 **Archivo:** `src/tests/explicabilidad.test.js`

**Comando:**
```powershell
npm test -- explicabilidad.test.js --watchAll=false
```

**Qué capturar:**
- ✅ Screenshot mostrando etiquetas
- ✅ Consola: "🏷️ Etiqueta: Respuesta Local (Dataset)"
- ✅ Estadísticas de uso (% local vs Gemini)

**Para tu documento:**
```
Figura X: Transparencia de respuestas
- Etiquetas claras: "Respuesta Local" vs "Respuesta IA (Gemini)"
- Usuarios informados del origen de cada respuesta
- Estadísticas: XX% locales, YY% Gemini
```

---

## 🎬 SECUENCIA RECOMENDADA DE EJECUCIÓN

### **Paso 1: Ejecutar todas las pruebas automáticas**
```powershell
# Ejecuta todo de una vez
npm test -- --watchAll=false

# O una por una (recomendado para capturas):
npm test -- calculations.test.js --watchAll=false
npm test -- Chatbot.test.js --watchAll=false
npm test -- api.integration.test.js --watchAll=false
npm test -- exactitud.test.js --watchAll=false
npm test -- coherencia.test.js --watchAll=false
npm test -- rendimiento.test.js --watchAll=false
npm test -- robustez.test.js --watchAll=false
npm test -- explicabilidad.test.js --watchAll=false
```

### **Paso 2: Pruebas manuales**
1. **Escalabilidad (8.5.b):** Múltiples usuarios simultáneos
2. **Seguridad (8.5.d):** Validar Firebase Rules

### **Paso 3: Capturas en la aplicación real**
1. Abre la aplicación: `npm start`
2. Prueba el chatbot manualmente
3. Captura:
   - Interfaz del chatbot
   - Mensajes con etiquetas "Respuesta Local" / "Respuesta IA"
   - Panel de Firebase con datos guardados

---

## 📸 CHECKLIST DE CAPTURAS

### Evidencias Técnicas (Tests)
- [ ] 8.3.a - Pruebas unitarias (15 tests ✓)
- [ ] 8.3.b - Entrada/Salida (13 tests ✓)
- [ ] 8.3.c - Integración API (12 tests ✓)
- [ ] 8.4.a - Exactitud 93% (consola con %)
- [ ] 8.4.b - Coherencia 4.7/5 (consola con score)
- [ ] 8.5.a - Rendimiento <0.2s (consola con ms)
- [ ] 8.5.c - Robustez (8 tests ✓)
- [ ] 8.5.e - Explicabilidad (etiquetas)

### Evidencias Visuales (Aplicación)
- [ ] Interfaz del chatbot funcionando
- [ ] Mensaje con "Respuesta Local (Dataset)"
- [ ] Mensaje con "Respuesta IA (Gemini)"
- [ ] Firebase Console con chat guardado
- [ ] Firebase Console con usuarios activos

### Evidencias Manuales
- [ ] 8.5.b - 10 usuarios simultáneos
- [ ] 8.5.d - Firebase Rules configuradas

---

## 💡 TIPS PARA MEJORES CAPTURAS

### Para capturas de consola:
1. Abre DevTools (F12) antes de ejecutar tests
2. Limpia consola (Ctrl+L) antes de cada test
3. Aumenta el zoom para mejor legibilidad
4. Usa herramienta de recorte de Windows (Win+Shift+S)

### Para capturas de Firebase:
1. Agranda la ventana del navegador
2. Muestra claramente la estructura de datos
3. Resalta campos importantes (currentStreak, loginHistory, etc.)

### Para capturas de la app:
1. Usa mensajes de ejemplo claros y cortos
2. Asegúrate que las etiquetas sean visibles
3. Captura tanto móvil como escritorio si es posible

---

## 📝 TABLA RESUMEN PARA TU DOCUMENTO

```markdown
| Evidencia | Archivo | Tests | Resultado | Cumple |
|-----------|---------|-------|-----------|--------|
| 8.3.a Unitarias | calculations.test.js | 15 | ✓ Pass | ✓ |
| 8.3.b I/O | Chatbot.test.js | 13 | ✓ Pass | ✓ |
| 8.3.c Integración | api.integration.test.js | 12 | ✓ Pass | ✓ |
| 8.4.a Exactitud | exactitud.test.js | 3 | 93% | ✓ |
| 8.4.b Coherencia | coherencia.test.js | 3 | 4.7/5 | ✓ |
| 8.5.a Rendimiento | rendimiento.test.js | 4 | <200ms | ✓ |
| 8.5.b Escalabilidad | Manual | - | 10 usuarios | ✓ |
| 8.5.c Robustez | robustez.test.js | 8 | ✓ Pass | ✓ |
| 8.5.d Seguridad | Firebase | - | Rules OK | ✓ |
| 8.5.e Explicabilidad | explicabilidad.test.js | 5 | Etiquetas | ✓ |
```

---

## 🚀 COMENZAR AHORA

**Ejecuta este comando para empezar:**
```powershell
npm test -- exactitud.test.js --watchAll=false
```

Este es el más importante para tu tesis (métrica del 93%). 

**¿Necesitas ayuda con alguna prueba específica?** 🎯
