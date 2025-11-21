// Servicio de autenticación con Firebase
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

/**
 * Registrar nuevo usuario
 * @param {string} email 
 * @param {string} password 
 * @param {object} userData - Datos adicionales del usuario (nombre, edad, peso, etc.)
 * @returns {Promise<object>} Usuario creado
 */
export const registerUser = async (email, password, userData = {}) => {
  try {
    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar perfil con el nombre
    if (userData.name) {
      await updateProfile(user, {
        displayName: userData.name
      });
    }

    // Crear documento de usuario en Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userProfile = {
      uid: user.uid,
      email: user.email,
      name: userData.name || '',
      age: userData.age || null,
      gender: userData.gender || '',
      weight: userData.weight || null,
      height: userData.height || null,
      goal: userData.goal || 'maintain', // Por defecto mantener peso
      activityLevel: userData.activityLevel || 'moderate',
      role: userData.role || 'user', // 'user' o 'admin'
      dailyCalories: null, // Se calculará cuando complete el perfil
      dailyMacros: null,   // Se calculará cuando complete el perfil
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(userDocRef, userProfile);

    return {
      user,
      profile: userProfile
    };
  } catch (error) {
    console.error('Error en registro:', error);
    throw handleAuthError(error);
  }
};

/**
 * Iniciar sesión
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} Usuario autenticado
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener perfil del usuario desde Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    let profileData;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Inicio del día actual

    if (userDoc.exists()) {
      profileData = userDoc.data();
      
      // Calcular racha (streak)
      let currentStreak = profileData.currentStreak || 0;
      let longestStreak = profileData.longestStreak || 0;
      let lastLoginDate = profileData.lastLoginDate ? new Date(profileData.lastLoginDate) : null;
      
      // 🔧 FIX: Si currentStreak es 0 pero hay lastLoginDate, significa que hubo un error
      // Debemos establecerlo en 1 al menos
      if (currentStreak === 0 && lastLoginDate) {
        console.log('🔧 Corrigiendo racha en 0, estableciendo en 1');
        currentStreak = 1;
      }
      
      if (lastLoginDate) {
        lastLoginDate.setHours(0, 0, 0, 0); // Normalizar a inicio del día
        const diffTime = today.getTime() - lastLoginDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          // Mismo día, no incrementar racha
          // PERO si currentStreak es 0, establecer en 1
          if (currentStreak === 0) {
            currentStreak = 1;
            console.log('🔧 Racha estaba en 0, corrigiendo a 1 día');
          } else {
            console.log('📅 Ya iniciaste sesión hoy, racha actual:', currentStreak);
          }
        } else if (diffDays === 1) {
          // Día consecutivo, incrementar racha
          currentStreak += 1;
          console.log('🔥 ¡Racha incrementada!:', currentStreak, 'días');
        } else {
          // Se rompió la racha
          console.log('💔 Racha rota. Era de:', currentStreak, 'días. Comenzando nueva racha.');
          currentStreak = 1;
        }
      } else {
        // Primera vez que inicia sesión O no tiene lastLoginDate
        currentStreak = currentStreak === 0 ? 1 : currentStreak;
        console.log('🎉 Racha iniciada:', currentStreak, 'día(s)');
      }
      
      // Actualizar récord si es necesario
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        console.log('🏆 ¡Nuevo récord de racha!:', longestStreak, 'días');
      }
      
      // Actualizar último acceso y racha
      await updateDoc(userDocRef, {
        lastLogin: new Date().toISOString(),
        lastLoginTimestamp: serverTimestamp(),
        lastLoginDate: today.toISOString().split('T')[0], // Solo fecha YYYY-MM-DD
        currentStreak: currentStreak,
        longestStreak: longestStreak
      });
      
      // Actualizar profileData local
      profileData.currentStreak = currentStreak;
      profileData.longestStreak = longestStreak;
      
      console.log('✅ Último acceso actualizado:', user.email);
      console.log('📊 Racha actual:', currentStreak, 'días | Récord:', longestStreak, 'días');
    } else {
      // Si no existe perfil, crear uno básico
      profileData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        lastLoginTimestamp: serverTimestamp(),
        lastLoginDate: today.toISOString().split('T')[0],
        currentStreak: 1,
        longestStreak: 1
      };
      await setDoc(userDocRef, profileData);
      console.log('✅ Perfil creado para:', user.email);
      console.log('🎉 Primera racha: 1 día');
    }

    // Registrar historial de inicio de sesión
    try {
      const loginHistoryRef = collection(db, 'users', user.uid, 'loginHistory');
      await addDoc(loginHistoryRef, {
        timestamp: serverTimestamp(),
        date: new Date().toISOString(),
        email: user.email,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        streak: profileData.currentStreak // Guardar racha del momento
      });
      console.log('✅ Inicio de sesión registrado en historial');
    } catch (historyError) {
      console.error('⚠️ Error guardando historial (no crítico):', historyError);
    }

    return {
      user,
      profile: profileData
    };
  } catch (error) {
    console.error('Error en login:', error);
    throw handleAuthError(error);
  }
};

/**
 * Cerrar sesión
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error en logout:', error);
    throw handleAuthError(error);
  }
};

/**
 * Actualizar perfil de usuario
 * @param {string} userId 
 * @param {object} updates 
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    throw error;
  }
};

/**
 * Obtener perfil de usuario
 * @param {string} userId 
 * @returns {Promise<object>} Perfil del usuario
 */
export const getUserProfile = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('Perfil de usuario no encontrado');
    }
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    throw error;
  }
};

/**
 * Restablecer contraseña
 * @param {string} email 
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error enviando email de recuperación:', error);
    throw handleAuthError(error);
  }
};

/**
 * Observar cambios en el estado de autenticación
 * @param {function} callback - Función que se ejecuta cuando cambia el estado
 * @returns {function} Función para cancelar la suscripción
 */
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Obtener usuario actual
 * @returns {object|null} Usuario actual o null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Manejar errores de autenticación
 * @param {Error} error 
 * @returns {Error}
 */
const handleAuthError = (error) => {
  const errorMessages = {
    'auth/email-already-in-use': 'Este correo electrónico ya está registrado',
    'auth/invalid-email': 'Correo electrónico inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña es muy débil. Debe tener al menos 6 caracteres',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'No se encontró una cuenta con este correo',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
    'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
  };

  const message = errorMessages[error.code] || error.message || 'Error desconocido';
  return new Error(message);
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  getUserProfile,
  resetPassword,
  observeAuthState,
  getCurrentUser
};
