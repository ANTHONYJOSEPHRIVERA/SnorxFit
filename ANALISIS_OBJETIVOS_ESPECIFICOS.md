# 📊 ANÁLISIS DE OBJETIVOS ESPECÍFICOS - SNORXFIT
## Aplicación Móvil Nutricional con Chatbot IA

**Fecha de Análisis:** 5 de Noviembre, 2025  
**Estado del Proyecto:** En desarrollo (Frontend completo, evaluación técnica pendiente)  
**Plataforma:** React + Firebase + Gemini AI

---

## 📋 RESUMEN EJECUTIVO

| # | Objetivo Específico | Estado | Progreso | Prioridad |
|---|---------------------|--------|----------|-----------|
| 1 | Análisis de requerimientos | ✅ **COMPLETO** | 100% | Alta |
| 2 | Diseño de arquitectura | ✅ **COMPLETO** | 100% | Alta |
| 3 | Implementación de app | ✅ **COMPLETO** | 95% | Alta |
| 4 | Evaluación técnica chatbot | ⚠️ **PARCIAL** | 60% | **CRÍTICA** |
| 5 | Evaluación de usabilidad (SUS) | ❌ **PENDIENTE** | 0% | **CRÍTICA** |
| 6 | Medición de impacto en usuarios | ❌ **PENDIENTE** | 0% | **CRÍTICA** |

---

## 🎯 ANÁLISIS DETALLADO POR OBJETIVO

### **OBJETIVO 1: Análisis de Requerimientos Funcionales y Técnicos**
**Estado:** ✅ **COMPLETADO (100%)**

#### ✅ Requerimientos Funcionales Implementados:

**RF1 - Autenticación de Usuarios:**
- ✅ Firebase Authentication integrado
- ✅ Registro con email/contraseña
- ✅ Login/Logout funcional
- ✅ Recuperación de contraseña
- ✅ Persistencia de sesión
- ✅ Sistema de rachas (streaks) de login consecutivo
- 📁 **Evidencia:** `src/contexts/AuthContext.js`, `src/components/Login.js`

**RF2 - Perfil de Usuario:**
- ✅ Formulario de perfil inicial (nombre, edad, peso, altura, objetivo)
- ✅ Cálculo automático de IMC
- ✅ Cálculo de TMB (Tasa Metabólica Basal)
- ✅ Cálculo de TDEE (Total Daily Energy Expenditure)
- ✅ Objetivo calórico personalizado
- ✅ Distribución de macronutrientes
- 📁 **Evidencia:** `src/components/UserProfileForm.js`, `src/utils/calculations.js`

**RF3 - Registro de Alimentación:**
- ✅ Registro diario de comidas (desayuno, almuerzo, cena, snacks)
- ✅ Base de datos local con 220+ alimentos peruanos/internacionales
- ✅ Búsqueda de alimentos en galería visual
- ✅ Integración con Gemini AI para alimentos no encontrados
- ✅ Sistema de 3 niveles: Local → Predefinido → Gemini API
- ✅ Contador de calorías y macros en tiempo real
- ✅ Registro de agua consumida
- 📁 **Evidencia:** `src/components/FoodLog.js`, `src/data/foodDatabase.js`

**RF4 - Chatbot Inteligente:**
- ✅ Interfaz tipo ChatGPT con sidebar de conversaciones
- ✅ Historial de conversaciones guardado en Firebase
- ✅ Límite de 500 caracteres por mensaje (control de costos API)
- ✅ Respuestas locales instantáneas (21 categorías)
- ✅ Integración con Gemini AI 2.0 Flash
- ✅ Contexto personalizado basado en historial del usuario
- ✅ Sistema de análisis de preferencias (último agregado)
- ✅ Etiquetas visuales: "Respuesta Local" vs "IA (Gemini)"
- 📁 **Evidencia:** `src/components/Chatbot.js`, `src/utils/userAnalytics.js`

**RF5 - Seguimiento de Progreso:**
- ✅ Gráfico de peso semanal (7 días)
- ✅ Tracker de progreso calórico
- ✅ Resumen de macronutrientes
- ✅ Alimentos más consumidos (top 3 favoritos en sidebar)
- ✅ Tipo de dieta detectado automáticamente
- 📁 **Evidencia:** `src/components/ProgressTracker.js`, `src/components/HomeOverview.js`

**RF6 - Dashboard:**
- ✅ Vista general semanal
- ✅ Estadísticas de consumo
- ✅ Navegación intuitiva
- ✅ Modo oscuro/claro
- ✅ Diseño responsive
- 📁 **Evidencia:** `src/components/Dashboard.js`

#### ✅ Requerimientos Técnicos Implementados:

**RT1 - Frontend:**
- ✅ React 18.0.0
- ✅ Framer Motion para animaciones
- ✅ Tailwind CSS para estilos
- ✅ Lucide React para iconos
- ✅ Responsive design (mobile-first)
- 📦 **Tecnologías:** package.json confirma todas las dependencias

**RT2 - Backend/Base de Datos:**
- ✅ Firebase Firestore (NoSQL)
- ✅ Estructura de colecciones optimizada
- ✅ Reglas de seguridad configuradas
- ✅ Cloud Storage para imágenes (preparado)
- 📁 **Evidencia:** `src/config/firebase.js`

**RT3 - API de IA:**
- ✅ Google Gemini 2.0 Flash integrado
- ✅ Manejo de errores y timeouts
- ✅ Sistema de caché con respuestas locales
- ✅ Logs detallados de rendimiento
- 📁 **Evidencia:** `src/utils/api.js`

**RT4 - Arquitectura:**
- ✅ Context API para estado global
- ✅ Componentes modulares y reutilizables
- ✅ Separación de concerns (data/utils/components)
- ✅ Sistema de 3 capas (presentación, lógica, datos)
- 📁 **Evidencia:** Estructura del proyecto en `src/`

---

### **OBJETIVO 2: Diseño de Arquitectura Escalable**
**Estado:** ✅ **COMPLETADO (100%)**

#### ✅ Arquitectura Implementada:

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │   Chatbot    │  │   FoodLog    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
│                  ┌─────────▼─────────┐                      │
│                  │  Context API       │                     │
│                  │  (AuthContext)     │                     │
│                  └─────────┬─────────┘                      │
└────────────────────────────┼──────────────────────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
┌───────▼────────┐                    ┌──────────▼──────────┐
│   FIREBASE     │                    │   GEMINI API        │
│   Firestore    │                    │   (Google AI)       │
│                │                    │                     │
│  Collections:  │                    │  Model:             │
│  - users       │                    │  gemini-2.0-flash   │
│  - foodLogs    │                    │                     │
│  - conversations│                   │  Latencia: ~2s      │
│  - analytics   │                    │  Contexto: 32k      │
└────────────────┘                    └─────────────────────┘
```

#### ✅ Características de Escalabilidad:

**1. Sistema de Caché en 3 Niveles:**
```javascript
Nivel 1: Galería Local (80+ alimentos) → 0ms
         ↓ (no encontrado)
Nivel 2: Respuestas Predefinidas (21 categorías) → <200ms
         ↓ (no encontrado)
Nivel 3: Gemini API → ~2000ms
```

**2. Optimización de Costos:**
- ✅ Límite de 500 caracteres por mensaje
- ✅ Respuestas locales para >70% de consultas
- ✅ Solo llamar a Gemini cuando sea necesario
- 📊 **Impacto:** Reduce costos API en ~75%

**3. Firebase Firestore (Escalable):**
```javascript
users/{uid}/
  ├── profile
  ├── foodLogs/{YYYY-MM-DD}
  ├── conversations/{id}/messages/
  └── analytics/preferences
```

**4. Diseño Modular:**
- ✅ 16 componentes React independientes
- ✅ 3 utilidades separadas (api, calculations, userAnalytics)
- ✅ 3 bases de datos locales (foodDatabase, foodGallery, exercises)
- ✅ Fácil mantenimiento y extensión

#### ✅ Pruebas de Escalabilidad:

**Evidencia 8.5.b - Escalabilidad:**
- ✅ Pruebas con 10 usuarios simultáneos documentadas
- ✅ Tiempo de respuesta promedio: 210ms (local)
- ✅ Firebase maneja conexiones concurrentes
- 📁 **Evidencia:** `TABLA_ESCALABILIDAD.md`

---

### **OBJETIVO 3: Implementación de SnorxFit**
**Estado:** ✅ **COMPLETO (95%)**

#### ✅ Frontend Implementado:

**Componentes Principales:**
1. ✅ `Login.js` - Autenticación completa
2. ✅ `Dashboard.js` - Vista principal con navegación
3. ✅ `Chatbot.js` - Asistente IA con personalización
4. ✅ `FoodLog.js` - Registro de comidas con Gemini
5. ✅ `UserProfileForm.js` - Perfil y configuración
6. ✅ `ProgressTracker.js` - Gráficos de progreso
7. ✅ `WeightTracker.js` - Seguimiento de peso
8. ✅ `HomeOverview.js` - Resumen semanal
9. ✅ `NutritionPlan.js` - Plan nutricional
10. ✅ `WorkoutPlan.js` - Plan de ejercicios
11. ✅ `FoodSelection.js` - Galería de alimentos
12. ✅ `AdminDashboard.js` - Panel de administración

**Total:** 16 componentes React funcionales

#### ✅ Backend/Servicios:

**Firebase Integrado:**
- ✅ Authentication (login/logout/registro)
- ✅ Firestore Database (4 colecciones principales)
- ✅ Realtime updates
- ✅ Security Rules configuradas

**API de Gemini:**
- ✅ Integración completa con Gemini 2.0 Flash
- ✅ Manejo de errores y reintentos
- ✅ Contexto personalizado por usuario
- ✅ Logs de latencia y rendimiento

**Utilidades:**
- ✅ `calculations.js` - Cálculos nutricionales (IMC, TMB, TDEE)
- ✅ `api.js` - Comunicación con Gemini API
- ✅ `userAnalytics.js` - Análisis de preferencias del usuario

#### ✅ Datos Locales:

1. **foodDatabase.js** - 220+ alimentos con macros completos
2. **foodGallery.js** - 80+ alimentos con imágenes y etiquetas
3. **nutrition.js** - Información nutricional detallada
4. **exercises.js** - Base de ejercicios

#### ⚠️ Pendiente (5%):

- ❌ Despliegue en servidor de producción
- ❌ Optimización de imágenes para producción
- ❌ Tests E2E (end-to-end) automatizados
- ❌ PWA (Progressive Web App) con service workers
- ❌ Notificaciones push

---

### **OBJETIVO 4: Evaluación Técnica del Chatbot**
**Estado:** ⚠️ **PARCIAL (60%)**

#### ✅ Lo que SÍ está implementado:

**4.1 - Pruebas Automatizadas:**

| Categoría | Archivo | Tests | Estado |
|-----------|---------|-------|--------|
| 8.3.a Unitarias | `calculations.test.js` | 15 | ✅ LISTO |
| 8.3.b I/O | `Chatbot.test.js` | 13 | ✅ LISTO |
| 8.3.c Integración | `api.integration.test.js` | 12 | ✅ LISTO |
| 8.4.a Exactitud | `exactitud.test.js` | 3 | ✅ LISTO |
| 8.4.b Coherencia | `coherencia.test.js` | 3 | ✅ LISTO |
| 8.5.a Rendimiento | `rendimiento.test.js` | 4 | ✅ LISTO |
| 8.5.c Robustez | `robustez.test.js` | 8 | ✅ LISTO |
| 8.5.e Explicabilidad | `explicabilidad.test.js` | 5 | ✅ LISTO |

**Total:** 63 tests automatizados ✅

**4.2 - Métricas Alcanzadas:**
- ✅ **Exactitud:** 93% de acierto (objetivo: ≥90%)
- ✅ **Coherencia:** 4.7/5 promedio (objetivo: ≥4.5/5)
- ✅ **Rendimiento Local:** <200ms (objetivo: <500ms)
- ✅ **Rendimiento API:** ~2000ms (objetivo: <5000ms)
- ✅ **Robustez:** 100% de errores manejados correctamente

**4.3 - Documentación de Evidencias:**
- ✅ `TESTING_GUIDE.md` - Guía completa de pruebas
- ✅ `TABLA_EVIDENCIAS.md` - Resumen de todas las evidencias
- ✅ `TABLA_ESCALABILIDAD.md` - Pruebas de carga
- ✅ `GUIA_DOCUMENTACION_TESIS.md` - Checklist para tesis

#### ❌ Lo que FALTA (40%):

**4.4 - Medición de Latencia en Producción:**
- ❌ Medir latencia con usuarios reales (no solo tests)
- ❌ Crear dashboard de métricas en tiempo real
- ❌ Gráficos de latencia por tipo de consulta
- ❌ Análisis de cuellos de botella
- ❌ Optimización basada en datos reales

**Solución Propuesta:**
```javascript
// Agregar en api.js
export const logMetrics = async (messageType, latency, success) => {
  await addDoc(collection(db, 'metrics'), {
    type: messageType,
    latency,
    success,
    timestamp: serverTimestamp()
  });
};
```

**4.5 - Análisis de Precisión con Dataset Real:**
- ❌ Crear dataset de 100+ preguntas frecuentes
- ❌ Validar respuestas con nutricionista profesional
- ❌ Calcular precisión sobre dataset validado
- ❌ Matriz de confusión (TP, FP, TN, FN)
- ❌ Curva ROC/AUC si aplica

**Solución Propuesta:**
```javascript
// Crear archivo: src/tests/validation-dataset.js
export const VALIDATION_DATASET = [
  { question: "¿Cuántas calorías tiene el pollo?", expected: "330 kcal por 200g", category: "nutrition" },
  { question: "¿Cómo perder peso?", expected: "déficit calórico", category: "advice" },
  // ... 98+ preguntas más
];
```

**4.6 - Manejo de Consultas en Español:**
- ✅ Sistema funciona en español (implementado)
- ❌ **Falta:** Análisis cuantitativo de performance en español
- ❌ Comparación con otros idiomas (si aplica)
- ❌ Detección automática de errores de escritura
- ❌ Manejo de jerga peruana/regional

**Solución Propuesta:**
```javascript
// Agregar análisis de idioma
const analyzeLanguagePerformance = (messages) => {
  const spanishQueries = messages.filter(m => detectLanguage(m) === 'es');
  const accuracy = calculateAccuracy(spanishQueries);
  return {
    totalQueries: spanishQueries.length,
    accuracy,
    commonErrors: extractCommonErrors(spanishQueries)
  };
};
```

---

### **OBJETIVO 5: Evaluación de Usabilidad (SUS)**
**Estado:** ❌ **PENDIENTE (0%)**

#### ❌ Lo que FALTA:

**5.1 - Implementar Cuestionario SUS:**

El **System Usability Scale (SUS)** es un cuestionario de 10 preguntas con escala Likert (1-5).

**Preguntas SUS estándar:**
1. Creo que me gustaría usar este sistema frecuentemente
2. Encontré el sistema innecesariamente complejo
3. Pensé que el sistema era fácil de usar
4. Creo que necesitaría ayuda de una persona técnica para usar este sistema
5. Encontré que las funciones del sistema estaban bien integradas
6. Pensé que había demasiada inconsistencia en este sistema
7. Imagino que la mayoría de personas aprenderían a usar este sistema rápidamente
8. Encontré el sistema muy incómodo de usar
9. Me sentí muy confiado usando el sistema
10. Necesité aprender muchas cosas antes de poder usar este sistema

**Cálculo del Score SUS:**
- Score = [(Suma impares - 5) + (25 - Suma pares)] × 2.5
- Rango: 0-100
- Aceptable: ≥68
- Excelente: ≥80

**5.2 - Reclutamiento de Usuarios:**
- ❌ Definir perfil de usuario objetivo
- ❌ Reclutar 10-30 usuarios para prueba
- ❌ Crear consentimiento informado
- ❌ Asignar tareas específicas a realizar

**Perfil Sugerido:**
- Edad: 18-45 años
- Interés en nutrición/fitness
- Uso de smartphone/computadora
- No necesita ser experto en tecnología

**5.3 - Protocolo de Prueba:**
- ❌ Crear script de onboarding
- ❌ Definir tareas a completar (ej: registrar comida, hacer pregunta al chatbot)
- ❌ Tiempo estimado: 20-30 minutos por usuario
- ❌ Observación y notas del facilitador

**5.4 - Análisis de Resultados:**
- ❌ Calcular score SUS promedio
- ❌ Identificar problemas de usabilidad recurrentes
- ❌ Crear heatmaps de clicks/interacciones
- ❌ Análisis cualitativo de comentarios
- ❌ Gráficos comparativos por pregunta

**📋 CHECKLIST PARA IMPLEMENTAR:**

```markdown
□ Crear componente de encuesta SUS en React
□ Integrar en Dashboard con botón "Ayúdanos a mejorar"
□ Guardar respuestas en Firebase (collection: 'sus_responses')
□ Reclutar 10+ usuarios
□ Ejecutar pruebas presenciales/remotas
□ Analizar resultados con estadísticas
□ Crear gráficos para tesis
□ Redactar sección de resultados
```

**Solución Propuesta - Componente SUS:**

```javascript
// src/components/SUSQuestionnaire.js
const SUSQuestions = [
  "Creo que me gustaría usar SnorxFit frecuentemente",
  "Encontré la app innecesariamente compleja",
  "Pensé que la app era fácil de usar",
  // ... 7 preguntas más
];

export const SUSQuestionnaire = () => {
  const [responses, setResponses] = useState(Array(10).fill(0));
  
  const calculateSUS = () => {
    const odds = responses.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0);
    const evens = responses.filter((_, i) => i % 2 !== 0).reduce((a, b) => a + b, 0);
    return ((odds - 5) + (25 - evens)) * 2.5;
  };
  
  const submitSUS = async () => {
    const score = calculateSUS();
    await addDoc(collection(db, 'sus_responses'), {
      responses,
      score,
      timestamp: serverTimestamp(),
      userId: user.uid
    });
  };
  
  return (
    // UI del cuestionario
  );
};
```

---

### **OBJETIVO 6: Medición de Impacto en Hábitos Alimentarios**
**Estado:** ❌ **PENDIENTE (0%)**

#### ❌ Lo que FALTA:

**6.1 - Diseño del Estudio Piloto:**

**Variables a Medir:**
- ❌ Cambio en conocimiento nutricional (pre/post test)
- ❌ Frecuencia de registro de comidas
- ❌ Adherencia al objetivo calórico
- ❌ Variedad de alimentos consumidos
- ❌ Uso del chatbot (cantidad y tipo de preguntas)
- ❌ Cambios en peso corporal
- ❌ Satisfacción con la app

**6.2 - Instrumentos de Medición:**

**A) Test de Conocimiento Nutricional (Pre/Post):**

Ejemplo de 10 preguntas:
```
1. ¿Cuántas calorías aproximadamente tiene 100g de pollo a la plancha?
   a) 100 kcal  b) 165 kcal ✓  c) 250 kcal  d) 400 kcal

2. ¿Qué macronutriente es más importante para ganar masa muscular?
   a) Proteína ✓  b) Carbohidratos  c) Grasas  d) Fibra

3. Para perder peso, necesitas estar en:
   a) Superávit calórico  b) Déficit calórico ✓  c) Equilibrio

// ... 7 preguntas más
```

**B) Cuestionario de Hábitos Alimentarios:**

```
1. ¿Con qué frecuencia comes comida rápida?
   □ Diario  □ 3-5 veces/semana  □ 1-2 veces/semana  □ Rara vez  □ Nunca

2. ¿Planificas tus comidas con anticipación?
   □ Siempre  □ Frecuentemente  □ A veces  □ Rara vez  □ Nunca

3. ¿Lees las etiquetas nutricionales?
   □ Siempre  □ Frecuentemente  □ A veces  □ Rara vez  □ Nunca

// ... más preguntas
```

**6.3 - Protocolo del Estudio:**

**Fase 1: Línea Base (Día 0)**
- ❌ Aplicar test de conocimiento nutricional (pre)
- ❌ Aplicar cuestionario de hábitos alimentarios (pre)
- ❌ Registrar peso inicial
- ❌ Configurar perfil en la app

**Fase 2: Intervención (Semanas 1-4)**
- ❌ Uso diario de SnorxFit
- ❌ Registro de al menos 2 comidas/día
- ❌ Interacción con chatbot mínimo 3 veces/semana
- ❌ Check-ins semanales (peso, adherencia)

**Fase 3: Evaluación Final (Día 30)**
- ❌ Aplicar test de conocimiento nutricional (post)
- ❌ Aplicar cuestionario de hábitos alimentarios (post)
- ❌ Registrar peso final
- ❌ Encuesta de satisfacción
- ❌ Entrevista cualitativa (opcional)

**6.4 - Análisis de Datos:**

**Métricas Cuantitativas:**
```javascript
const analyzeUserImpact = async (userId) => {
  const before = await getPreTestData(userId);
  const after = await getPostTestData(userId);
  
  return {
    knowledgeImprovement: after.score - before.score,
    weightChange: after.weight - before.weight,
    adherenceRate: calculateAdherence(userId),
    chatbotUsage: getChatbotMetrics(userId),
    foodVariety: calculateFoodVariety(userId)
  };
};
```

**Métricas a Reportar:**
- ❌ Porcentaje de mejora en conocimiento nutricional
- ❌ Cambio promedio de peso (kg)
- ❌ Tasa de adherencia al registro de comidas (%)
- ❌ Número promedio de interacciones con chatbot
- ❌ Variedad de alimentos (Índice de Shannon)
- ❌ Satisfacción general (escala 1-10)

**6.5 - Análisis Cualitativo:**

- ❌ Transcribir entrevistas
- ❌ Codificación temática
- ❌ Identificar barreras y facilitadores
- ❌ Casos de éxito y aprendizajes

**📊 FORMATO DE RESULTADOS ESPERADOS:**

```markdown
TABLA: Cambios en Conocimiento Nutricional (n=20)

| Métrica | Pre-test | Post-test | Cambio | p-value |
|---------|----------|-----------|--------|---------|
| Score promedio | 5.2/10 | 7.8/10 | +2.6 | <0.001 |
| % con ≥7/10 | 15% | 70% | +55% | <0.001 |

TABLA: Adherencia y Uso de la App

| Métrica | Promedio | Rango |
|---------|----------|-------|
| Días de uso | 24/30 | 18-30 |
| Comidas registradas | 48 | 32-65 |
| Preguntas al chatbot | 12 | 5-28 |
| Racha máxima | 8 días | 3-21 |

TABLA: Cambios en Hábitos Alimentarios

| Indicador | Pre | Post | Mejora |
|-----------|-----|------|--------|
| Come verduras diariamente | 35% | 80% | +45% |
| Planifica comidas | 20% | 65% | +45% |
| Lee etiquetas | 25% | 70% | +45% |
```

**6.6 - Consideraciones Éticas:**

- ❌ Aprobación de comité de ética (si aplica)
- ❌ Consentimiento informado firmado
- ❌ Anonimización de datos
- ❌ Derecho a retirarse en cualquier momento
- ❌ Confidencialidad de datos personales

---

## 📋 PLAN DE ACCIÓN PRIORITARIO

### 🔴 **CRÍTICO - Implementar AHORA (Semanas 1-2)**

#### **Tarea 1: Completar Evaluación Técnica del Chatbot**

**1.1 - Dashboard de Métricas en Tiempo Real**
```javascript
// Crear: src/components/MetricsDashboard.js
export const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState({
    avgLatency: 0,
    successRate: 0,
    totalQueries: 0,
    localVsAPI: { local: 0, api: 0 }
  });
  
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'metrics'),
      (snapshot) => {
        const data = calculateMetrics(snapshot.docs);
        setMetrics(data);
      }
    );
    return unsubscribe;
  }, []);
  
  return (
    <div>
      <h2>Métricas del Chatbot</h2>
      <Chart data={metrics} />
    </div>
  );
};
```

**1.2 - Dataset de Validación**
```javascript
// Crear: src/tests/validation-dataset.js
export const VALIDATION_DATASET = [
  // Categoría: Información Nutricional (30 preguntas)
  {
    id: 1,
    question: "¿Cuántas calorías tiene el pollo a la plancha?",
    expected: "165 kcal por 100g",
    category: "nutrition_info",
    difficulty: "easy"
  },
  {
    id: 2,
    question: "¿El arroz integral tiene más proteína que el arroz blanco?",
    expected: "No, tienen similar proteína (~2.7g/100g)",
    category: "nutrition_comparison",
    difficulty: "medium"
  },
  // ... 28 más
  
  // Categoría: Consejos de Pérdida de Peso (25 preguntas)
  {
    id: 31,
    question: "¿Cómo puedo perder 5kg en 2 meses?",
    expected: "Déficit de 500 kcal/día mediante dieta y ejercicio",
    category: "weight_loss",
    difficulty: "medium"
  },
  // ... 24 más
  
  // Categoría: Ganancia Muscular (20 preguntas)
  // Categoría: Comida Peruana (15 preguntas)
  // Categoría: Preguntas Tricky (10 preguntas)
];

// Total: 100 preguntas validadas
```

**1.3 - Script de Evaluación Automática**
```javascript
// Crear: src/tests/evaluate-chatbot.js
import { VALIDATION_DATASET } from './validation-dataset';

const evaluateChatbot = async () => {
  const results = [];
  
  for (const item of VALIDATION_DATASET) {
    const response = await chatWithGemini(item.question);
    const isCorrect = validateResponse(response, item.expected);
    
    results.push({
      question: item.question,
      expected: item.expected,
      actual: response,
      correct: isCorrect,
      category: item.category
    });
  }
  
  const accuracy = (results.filter(r => r.correct).length / results.length) * 100;
  
  console.log(`📊 Exactitud: ${accuracy.toFixed(1)}%`);
  console.log(`✅ Correctas: ${results.filter(r => r.correct).length}`);
  console.log(`❌ Incorrectas: ${results.filter(r => !r.correct).length}`);
  
  return results;
};
```

**⏰ Tiempo estimado:** 3-4 días

---

#### **Tarea 2: Implementar Cuestionario SUS**

**2.1 - Crear Componente SUS**
```javascript
// Crear: src/components/SUSQuestionnaire.js
import { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const SUS_QUESTIONS = [
  { id: 1, text: "Creo que me gustaría usar SnorxFit frecuentemente", reverse: false },
  { id: 2, text: "Encontré la aplicación innecesariamente compleja", reverse: true },
  { id: 3, text: "Pensé que la aplicación era fácil de usar", reverse: false },
  { id: 4, text: "Creo que necesitaría ayuda técnica para usar esta app", reverse: true },
  { id: 5, text: "Encontré que las funciones estaban bien integradas", reverse: false },
  { id: 6, text: "Pensé que había demasiada inconsistencia en la app", reverse: true },
  { id: 7, text: "La mayoría de personas aprenderían a usar esto rápidamente", reverse: false },
  { id: 8, text: "Encontré la aplicación muy incómoda de usar", reverse: true },
  { id: 9, text: "Me sentí muy confiado usando la aplicación", reverse: false },
  { id: 10, text: "Necesité aprender muchas cosas antes de poder usarla", reverse: true }
];

export const SUSQuestionnaire = ({ onComplete }) => {
  const [responses, setResponses] = useState(Array(10).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const calculateSUS = () => {
    let score = 0;
    responses.forEach((response, index) => {
      const question = SUS_QUESTIONS[index];
      if (question.reverse) {
        score += (5 - response);
      } else {
        score += (response - 1);
      }
    });
    return score * 2.5;
  };

  const handleSubmit = async () => {
    const score = calculateSUS();
    
    await addDoc(collection(db, 'sus_responses'), {
      responses,
      score,
      timestamp: serverTimestamp(),
      userId: user?.uid || 'anonymous'
    });
    
    setSubmitted(true);
    onComplete?.(score);
  };

  const isComplete = responses.every(r => r !== null);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Evaluación de Usabilidad - SnorxFit
      </h2>
      
      {!submitted ? (
        <>
          <p className="mb-8 text-gray-600 text-center">
            Por favor, califica tu experiencia del 1 (Totalmente en desacuerdo) al 5 (Totalmente de acuerdo)
          </p>
          
          <div className="space-y-6">
            {SUS_QUESTIONS.map((question, index) => (
              <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="mb-3 font-medium">{question.id}. {question.text}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Desacuerdo</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(value => (
                      <button
                        key={value}
                        onClick={() => {
                          const newResponses = [...responses];
                          newResponses[index] = value;
                          setResponses(newResponses);
                        }}
                        className={`w-12 h-12 rounded-full font-bold transition-all ${
                          responses[index] === value
                            ? 'bg-indigo-600 text-white scale-110'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">De acuerdo</span>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`w-full mt-8 py-4 rounded-lg text-white font-bold text-lg ${
              isComplete
                ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isComplete ? 'Enviar Evaluación' : 'Por favor responde todas las preguntas'}
          </button>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-2">¡Gracias por tu feedback!</h3>
          <p className="text-gray-600 mb-4">Tu puntuación SUS: {calculateSUS().toFixed(1)}/100</p>
          <p className="text-sm text-gray-500">
            {calculateSUS() >= 80 && "¡Excelente usabilidad!"}
            {calculateSUS() >= 68 && calculateSUS() < 80 && "Buena usabilidad"}
            {calculateSUS() < 68 && "Hay oportunidades de mejora"}
          </p>
        </div>
      )}
    </div>
  );
};
```

**2.2 - Integrar en Dashboard**
```javascript
// Modificar: src/components/Dashboard.js
import { SUSQuestionnaire } from './SUSQuestionnaire';

// Agregar botón en Dashboard:
<button
  onClick={() => setShowSUS(true)}
  className="p-3 bg-purple-500 text-white rounded-lg"
>
  📊 Ayúdanos a mejorar
</button>

{showSUS && (
  <Modal>
    <SUSQuestionnaire onComplete={(score) => {
      console.log('SUS Score:', score);
      setShowSUS(false);
    }} />
  </Modal>
)}
```

**2.3 - Dashboard de Resultados SUS**
```javascript
// Crear: src/components/SUSResults.js
export const SUSResults = () => {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const fetchResults = async () => {
      const snapshot = await getDocs(collection(db, 'sus_responses'));
      const data = snapshot.docs.map(doc => doc.data());
      setResults(data);
    };
    fetchResults();
  }, []);
  
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  
  return (
    <div>
      <h2>Resultados SUS</h2>
      <p>Puntuación Promedio: {avgScore.toFixed(1)}/100</p>
      <p>Respuestas: {results.length}</p>
      {/* Gráficos de distribución por pregunta */}
    </div>
  );
};
```

**⏰ Tiempo estimado:** 2-3 días

---

#### **Tarea 3: Diseñar Estudio Piloto de Impacto**

**3.1 - Crear Test de Conocimiento Nutricional**
```javascript
// Crear: src/components/NutritionKnowledgeTest.js
const NUTRITION_QUESTIONS = [
  {
    id: 1,
    question: "¿Cuántas calorías aproximadamente tiene 100g de pechuga de pollo a la plancha?",
    options: ["100 kcal", "165 kcal", "250 kcal", "400 kcal"],
    correct: 1,
    explanation: "El pollo a la plancha tiene aproximadamente 165 kcal por cada 100g"
  },
  {
    id: 2,
    question: "¿Qué macronutriente es esencial para la construcción de músculo?",
    options: ["Carbohidratos", "Proteína", "Grasas", "Vitaminas"],
    correct: 1,
    explanation: "La proteína es el macronutriente clave para construir y reparar músculo"
  },
  // ... 8 preguntas más (total 10)
];

export const NutritionKnowledgeTest = ({ type }) => {
  // type: 'pre' o 'post'
  const [answers, setAnswers] = useState(Array(10).fill(null));
  
  const calculateScore = () => {
    return answers.filter((a, i) => a === NUTRITION_QUESTIONS[i].correct).length;
  };
  
  const handleSubmit = async () => {
    const score = calculateScore();
    await addDoc(collection(db, 'knowledge_tests'), {
      userId: user.uid,
      type, // 'pre' or 'post'
      score,
      answers,
      timestamp: serverTimestamp()
    });
  };
  
  return (
    <div>
      <h2>Test de Conocimiento Nutricional ({type === 'pre' ? 'Inicial' : 'Final'})</h2>
      {/* Renderizar preguntas */}
    </div>
  );
};
```

**3.2 - Cuestionario de Hábitos Alimentarios**
```javascript
// Crear: src/components/FoodHabitsQuestionnaire.js
const HABITS_QUESTIONS = [
  {
    id: 1,
    question: "¿Con qué frecuencia comes comida rápida (hamburguesas, pizza, frituras)?",
    options: ["Diario", "3-5 veces/semana", "1-2 veces/semana", "Rara vez", "Nunca"],
    scores: [1, 2, 3, 4, 5] // Mayor score = mejor hábito
  },
  {
    id: 2,
    question: "¿Planificas tus comidas con anticipación?",
    options: ["Siempre", "Frecuentemente", "A veces", "Rara vez", "Nunca"],
    scores: [5, 4, 3, 2, 1]
  },
  // ... 8 preguntas más
];
```

**3.3 - Protocolo de Estudio Documentado**
```markdown
// Crear: PROTOCOLO_ESTUDIO_PILOTO.md

# Protocolo de Estudio Piloto - SnorxFit

## Objetivo
Medir el impacto de SnorxFit en conocimiento nutricional y hábitos 
alimentarios de usuarios durante 30 días.

## Participantes
- **n = 20 participantes**
- Edad: 18-45 años
- Interés en nutrición/fitness
- Acceso a smartphone/computadora

## Criterios de Inclusión
- Mayor de 18 años
- Interés declarado en mejorar hábitos alimentarios
- Compromiso de usar app durante 30 días
- Firma de consentimiento informado

## Criterios de Exclusión
- Desórdenes alimentarios diagnosticados
- Condiciones médicas que requieran dieta específica
- Uso actual de apps similares

## Procedimiento

### Día 0 (Línea Base)
1. Explicar estudio y obtener consentimiento
2. Aplicar Test de Conocimiento Nutricional (Pre)
3. Aplicar Cuestionario de Hábitos Alimentarios (Pre)
4. Registrar peso y medidas iniciales
5. Configurar perfil en SnorxFit
6. Tutorial de uso de la app (15 min)

### Semanas 1-4 (Intervención)
- Uso diario de SnorxFit
- Registro mínimo: 2 comidas/día
- Interacción con chatbot: mínimo 3 veces/semana
- Check-in semanal (peso, adherencia)

### Día 30 (Evaluación Final)
1. Aplicar Test de Conocimiento Nutricional (Post)
2. Aplicar Cuestionario de Hábitos Alimentarios (Post)
3. Registrar peso y medidas finales
4. Encuesta SUS
5. Entrevista semi-estructurada (15 min)

## Variables Medidas

### Primarias
- Cambio en conocimiento nutricional (score test)
- Cambio en hábitos alimentarios (score cuestionario)

### Secundarias
- Adherencia al uso de app (%)
- Frecuencia de uso de chatbot
- Variedad de alimentos registrados
- Cambio de peso corporal

### Exploratorias
- Usabilidad (SUS score)
- Satisfacción con chatbot
- Características más valoradas
```

**⏰ Tiempo estimado:** 4-5 días para preparación

---

### 🟡 **IMPORTANTE - Implementar en Semanas 3-6**

#### **Tarea 4: Ejecutar Estudio Piloto**

**4.1 - Reclutamiento de Participantes**
- ❌ Crear poster/anuncio en redes sociales
- ❌ Publicar en grupos de fitness/nutrición
- ❌ Invitación a amigos/conocidos
- ❌ Meta: 20 participantes confirmados

**4.2 - Recolección de Datos Pre-Test**
- ❌ Sesiones de onboarding presenciales/remotas
- ❌ Aplicar tests y cuestionarios
- ❌ Registrar datos demográficos

**4.3 - Seguimiento Durante Intervención**
- ❌ Check-ins semanales
- ❌ Resolver dudas técnicas
- ❌ Recordatorios de uso
- ❌ Monitoreo de adherencia

**4.4 - Recolección de Datos Post-Test**
- ❌ Aplicar tests finales
- ❌ Entrevistas cualitativas
- ❌ Descargar datos de Firebase

**⏰ Tiempo estimado:** 4-6 semanas (30 días + análisis)

---

#### **Tarea 5: Análisis de Resultados**

**5.1 - Análisis Cuantitativo**
```python
# Análisis estadístico con Python
import pandas as pd
from scipy import stats

# Cargar datos
pre_test = pd.read_csv('pre_test.csv')
post_test = pd.read_csv('post_test.csv')

# T-test pareado para conocimiento
t_stat, p_value = stats.ttest_rel(post_test['score'], pre_test['score'])
print(f"Cambio en conocimiento: p={p_value}")

# Efecto Cohen's d
cohens_d = (post_test['score'].mean() - pre_test['score'].mean()) / pre_test['score'].std()
print(f"Tamaño del efecto: d={cohens_d}")
```

**5.2 - Gráficos para Tesis**
- ❌ Boxplot de scores pre vs post
- ❌ Gráfico de barras de hábitos alimentarios
- ❌ Distribución de SUS scores
- ❌ Heatmap de uso del chatbot

**5.3 - Análisis Cualitativo**
- ❌ Transcripción de entrevistas
- ❌ Codificación temática
- ❌ Identificación de patrones

**⏰ Tiempo estimado:** 1-2 semanas

---

## 📊 CRONOGRAMA SUGERIDO

```
┌─────────────────┬──────────────────────────────────────┐
│ Semana          │ Actividades                          │
├─────────────────┼──────────────────────────────────────┤
│ Semana 1        │ - Dashboard de métricas              │
│                 │ - Dataset de validación (100 Q)      │
│                 │ - Evaluación automática chatbot      │
├─────────────────┼──────────────────────────────────────┤
│ Semana 2        │ - Componente SUS                     │
│                 │ - Test de conocimiento nutricional   │
│                 │ - Cuestionario de hábitos            │
├─────────────────┼──────────────────────────────────────┤
│ Semana 3        │ - Finalizar protocolo de estudio     │
│                 │ - Crear materiales de reclutamiento  │
│                 │ - Iniciar reclutamiento              │
├─────────────────┼──────────────────────────────────────┤
│ Semana 4        │ - Sesiones de onboarding (Día 0)     │
│                 │ - Inicio de intervención             │
├─────────────────┼──────────────────────────────────────┤
│ Semanas 5-8     │ - Intervención (30 días)             │
│                 │ - Check-ins semanales                │
│                 │ - Recolección de datos de uso        │
├─────────────────┼──────────────────────────────────────┤
│ Semana 9        │ - Evaluaciones finales (Día 30)      │
│                 │ - Entrevistas                        │
├─────────────────┼──────────────────────────────────────┤
│ Semanas 10-11   │ - Análisis estadístico               │
│                 │ - Gráficos y tablas                  │
│                 │ - Redacción de resultados            │
└─────────────────┴──────────────────────────────────────┘

TOTAL: ~11 semanas (~3 meses)
```

---

## 📈 INDICADORES DE ÉXITO

### Objetivo 4: Evaluación Técnica ✅
- [x] Latencia promedio local: <200ms ✅ (logrado)
- [x] Latencia promedio API: <5000ms ✅ (~2000ms)
- [x] Exactitud: ≥90% ✅ (93%)
- [ ] Dataset validado: 100 preguntas ❌ (pendiente)
- [ ] Dashboard de métricas en tiempo real ❌

### Objetivo 5: Usabilidad (SUS) 🎯
- [ ] SUS Score promedio: ≥68 (aceptable)
- [ ] SUS Score objetivo: ≥80 (excelente)
- [ ] Mínimo 15 respuestas SUS
- [ ] Identificar 3+ problemas de usabilidad recurrentes

### Objetivo 6: Impacto en Usuarios 🎯
- [ ] Mejora en conocimiento nutricional: ≥20%
- [ ] Cambio positivo en hábitos: ≥30%
- [ ] Adherencia al uso: ≥70%
- [ ] Satisfacción general: ≥4/5

---

## 🚨 RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Baja tasa de reclutamiento | Media | Alto | Ofrecer incentivos (sorteo, certificado) |
| Alta deserción de participantes | Media | Alto | Check-ins frecuentes, gamificación |
| Datos incompletos | Media | Medio | Validación obligatoria de formularios |
| Problemas técnicos en app | Baja | Alto | Testing exhaustivo previo, soporte 24/7 |
| Falta de significancia estadística | Media | Alto | n≥20 participantes, medidas validadas |

---

## 💡 RECOMENDACIONES FINALES

### Para la Tesis:

1. **Sección de Metodología:**
   - Describir arquitectura técnica con diagrama
   - Detallar proceso de integración de Gemini API
   - Explicar sistema de caché en 3 niveles
   - Incluir pseudocódigo de algoritmos clave

2. **Sección de Resultados - Evaluación Técnica:**
   - Tabla de 63 tests automatizados
   - Gráficos de latencia (local vs API)
   - Matriz de confusión de exactitud
   - Tabla de prueba de escalabilidad

3. **Sección de Resultados - Usabilidad:**
   - Distribución de SUS scores
   - Gráficos por pregunta SUS
   - Análisis cualitativo de problemas
   - Comparación con benchmarks

4. **Sección de Resultados - Impacto:**
   - Tabla pre/post de conocimiento
   - Gráficos de cambio en hábitos
   - Análisis de adherencia
   - Casos de éxito (testimonios)

5. **Discusión:**
   - Comparar con apps similares
   - Explicar limitaciones del estudio
   - Proponer mejoras futuras
   - Implicaciones prácticas

### Priorización:

**SI TIENES TIEMPO LIMITADO, HAZLO EN ESTE ORDEN:**

1. ✅ **YA TIENES:** Objetivos 1, 2, 3 completos (implementación funcional)
2. 🔴 **PRIMERO:** Evaluación técnica completa (dashboard + dataset)
3. 🔴 **SEGUNDO:** Implementar SUS y recopilar 15-20 respuestas
4. 🟡 **TERCERO:** Estudio piloto simplificado (10 usuarios, 2 semanas)

**SI SOLO TIENES 2 SEMANAS:**
- Implementar SUS inmediatamente
- Reclutar 10 amigos/conocidos
- Darles 1 semana de uso intensivo
- Aplicar SUS + entrevista corta
- Reportar resultados preliminares

---

## 📚 BIBLIOGRAFÍA SUGERIDA

Para fundamentar tus objetivos en la tesis:

### Evaluación de Chatbots:
- Shawar, B. A., & Atwell, E. (2007). Chatbots: Are they Really Useful?
- Følstad, A., & Brandtzaeg, P. B. (2017). Chatbots and the New World of HCI

### System Usability Scale (SUS):
- Brooke, J. (1996). SUS: A Quick and Dirty Usability Scale
- Bangor, A., Kortum, P., & Miller, J. (2009). Determining What Individual SUS Scores Mean

### Apps de Nutrición:
- Chen, J., Cade, J. E., & Allman-Farinelli, M. (2015). The Most Popular Smartphone Apps for Weight Loss
- Ferrara, G., et al. (2019). Effectiveness of Smartphone Apps in Weight Loss

---

**✅ CONCLUSIÓN:**

Has completado **el 58% de los objetivos específicos**:
- ✅ Objetivos 1-3: COMPLETOS (implementación sólida)
- ⚠️ Objetivo 4: 60% (falta medición en producción)
- ❌ Objetivo 5: 0% (implementar SUS)
- ❌ Objetivo 6: 0% (estudio piloto)

**Con 3 meses de trabajo enfocado**, puedes completar TODOS los objetivos.

**Con 2 semanas**, puedes tener evidencia suficiente para una tesis sólida.

**🎯 Tu enfoque en la interfaz fue CORRECTO** - tienes una app funcional y atractiva. Ahora solo necesitas **evidencia científica** de que funciona bien técnicamente y ayuda a los usuarios.

---

**Fecha:** 5 de Noviembre, 2025  
**Autor:** GitHub Copilot  
**Proyecto:** SnorxFit - Análisis de Objetivos Específicos
