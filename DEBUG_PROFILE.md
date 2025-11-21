# 🐛 DEBUG: Problema con Persistencia de Perfil

## Problema
El perfil no persiste después de cerrar sesión. Al volver a iniciar, pide llenar el formulario de nuevo.

## Pasos para Debugging

### 1. Verificar qué se guarda en Firebase
Abre la consola del navegador (F12) y ejecuta:

```javascript
// Ver perfil actual en memoria
console.log('Perfil en memoria:', userProfile);

// Ver qué hay en Firebase
import { doc, getDoc } from 'firebase/firestore';
import { db } from './config/firebase';

const userId = 'TU_USER_ID_AQUI'; // Reemplaza con tu UID
const userDocRef = doc(db, 'users', userId);
const userDoc = await getDoc(userDocRef);
console.log('Perfil en Firebase:', userDoc.data());
```

### 2. Logs a Observar

#### Al llenar el formulario:
```
📝 UserProfileForm - Datos enviados: { name: '...', weight: 68, height: 175, age: 25, goal: 'lose', goalWeight: 61, ... }
🔍 Validación: { hasWeight: true, hasHeight: true, hasAge: true, hasGoal: true, hasGoalWeight: true }
💾 Guardando perfil en Firebase Firestore...
📦 Datos a guardar: { ... }
✅ Perfil guardado exitosamente en Firebase
```

#### Al iniciar sesión:
```
📊 Cargando perfil desde Firebase Firestore...
🔑 User ID: [uid]
✅ Perfil encontrado en Firebase: { nombre: '...', email: '...', uid: '...' }
🔍 Verificación de perfil: {
  weight: 68,
  height: 175,
  age: 25,
  goal: 'lose',
  goalWeight: 61,
  isProfileComplete: true
}
✅ Perfil completo, cargando dashboard...
```

### 3. Posibles Causas

#### Causa 1: `age` es 0 o null
- Verificar que `birthDate` se esté guardando
- Verificar que el cálculo de edad funcione

#### Causa 2: `weight` o `height` son strings en lugar de números
- Se agregó `parseFloat()` para convertir a números

#### Causa 3: Firebase no está guardando (problema de permisos)
- Verificar reglas de Firestore

#### Causa 4: Se está cargando perfil antiguo del registro
- El registro inicial crea un perfil con campos null
- El `merge: true` debe sobrescribirlos

### 4. Solución Temporal

Si nada funciona, ejecuta esto en la consola para forzar la actualización:

```javascript
// En la consola del navegador
const userId = firebase.auth().currentUser.uid;
const userDocRef = firebase.firestore().collection('users').doc(userId);

userDocRef.update({
  age: 25,
  weight: 68,
  height: 175,
  goal: 'lose',
  goalWeight: 61
}).then(() => {
  console.log('✅ Perfil actualizado manualmente');
  location.reload();
});
```

### 5. Verificación Final

Después de llenar el formulario:

1. Ir a Firebase Console
2. Firestore Database
3. Colección `users`
4. Buscar tu documento (con tu email)
5. Verificar que TODOS estos campos existan:
   - ✅ `weight` (número)
   - ✅ `height` (número)
   - ✅ `age` (número)
   - ✅ `goal` (string: 'lose', 'gain', 'maintain')
   - ✅ `goalWeight` (número)
   - ✅ `name` (string)
   - ✅ `email` (string)

Si alguno falta o es null → **ESE es el problema**
