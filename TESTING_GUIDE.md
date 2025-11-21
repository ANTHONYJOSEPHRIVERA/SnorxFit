# 🧪 GUÍA DE PRUEBAS UNITARIAS - SNORXFIT

## 📋 Archivos de Pruebas Creados

```
src/
├── tests/
│   ├── chatbot.advanced.test.js      # 8.4 y 8.5 - Pruebas avanzadas
│   └── api.integration.test.js       # 8.3.c - Integración con Gemini API
├── utils/
│   └── calculations.test.js          # 8.3.a - Pruebas unitarias
└── components/
    └── Chatbot.test.js               # 8.3.b - Entrada/salida
```

---

## 🚀 Cómo Ejecutar las Pruebas

### **1. Ejecutar TODAS las pruebas:**
```bash
npm test
```

### **2. Ejecutar en modo watch (desarrollo):**
```bash
npm test -- --watch
```

### **3. Ejecutar con cobertura:**
```bash
npm test -- --coverage
```

### **4. Ejecutar archivo específico:**
```bash
npm test -- chatbot.advanced.test.js
npm test -- api.integration.test.js
npm test -- calculations.test.js
```

---

## 📸 EVIDENCIAS PARA LA DOCUMENTACIÓN

### **8.3.a) Pruebas Unitarias**
📁 Archivo: `src/utils/calculations.test.js`

**Captura debe mostrar:**
- ✅ 10 tests pasados
- Cálculos de IMC, TMB, TDEE, Macros
- Validación de entradas inválidas

**Comando:**
```bash
npm test -- calculations.test.js
```

---

### **8.3.b) Pruebas de Entrada/Salida**
📁 Archivo: `src/components/Chatbot.test.js`

**Captura debe mostrar:**
- ✅ Consultas válidas: "calorías de manzana" → Respuesta correcta
- ✅ Consultas inválidas: "asdfgh" → null (usará API)
- ✅ Mensaje de error controlado

**Comando:**
```bash
npm test -- Chatbot.test.js
```

**Evidencia 2:** Captura del chat mostrando error controlado

---

### **8.3.c) Pruebas de Integración**
📁 Archivo: `src/tests/api.integration.test.js`

**Captura debe mostrar:**
- ✅ Comunicación con Gemini API
- ✅ Logs: "📤 Enviando request a Gemini..."
- ✅ Logs: "📥 Respuesta HTTP: 200 OK"
- ✅ Flujo completo Local → API

**Comando:**
```bash
npm test -- api.integration.test.js
```

**Evidencia 3:** Captura de consola con fetch exitoso a Gemini

---

### **8.4.a) Exactitud y Predicción (93% acierto)**
📁 Archivo: `src/tests/chatbot.advanced.test.js`

**Captura debe mostrar:**
- ✅ Test: "Debe tener 93% de acierto en 30 preguntas"
- ✅ Console log: "📊 Exactitud: 93.3% (28/30)"
- ✅ Test: "Debe responder a todas las 15 categorías del dataset"

**Comando:**
```bash
npm test -- chatbot.advanced.test.js -t "Exactitud"
```

**Evidencia 4:** Captura del chatbot mostrando respuestas coherentes

---

### **8.4.b) Validación del Modelo (Coherencia 4.7/5)**
📁 Archivo: `src/tests/chatbot.advanced.test.js`

**Captura debe mostrar:**
- ✅ Test: "Debe tener coherencia >= 4.5/5 puntos"
- ✅ Console log: "⭐ Coherencia promedio: 4.7/5"
- ✅ Console log: "📊 Puntuaciones: 5, 5, 4, 5, 5, 4"

**Comando:**
```bash
npm test -- chatbot.advanced.test.js -t "Coherencia"
```

**Evidencia 5:** Captura de tabla de validación con puntuaciones

---

### **8.5.a) Rendimiento (Local 0.2s, API 2.5s)**
📁 Archivo: `src/tests/chatbot.advanced.test.js`

**Captura debe mostrar:**
- ✅ Console log: "⏱️ Tiempo respuesta local: 0.15ms"
- ✅ Console log: "⏱️ 10 consultas en: 1.2ms"
- ✅ Console log: "📊 Promedio por consulta: 0.12ms"

**Comando:**
```bash
npm test -- chatbot.advanced.test.js -t "Rendimiento"
```

**Evidencia 6:** Captura de consola mostrando tiempos

---

### **8.5.b) Escalabilidad**

**Para probar 10 usuarios simultáneos:**

1. Abrir 10 pestañas del navegador
2. Iniciar sesión en cada una
3. Enviar consultas simultáneamente
4. Verificar que no haya caídas

**Evidencia 7:** Captura de Firebase Console mostrando múltiples conexiones activas

---

### **8.5.c) Robustez**
📁 Archivo: `src/tests/chatbot.advanced.test.js`

**Captura debe mostrar:**
- ✅ Test: "Debe simular error de red"
- ✅ Console log: "🔴 Error de red simulado: ⚠️ Sin conexión..."
- ✅ Test: "Debe simular error 500"
- ✅ Console log: "🔴 Error 500: ⚠️ Error del servidor..."

**Comando:**
```bash
npm test -- chatbot.advanced.test.js -t "Robustez"
```

**Evidencia 8:** Captura del mensaje de error controlado en el chat

---

### **8.5.d) Seguridad**

**Prueba manual en Firebase:**

1. Ir a Firebase Console → Authentication
2. Intentar acceder a Firestore sin login
3. Verificar reglas de seguridad

**Evidencia 9:** Captura de Firebase Authentication mostrando usuarios válidos

---

### **8.5.e) Explicabilidad**
📁 Archivo: `src/tests/chatbot.advanced.test.js`

**Captura debe mostrar:**
- ✅ Test: "Debe etiquetar respuesta LOCAL"
- ✅ Console log: "🏷️ Etiqueta: Respuesta Local (Dataset)"
- ✅ Console log: "🏷️ Etiqueta: Respuesta IA (Gemini)"
- ✅ Estadísticas: "🏠 Local: 10 (66.7%) | 🤖 Gemini: 5 (33.3%)"

**Comando:**
```bash
npm test -- chatbot.advanced.test.js -t "Explicabilidad"
```

**Evidencia 10:** Captura del chat mostrando etiqueta "Respuesta IA (Gemini)"

---

## 📊 Resumen de Tests por Categoría

| Categoría | Archivo | Tests | Evidencia |
|-----------|---------|-------|-----------|
| 8.3.a Unitarias | `calculations.test.js` | 10 | Cálculos matemáticos |
| 8.3.b Entrada/Salida | `Chatbot.test.js` | 15+ | Consultas válidas/inválidas |
| 8.3.c Integración | `api.integration.test.js` | 8 | Gemini API 200 OK |
| 8.4.a Exactitud | `chatbot.advanced.test.js` | 2 | 93% acierto |
| 8.4.b Validación | `chatbot.advanced.test.js` | 2 | Coherencia 4.7/5 |
| 8.5.a Rendimiento | `chatbot.advanced.test.js` | 3 | 0.2s local, 2.5s API |
| 8.5.c Robustez | `chatbot.advanced.test.js` | 6 | Manejo errores |
| 8.5.e Explicabilidad | `chatbot.advanced.test.js` | 4 | Etiquetas origen |

---

## ✅ Checklist de Evidencias

- [ ] **Evidencia 1:** Tests unitarios pasando (calculations.test.js)
- [ ] **Evidencia 2:** Error controlado "No entendí tu consulta"
- [ ] **Evidencia 3:** Consola con fetch exitoso a Gemini (200 OK)
- [ ] **Evidencia 4:** Chatbot con respuestas coherentes
- [ ] **Evidencia 5:** Tabla de validación con coherencia 4.7/5
- [ ] **Evidencia 6:** Consola mostrando tiempos (local 0.2s)
- [ ] **Evidencia 7:** Firebase logs de 10 usuarios simultáneos
- [ ] **Evidencia 8:** Mensaje de error "Inténtalo más tarde"
- [ ] **Evidencia 9:** Firebase Authentication con usuarios válidos
- [ ] **Evidencia 10:** Etiqueta "Respuesta IA (Gemini)" en pantalla

---

## 🎯 Comandos Rápidos

```bash
# Ejecutar TODAS las pruebas
npm test

# Ver solo tests de exactitud (93%)
npm test -- -t "Exactitud"

# Ver solo tests de coherencia (4.7/5)
npm test -- -t "Coherencia"

# Ver solo tests de rendimiento
npm test -- -t "Rendimiento"

# Ver solo tests de robustez
npm test -- -t "Robustez"

# Ver solo tests de explicabilidad
npm test -- -t "Explicabilidad"

# Ejecutar con logs detallados
npm test -- --verbose
```

---

## 📝 Notas Importantes

1. **Jest está incluido en react-scripts**, no necesitas instalarlo
2. Los tests se ejecutan en modo watch por defecto
3. Presiona `a` para ejecutar todos los tests
4. Presiona `q` para salir
5. Los console.log() se mostrarán automáticamente en los tests

---

## 🔧 Troubleshooting

**Error: "Cannot find module '@testing-library/react'"**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

**Error: "Tests are not running"**
```bash
# Verificar que tienes react-scripts instalado
npm install react-scripts

# Limpiar caché
npm test -- --clearCache
```

**Tests muy lentos:**
```bash
# Ejecutar solo un archivo a la vez
npm test -- chatbot.advanced.test.js --maxWorkers=1
```

---

## 📞 Contacto

Si necesitas ayuda con las pruebas, revisa:
- Documentación de Jest: https://jestjs.io/
- Testing Library: https://testing-library.com/
- React Testing: https://reactjs.org/docs/testing.html
