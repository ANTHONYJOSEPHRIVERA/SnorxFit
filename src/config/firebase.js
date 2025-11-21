// Configuración de Firebase para FICTIA (SNORXFIT)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuración de Firebase - SNORXFIT
// Para Firebase JS SDK v7.20.0 y posterior, measurementId es opcional
const firebaseConfig = {
  apiKey: "AIzaSyBLCJetIaClCXrxwVfmamQA17OZUrgL3zM",
  authDomain: "snorxfit-72d86.firebaseapp.com",
  projectId: "snorxfit-72d86",
  storageBucket: "snorxfit-72d86.firebasestorage.app",
  messagingSenderId: "320403330921",
  appId: "1:320403330921:web:2a92334faf58468a9d8ff8",
  measurementId: "G-RSZEMDLTHQ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
