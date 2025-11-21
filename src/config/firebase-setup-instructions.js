/**
 * 🔥 INSTRUCCIONES DE CONFIGURACIÓN DE FIREBASE
 * 
 * Este archivo contiene las credenciales de ejemplo.
 * Debes reemplazarlas con las credenciales reales de tu proyecto Firebase.
 * 
 * PASOS PARA OBTENER TUS CREDENCIALES:
 * 
 * 1. Ve a https://console.firebase.google.com/
 * 2. Crea un nuevo proyecto o selecciona uno existente
 * 3. Ve a "Configuración del proyecto" (ícono de engranaje)
 * 4. Scroll hasta "Tus apps" y selecciona "Web" (</>)
 * 5. Registra tu app con el nombre "FICTIA Web"
 * 6. Copia las credenciales que aparecen
 * 7. Pégalas en el archivo src/config/firebase.js
 * 
 * IMPORTANTE:
 * - NO compartas estas credenciales en repositorios públicos
 * - Agrega firebase.js a .gitignore si usas Git
 * - En producción, usa variables de entorno
 * 
 * Ejemplo de cómo se ve firebaseConfig:
 * 
 * const firebaseConfig = {
 *   apiKey: "AIzaSyD...tu-api-key-aqui",
 *   authDomain: "tu-proyecto.firebaseapp.com",
 *   projectId: "tu-proyecto-id",
 *   storageBucket: "tu-proyecto.appspot.com",
 *   messagingSenderId: "123456789",
 *   appId: "1:123456789:web:abc123def456"
 * };
 */

// ⚠️ ESTO ES SOLO UN EJEMPLO - NO FUNCIONARÁ HASTA QUE LO REEMPLACES

export const FIREBASE_SETUP_INSTRUCTIONS = {
  step1: {
    title: "Crear proyecto en Firebase Console",
    url: "https://console.firebase.google.com/",
    action: "Crea un nuevo proyecto llamado 'FICTIA' o usa uno existente"
  },
  step2: {
    title: "Habilitar Authentication",
    path: "Firebase Console > Build > Authentication > Sign-in method",
    action: "Habilita 'Correo electrónico/contraseña'"
  },
  step3: {
    title: "Crear Firestore Database",
    path: "Firebase Console > Build > Firestore Database",
    action: "Crear base de datos en modo de prueba"
  },
  step4: {
    title: "Habilitar Storage (opcional)",
    path: "Firebase Console > Build > Storage",
    action: "Crear bucket para almacenar fotos de progreso"
  },
  step5: {
    title: "Copiar credenciales",
    path: "Firebase Console > Configuración del proyecto > Tus apps",
    action: "Registrar app web y copiar firebaseConfig"
  },
  step6: {
    title: "Actualizar firebase.js",
    file: "src/config/firebase.js",
    action: "Reemplazar las credenciales de ejemplo con las reales"
  }
};

export const EXAMPLE_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD_EJEMPLO_REEMPLAZA_ESTO",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:EJEMPLO"
};

export const FIRESTORE_COLLECTIONS = {
  users: "Información de perfil del usuario",
  progress: "Registros de progreso (peso, medidas, etc.)",
  meals: "Historial de comidas y nutrición",
  workouts: "Entrenamientos completados",
  photos: "Metadatos de fotos de progreso (URLs de Storage)"
};

export const SECURITY_NOTES = {
  note1: "Nunca compartas tu apiKey en repositorios públicos",
  note2: "Configura reglas de seguridad en Firestore",
  note3: "Habilita App Check en producción",
  note4: "Usa variables de entorno en producción (.env.local)"
};

// Si ves este mensaje en consola, Firebase NO está configurado correctamente
if (EXAMPLE_FIREBASE_CONFIG.apiKey.includes("EJEMPLO")) {
  console.warn(`
🔥 FIREBASE NO CONFIGURADO 🔥

Por favor sigue estos pasos:

1. Ve a https://console.firebase.google.com/
2. Crea/selecciona tu proyecto
3. Obtén las credenciales de configuración
4. Actualiza src/config/firebase.js

Ver FIREBASE_MIGRATION.md para más detalles.
  `);
}

export default {
  FIREBASE_SETUP_INSTRUCTIONS,
  EXAMPLE_FIREBASE_CONFIG,
  FIRESTORE_COLLECTIONS,
  SECURITY_NOTES
};
