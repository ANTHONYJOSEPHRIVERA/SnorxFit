**9. Conclusiones y Plan de Soporte Técnico (ITIL) — SnorxFit**

**9.1 Conclusiones del Proyecto:**
- **Resumen:** La implementación de SnorxFit validó la viabilidad técnica de integrar un chatbot nutricional asistido por IA (Gemini) dentro de una aplicación móvil. El sistema híbrido (modelo principal + fallback local) garantiza continuidad de servicio y mejora la fiabilidad de la información nutricional durante fallos de red o inconsistencias del modelo.
- **Fortalezas detectadas:**
  - **Adaptabilidad:** el modelo maneja distintos tipos de consultas en lenguaje natural.
  - **Interacción:** experiencia conversacional fluida en la UI.
  - **Resiliencia:** el fallback local y la cola de sincronización evitan pérdida de datos.
- **Limitaciones:**
  - **Variabilidad en respuestas:** depende del prompt y del contexto.
  - **Dependencia de la red:** la mejor respuesta (Gemini) requiere conectividad y disponibilidad de la API.
  - **Necesidad de validación:** requiere control para validar valores numéricos devueltos por la IA.
- **Impacto y escalabilidad:** Arquitectura preparada para escalar (más módulos, ampliación de dataset) y para futuras funcionalidades: recomendaciones personalizadas, monitorización y análisis de patrones.

**9.2 Plan de Soporte Técnico (ITIL v4 aplicado a SnorxFit):**
- **Objetivo:** Garantizar continuidad operativa, calidad del servicio y mejora continua en la operación del chatbot y servicios asociados.

**9.2.1 Gestión de Incidentes**
- **Definición:** Restablecer la operación normal lo antes posible.
- **Incidentes frecuentes:** fallo de conexión con Gemini, respuestas con valores erróneos, errores UI, fallos de sincronización con Firestore.
- **Procedimiento:**
  - Registro automático desde la app (incluir trazas mínimas: uid, sessionId, timestamp, payload minimizado).
  - Clasificación (Crítico / Alto / Medio / Bajo) con tiempos objetivos de respuesta.
  - Diagnóstico inicial: revisar conectividad, logs, estado del fallback y cola local.
  - Acción inmediata: activar manualmente el fallback o reiniciar el proceso afectado.
  - Comunicación al usuario (notificación dentro de la app) y cierre/documentación en la herramienta de tickets.

**Runbook rápido (Incidente Crítico - API Gemini caida):**
- Confirmar error con `testConnectivity()` (script de diagnóstico incluido en la app).
- Forzar uso de fallback: configurar bandera `FORCE_LOCAL_FALLBACK = true` (solo temporal).
- Notificar equipo y crear ticket con prioridad CRÍTICA.
- Monitorear logs y reintentar llamadas de forma controlada.

**9.2.2 Gestión de Problemas**
- **Objetivo:** Identificar y eliminar causas raíz para evitar recurrencias.
- **Proceso:** RCA (Ishikawa, 5 Whys), análisis de logs y patrones en historial, pruebas de regresión y despliegue de correcciones.
- **Ejemplo de problema recurrente:** discrepancias IA vs base local → revisar parámetros de tolerancia y actualizar módulo comparador.

**9.2.3 Gestión del Cambio**
- **Tipos de cambio:** Estándar, Normal, Urgente.
- **Flujo:** solicitud → evaluación de impacto → aprobación del comité → pruebas en staging → despliegue controlado → verificación.
- **Req. obligatorio:** pruebas automatizadas (unit / integration) y rollback plan.

**9.2.4 Gestión de Activos y Configuración**
- **Elementos gestionados:** código fuente (Git), endpoints/API, dataset local, parámetros de Gemini, módulo fallback, infra backend.
- **CMDB:** registrar versión, hash de commit, fecha, responsable, notas de despliegue.

**9.2.5 Mantenimiento (Correctivo, Preventivo, Evolutivo)**
- **Correctivo:** arreglar fallos en producción y publicar hotfix siguiendo proceso de cambio urgente.
- **Preventivo:** revisiones periódicas de logs, actualización de dependencias, tests de fault-injection.
- **Evolutivo:** nuevas features (historial nutricional, recomendaciones IMC, análisis predictivo).

**9.3 Procedimiento de manejo de incidente (caso de ejemplo)**
- **9.3.1 Incidente:** IA responde 70 kcal para "manzana" mientras base local dice 52 kcal.
- **9.3.2 Análisis y Diagnóstico:** determinar origen (respuesta de Gemini), comparar con base local y revisar la regla de activación del fallback (tolerancia configurada demasiado amplia).
- **9.3.3 Acción Correctiva:** ajustar tolerancia a ±10 %, actualizar módulo validador, agregar tests unitarios y despliegue controlado.
- **9.3.4 Pruebas posteriores:** consultas aleatorias, simulación de fallo externo, revisión de logs 48 h, confirmación del usuario.

**9.4 KPIs y Métricas de Soporte**
- **MTTR:** Tiempo promedio de resolución de incidentes — Meta: < 4 horas.
- **MTBF:** Tiempo entre fallos críticos — Meta: > 30 días.
- **Satisfacción de usuario:** Encuestas post-incidente — Meta: ≥ 90%.
- **Resolución en primer nivel:** % incidentes resueltos sin escalar — Meta: ≥ 80%.
- **Precisión del chatbot:** Concordancia IA vs base local (muestra diaria) — Meta: ≥ 95%.
- **Activación del fallback:** % de respuestas que usan respaldo local — Meta: < 8%.
- **Tolerancia de discrepancia:** ±10% (defecto para validación entre IA y base local).
- **Latencia del modelo:** Tiempo promedio de respuesta — Meta: < 2.5 s.
- **Frecuencia de actualización dataset:** Reentrenamiento / actualización del dataset — Cada 90 días.

**9.5 Roles y Responsabilidades (sugeridos)**
- **Service Owner:** Responsable del servicio SnorxFit.
- **Incident Manager:** Coordina respuesta ante incidentes.
- **N1 Support:** Primer nivel de atención (soporte en app, reproducir incidentes, aplicar runbooks).
- **N2 / DevOps:** Investiga problemas técnicos, aplica fixes y despliegues.
- **Data Steward:** Responsable del dataset nutricional y validación de valores.

**9.6 Matriz de Prioridad (resumen)**
- **Crítico:** servicio caído o riesgo para usuario (respuesta peligrosa) — Respuesta: 15 min, MTTR objetivo: < 2 h.
- **Alto:** funcionalidades clave degradadas (IA no responde) — Respuesta: 30 min, MTTR objetivo: < 4 h.
- **Medio:** errores no críticos o degradación menor — Respuesta: 4 h, MTTR objetivo: < 24 h.
- **Bajo:** mejoras y bugs menores — Programado en ciclo de mantenimiento.

**9.7 Runbooks operativos (pasos rápidos)**
- **Activar fallback manualmente:**
  1. Acceder a la consola de administración (staging/producción).
  2. Establecer la bandera `FORCE_LOCAL_FALLBACK = true` en config (o feature flag).
  3. Notificar al equipo y crear ticket.
  4. Monitorizar logs hasta estabilizar.

- **Forzar sincronización de cola (cliente):**
  - Desde la app, en `Registro de Alimentos` pulsar `Sincronizar` o ejecutar en consola:

```javascript
// Ver cola
JSON.parse(localStorage.getItem('snorxfit_sync_queue') || '[]');
// Forzar drain (solo en entorno de desarrollo, con usuario autenticado)
window.drainQueue && window.drainQueue();
```

- **Probar conectividad con Gemini:** ejecutar `window.testApiConnection()` (disponible en entorno dev) y revisar latencia/respuesta.

**9.8 Validaciones y reglas de seguridad (Firestore)**
- **Regla mínima recomendada (permitir solo al propio usuario):**
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
- **Regla con validación de forma (ejemplo para `foodLogs`):**
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/foodLogs/{date} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create, update: if request.auth != null && request.auth.uid == userId
        && request.resource.data.keys().hasAll(['meals','water','updatedAt'])
        && request.resource.data.meals is map
        && request.resource.data.water is number;
    }
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
> Nota: publica estas reglas en Firestore → Reglas. No pegues reglas de Firestore en Realtime Database (formatos distintos).

**9.9 Acciones inmediatas recomendadas (prioridad alta)**
- Publicar la regla mínima en Firestore para eliminar `permission-denied` (si aún no está puesta).
- Corregir `storageBucket` en `src/config/firebase.js` a `snorxfit-72d86.appspot.com` (si se usa Storage).
- Ejecutar pruebas: `Probar escritura` (app) → `Sincronizar` → verificar Firestore.
- Añadir una tarea para implementar reintentos exponenciales en `drainQueue()`.

**Apéndice A — Plantilla de RCA (breve)**
1. Descripción del incidente.
2. Fecha/hora y usuario afectado.
3. Pasos para reproducir.
4. Evidencias (logs, capturas, entradas de cola).
5. Causa raíz (análisis 5 Whys / Ishikawa).
6. Acción correctiva implementada.
7. Acciones preventivas planificadas.
8. Responsable y fecha de cierre.

---

Documento generado por el equipo técnico de SnorxFit. Si quieres, lo guardo también como `docs/SECCION_9_ITIL.html` o lo agrego al README principal; dime y lo hago.
