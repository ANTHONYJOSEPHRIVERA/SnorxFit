import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Función para actualizar manualmente el perfil de un usuario
 * Usar cuando el perfil no se guardó correctamente
 */
export async function fixUserProfile(userId, profileData) {
  try {
    console.log('🔧 Arreglando perfil de usuario:', userId);
    console.log('📦 Datos a guardar:', profileData);
    
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Perfil actualizado correctamente en Firebase');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error actualizando perfil:', error);
    return { success: false, error: error.message };
  }
}

// Hacer disponible globalmente para debug
if (typeof window !== 'undefined') {
  window.fixUserProfile = fixUserProfile;
}
