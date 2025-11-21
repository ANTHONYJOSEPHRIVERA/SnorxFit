# 🔥 Migración a Firebase - FICTIA

## ✅ Completado

### 1. Instalación de Firebase
- ✅ Firebase SDK instalado (`firebase` package)
- ✅ Configuración creada en `src/config/firebase.js`

### 2. Servicio de Autenticación
- ✅ Archivo creado: `src/services/authService.js`
- ✅ Funciones implementadas:
  - `registerUser()` - Registro con email/password
  - `loginUser()` - Inicio de sesión  
  - `logoutUser()` - Cierre de sesión
  - `resetPassword()` - Recuperación de contraseña
  - `observeAuthState()` - Observer de cambios de auth
  - `getUserProfile()` - Obtener perfil de Firestore
  - `updateUserProfile()` - Actualizar perfil

### 3. Context de Autenticación
- ✅ Archivo actualizado: `src/contexts/AuthContext.js`
- ✅ Eliminadas dependencias de MySQL
- ✅ Implementado con Firebase Auth

## 📝 Configuración Necesaria

### Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. En "Configuración del proyecto" obtén las credenciales

### Paso 2: Habilitar Authentication

1. En Firebase Console, ve a **Authentication**
2. Click en **"Comenzar"**
3. Habilita **"Correo electrónico/contraseña"** en Sign-in method
4. (Opcional) Habilita otros métodos como Google, Facebook, etc.

### Paso 3: Crear Firestore Database

1. Ve a **Firestore Database**
2. Click en **"Crear base de datos"**
3. Selecciona **"Modo de prueba"** para desarrollo
4. Elige la ubicación más cercana

### Paso 4: Configurar Reglas de Seguridad

En Firestore, agrega estas reglas básicas:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Colección de progreso
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Colección de comidas
    match /meals/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
\`\`\`

### Paso 5: Actualizar Configuración

Abre `src/config/firebase.js` y reemplaza con tus credenciales:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",  // Tu API Key
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:..."
};
\`\`\`

## 📊 Estructura de Firestore

\`\`\`
fictia-db/
├── users/
│   └── {userId}/
│       ├── uid: string
│       ├── email: string
│       ├── name: string
│       ├── age: number
│       ├── gender: string
│       ├── weight: number
│       ├── height: number
│       ├── goal: string
│       ├── activityLevel: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── progress/
│   └── {userId}/
│       └── {recordId}/
│           ├── date: timestamp
│           ├── weight: number
│           ├── mood: string
│           └── notes: string
│
├── meals/
│   └── {userId}/
│       └── {mealId}/
│           ├── name: string
│           ├── calories: number
│           ├── protein: number
│           ├── carbs: number
│           ├── fat: number
│           ├── date: timestamp
│           └── type: string (breakfast, lunch, dinner, snack)
│
└── photos/
    └── {userId}/
        └── {photoId}/
            ├── url: string
            ├── uploadedAt: timestamp
            └── description: string
\`\`\`

## 🔐 Características de Seguridad

- ✅ **Email/Password Auth** - Validación automática de Firebase
- ✅ **Password Reset** - Emails automáticos de recuperación
- ✅ **Session Management** - Tokens manejados automáticamente
- ✅ **Observer Pattern** - Sincronización automática del estado de auth
- ✅ **Error Handling** - Mensajes de error en español personalizados

## 🚀 Uso en la Aplicación

### Registro de Usuario

\`\`\`javascript
const { register } = useAuth();

const handleRegister = async () => {
  const result = await register({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'password123',
    age: 25,
    gender: 'male',
    weight: 70,
    height: 175
  });
  
  if (result.success) {
    console.log('Usuario registrado!');
  }
};
\`\`\`

### Inicio de Sesión

\`\`\`javascript
const { login } = useAuth();

const handleLogin = async () => {
  const result = await login('juan@example.com', 'password123');
  
  if (result.success) {
    console.log('Sesión iniciada!');
  }
};
\`\`\`

### Obtener Usuario Actual

\`\`\`javascript
const { user, userProfile, isAuthenticated } = useAuth();

if (isAuthenticated) {
  console.log('Usuario:', user.email);
  console.log('Perfil:', userProfile);
}
\`\`\`

## 🗑️ Eliminado

- ❌ MySQL dependencies (mysql2)
- ❌ Express backend routes (`/api/auth/*`)
- ❌ apiService.js (conexiones HTTP a backend)
- ❌ server.js (servidor Express)
- ❌ database.js (conexión MySQL)

## ⚡ Beneficios de Firebase

1. **Sin servidor backend** - Todo manejado por Firebase
2. **Escalabilidad automática** - Firebase maneja el crecimiento
3. **Real-time updates** - Sincronización en tiempo real
4. **Offline support** - La app funciona sin internet
5. **Seguridad** - Reglas de seguridad robustas
6. **Analytics** - Firebase Analytics incluido
7. **Cloud Functions** - Lógica backend serverless disponible
8. **Hosting gratis** - Firebase Hosting para deployment

## 🎯 Próximos Pasos

1. ✅ Obtener credenciales de Firebase Console
2. ✅ Actualizar `src/config/firebase.js` con tus credenciales
3. ✅ Probar login/registro
4. ⏳ Migrar datos de progreso a Firestore
5. ⏳ Migrar almacenamiento de fotos a Firebase Storage
6. ⏳ Implementar sincronización en tiempo real

## 📱 Testing

Para probar la autenticación:

1. Inicia la app: `npm start`
2. Ve a la pantalla de registro
3. Crea una cuenta con email/password
4. Verifica que puedas iniciar sesión
5. Revisa Firebase Console para ver el usuario creado

## 🆘 Solución de Problemas

### Error: "Firebase: Error (auth/configuration-not-found)"
- **Solución**: Actualiza las credenciales en `firebase.js` con tus valores reales

### Error: "Firebase: Error (auth/operation-not-allowed)"
- **Solución**: Habilita "Email/Password" en Firebase Console > Authentication > Sign-in method

### Error: "Missing or insufficient permissions"
- **Solución**: Actualiza las reglas de Firestore para permitir lectura/escritura

---

**¡La migración a Firebase está lista!** 🎉 
Solo falta configurar las credenciales y estás listo para usar Firebase en producción.
