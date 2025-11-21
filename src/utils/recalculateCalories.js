import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { calculateBMR, calculateDailyCalories, calculateMacros } from './calculations';

/**
 * Recalcular y actualizar calorías y macros de todos los usuarios
 * También limpia foodLogs antiguos
 */
export async function recalculateAllUserCalories(cleanFoodLogs = true) {
  try {
    console.log('🔄 Recalculando calorías y macros...');
    
    // Obtener usuario actual de Firebase Auth
    const auth = (await import('../config/firebase')).auth;
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error('❌ No hay usuario autenticado');
      return { success: false, error: 'No hay usuario autenticado' };
    }
    
    // Obtener perfil actual
    const { getDoc } = await import('firebase/firestore');
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.error('❌ No se encontró el perfil del usuario');
      return { success: false, error: 'Perfil no encontrado' };
    }
    
    const profile = userDoc.data();
    console.log('📊 Perfil actual:', profile);
    
    // Validar que tenga datos básicos
    if (!profile.weight || !profile.height || !profile.age) {
      console.error('❌ Perfil incompleto, falta peso/altura/edad');
      return { success: false, error: 'Perfil incompleto' };
    }
    
    // Calcular valores correctos
    const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
    const dailyCalories = calculateDailyCalories(bmr, profile.activityLevel, profile.goal);
    const macros = calculateMacros(dailyCalories, profile.weight, profile.goal);
    
    console.log('📈 Valores calculados:', {
      bmr,
      dailyCalories,
      macros,
      objetivo: profile.goal
    });
    
    // Actualizar en Firebase
    await updateDoc(userDocRef, {
      dailyCalories: dailyCalories,
      dailyMacros: macros,
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Perfil actualizado correctamente');
    console.log('📌 Nuevos valores guardados:');
    console.log(`   Calorías: ${dailyCalories} kcal`);
    console.log(`   Proteína: ${macros.protein}g`);
    console.log(`   Carbohidratos: ${macros.carbs}g`);
    console.log(`   Grasas: ${macros.fat}g`);
    
    // Limpiar foodLogs antiguos si se solicita
    if (cleanFoodLogs) {
      console.log('🧹 Limpiando registros de comida antiguos...');
      let cleaned = 0;
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const key = `foodLog_${dateStr}`;
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          cleaned++;
        }
      }
      console.log(`✅ ${cleaned} registros de comida limpiados`);
    }
    
    console.log('🎉 ¡Proceso completado! Recarga la página (F5) para ver los cambios.');
    
    return { 
      success: true, 
      data: { dailyCalories, macros } 
    };
    
  } catch (error) {
    console.error('❌ Error recalculando calorías:', error);
    return { success: false, error: error.message };
  }
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  window.recalculateCalories = recalculateAllUserCalories;
}

export default recalculateAllUserCalories;
