# 🔍 AUDITORÍA COMPLETA Y MIGRACIÓN A FIREBASE

## Estado Actual del Sistema

### ✅ Ya funcionando en Firebase:
1. **Autenticación** - Firebase Auth
   - Registro de usuarios
   - Login/Logout
   - Gestión de sesiones

2. **Perfiles de Usuario** - Firestore
   - Colección: `users/{uid}`
   - Campos: name, email, age, weight, height, goal, goalWeight, activityLevel, dailyCalories, dailyMacros
   - ✅ Guardado correcto
   - ✅ Carga automática en login
   - ✅ Validación y recálculo automático

### ❌ Pendiente de Migrar a Firebase:

#### 1. **FoodLog** (ALTA PRIORIDAD)
- **Ubicación actual**: localStorage `foodLog_YYYY-MM-DD`
- **Estructura actual**:
  ```json
  {
    "meals": {
      "breakfast": [{ id, name, calories, protein, carbs, fat }],
      "lunch": [...],
      "dinner": [...],
      "snacks": [...]
    },
    "water": 0
  }
  ```
- **Migración propuesta**:
  - Colección: `users/{uid}/foodLogs/{date}`
  - Documento por día con misma estructura
  - Sincronización bidireccional con localStorage (cache)

#### 2. **WeightTracker** (ALTA PRIORIDAD)
- **Ubicación actual**: localStorage `snorxfit_weights_{userId}`
- **Estructura actual**: Array de `[{ id, date, weight }]`
- **Migración propuesta**:
  - Colección: `users/{uid}/weights/{id}`
  - Documentos: `{ date, weight, createdAt }`
  - Consulta: últimos 30-60 días

#### 3. **Chatbot History** (MEDIA PRIORIDAD)
- **Ubicación actual**: localStorage `chatHistory_{userId}`
- **Estructura actual**: Array de `[{ id, text, sender, timestamp }]`
- **Migración propuesta**:
  - Colección: `users/{uid}/chatHistory/{id}`
  - Documentos: `{ message, sender, timestamp, createdAt }`
  - Límite: últimos 50 mensajes

#### 4. **WorkoutPlan Completado** (MEDIA PRIORIDAD)
- **Ubicación actual**: Estado local (no persiste)
- **Problema**: Al recargar página se pierde progreso
- **Migración propuesta**:
  - Colección: `users/{uid}/workouts/{date}`
  - Documentos: `{ exercises: [{ id, completed, completedAt, duration, calories }] }`

#### 5. **MoodDiary** (MEDIA PRIORIDAD)
- **Ubicación actual**: localStorage `snorxfit_moods_{userId}`
- **Estructura actual**: Array de moods
- **Migración propuesta**:
  - Colección: `users/{uid}/moods/{id}`
  - Documentos: `{ mood, note, date, createdAt }`

#### 6. **PhotoGallery** (BAJA PRIORIDAD)
- **Ubicación actual**: localStorage `snorxfit_photos_{userId}`
- **Estructura actual**: URLs base64 (muy pesado)
- **Migración propuesta**:
  - Firebase Storage: `progress-photos/{uid}/{timestamp}.jpg`
  - Metadata en Firestore: `users/{uid}/photos/{id}`
  - Documentos: `{ url, date, weight, notes, createdAt }`

#### 7. **RemindersManager** (BAJA PRIORIDAD)
- **Ubicación actual**: localStorage `snorxfit_reminders_{userId}`
- **Migración propuesta**:
  - Colección: `users/{uid}/reminders/{id}`
  - Documentos: `{ type, scheduledAt, message, completed, createdAt }`

#### 8. **NutritionPlan** (BAJA PRIORIDAD)
- **Ubicación actual**: localStorage `snorx_added_foods`, `snorx_consumed_meals`
- **Problema**: Datos temporales que se reinician diariamente
- **Solución**: Puede quedarse en localStorage (es cache temporal)

## Plan de Migración

### Fase 1: Datos Críticos (Esta Sesión)
1. ✅ FoodLog → Firebase Firestore
2. ✅ WeightTracker → Firebase Firestore
3. ✅ WorkoutPlan → Firebase Firestore

### Fase 2: Datos de Seguimiento
4. Chatbot History → Firebase Firestore
5. MoodDiary → Firebase Firestore

### Fase 3: Multimedia y Extras
6. PhotoGallery → Firebase Storage
7. RemindersManager → Firebase Firestore

## Estructura Firebase Completa

```
Firestore Database:
├── users (collection)
│   └── {uid} (document)
│       ├── email: string
│       ├── name: string
│       ├── age: number
│       ├── weight: number
│       ├── height: number
│       ├── goal: 'lose' | 'gain' | 'maintain'
│       ├── goalWeight: number
│       ├── activityLevel: string
│       ├── dailyCalories: number
│       ├── dailyMacros: { protein, carbs, fat }
│       ├── createdAt: timestamp
│       ├── updatedAt: timestamp
│       │
│       ├── foodLogs (subcollection) ⬅️ NUEVO
│       │   └── {YYYY-MM-DD} (document)
│       │       ├── meals: { breakfast, lunch, dinner, snacks }
│       │       ├── water: number
│       │       └── updatedAt: timestamp
│       │
│       ├── weights (subcollection) ⬅️ NUEVO
│       │   └── {id} (document)
│       │       ├── date: string (YYYY-MM-DD)
│       │       ├── weight: number
│       │       └── createdAt: timestamp
│       │
│       ├── workouts (subcollection) ⬅️ NUEVO
│       │   └── {YYYY-MM-DD} (document)
│       │       ├── exercises: [{ id, completed, completedAt }]
│       │       ├── totalDuration: number
│       │       ├── totalCalories: number
│       │       └── updatedAt: timestamp
│       │
│       ├── chatHistory (subcollection)
│       │   └── {id} (document)
│       │       ├── message: string
│       │       ├── sender: 'user' | 'bot'
│       │       ├── timestamp: timestamp
│       │       └── createdAt: timestamp
│       │
│       ├── moods (subcollection)
│       │   └── {id} (document)
│       │       ├── mood: string
│       │       ├── note: string
│       │       ├── date: string
│       │       └── createdAt: timestamp
│       │
│       ├── photos (subcollection)
│       │   └── {id} (document)
│       │       ├── url: string (Storage URL)
│       │       ├── date: string
│       │       ├── weight: number
│       │       ├── notes: string
│       │       └── createdAt: timestamp
│       │
│       └── reminders (subcollection)
│           └── {id} (document)
│               ├── type: string
│               ├── scheduledAt: timestamp
│               ├── message: string
│               ├── completed: boolean
│               └── createdAt: timestamp

Storage:
└── progress-photos/
    └── {uid}/
        └── {timestamp}.jpg
```

## Ventajas de la Migración

### ✅ Persistencia Real
- Datos NO se pierden al cambiar de dispositivo
- Historial completo siempre disponible
- Backup automático en la nube

### ✅ Sincronización Multi-dispositivo
- Accede desde PC, celular, tablet
- Datos siempre actualizados
- Un solo perfil, múltiples dispositivos

### ✅ Performance
- localStorage tiene límite de 5-10MB
- Firebase Firestore: Sin límites prácticos
- Consultas optimizadas (índices automáticos)

### ✅ Seguridad
- Reglas de seguridad de Firebase
- Solo el usuario puede ver sus datos
- Encriptación en tránsito y reposo

### ✅ Analytics y Admin
- AdminDashboard puede consultar datos reales
- Estadísticas precisas de uso
- No depende de localStorage de cada usuario

## Estrategia de Migración

### 1. Cache First (Offline-First)
```javascript
// Patrón a seguir:
async function loadData() {
  // 1. Cargar desde localStorage (instantáneo)
  const cached = localStorage.getItem('key');
  if (cached) setData(JSON.parse(cached));
  
  // 2. Cargar desde Firebase (actualizado)
  if (isOnline) {
    const snapshot = await getDoc(doc(db, 'path'));
    const fresh = snapshot.data();
    setData(fresh);
    localStorage.setItem('key', JSON.stringify(fresh));
  }
}

async function saveData(data) {
  // 1. Guardar en localStorage (instantáneo)
  localStorage.setItem('key', JSON.stringify(data));
  
  // 2. Guardar en Firebase (sincronización)
  if (isOnline) {
    await setDoc(doc(db, 'path'), data, { merge: true });
  }
}
```

### 2. Migración Gradual
- NO borrar localStorage inmediatamente
- Mantener como fallback por 1-2 semanas
- Script de migración para usuarios existentes

### 3. Validación
- Comparar datos localStorage vs Firebase
- Logs de errores de sincronización
- Rollback automático si falla Firebase

## Reglas de Seguridad Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcolecciones heredan permisos
      match /{subcollection}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Admins pueden leer todo (para AdminDashboard)
    match /{document=**} {
      allow read: if request.auth != null && 
                     request.auth.token.email in ['admin@gmail.com'];
    }
  }
}
```

## Próximos Pasos

1. ✅ Implementar FoodLog con Firebase
2. ✅ Implementar WeightTracker con Firebase
3. ✅ Implementar WorkoutPlan con Firebase
4. ⏳ Testear sincronización online/offline
5. ⏳ Script de migración de datos existentes
6. ⏳ Actualizar AdminDashboard para leer de Firestore
7. ⏳ Documentación de uso para desarrolladores
