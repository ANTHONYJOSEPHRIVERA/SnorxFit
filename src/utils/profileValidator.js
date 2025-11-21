// 🔧 SISTEMA DE VALIDACIÓN Y RECÁLCULO AUTOMÁTICO
// Este archivo se ejecuta al cargar la app y verifica/corrige perfiles

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { calculateBMR, calculateDailyCalories, calculateMacros } from './calculations';

/**
 * Valida que las calorías del perfil sean correctas
 * Si están mal, las recalcula automáticamente
 * @param {string} userId - UID del usuario
 * @returns {object} - { needsUpdate, profile, correctedProfile }
 */
export const validateAndFixUserProfile = async (userId) => {
  try {
    console.log('🔍 Validando perfil del usuario:', userId);
    
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.warn('⚠️ No existe perfil para este usuario');
      return { needsUpdate: true, profile: null };
    }
    
    const profile = userDoc.data();
    
    // Verificar que tenga los datos mínimos necesarios
    if (!profile.weight || !profile.height || !profile.age || !profile.gender) {
      console.warn('⚠️ Perfil incompleto - faltan datos básicos');
      return { needsUpdate: true, profile };
    }
    
    // Calcular valores CORRECTOS
    const bmrCorrecto = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
    const caloriasCorrecto = calculateDailyCalories(bmrCorrecto, profile.activityLevel, profile.goal);
    const macrosCorrecto = calculateMacros(caloriasCorrecto, profile.weight, profile.goal);
    
    const caloriaActual = profile.dailyCalories || 0;
    const diferencia = Math.abs(caloriasCorrecto - caloriaActual);
    
    // Si la diferencia es mayor a 100 kcal, necesita actualización
    if (diferencia > 100) {
      console.warn('⚠️ Calorías incorrectas detectadas');
      console.warn(`   Actual: ${caloriaActual} kcal`);
      console.warn(`   Correcto: ${caloriasCorrecto} kcal`);
      console.warn(`   Diferencia: ${diferencia} kcal`);
      
      // CORREGIR AUTOMÁTICAMENTE
      const correctedProfile = {
        ...profile,
        dailyCalories: caloriasCorrecto,
        dailyMacros: macrosCorrecto,
        updatedAt: new Date().toISOString(),
        autoRecalculatedAt: new Date().toISOString(),
        previousCalories: caloriaActual // Guardar el valor anterior por si acaso
      };
      
      await updateDoc(userDocRef, {
        dailyCalories: caloriasCorrecto,
        dailyMacros: macrosCorrecto,
        updatedAt: new Date().toISOString(),
        autoRecalculatedAt: new Date().toISOString(),
        previousCalories: caloriaActual
      });
      
      console.log('✅ Perfil corregido automáticamente');
      console.log(`   Nuevas calorías: ${caloriasCorrecto} kcal`);
      
      return { 
        needsUpdate: false, // Ya se corrigió
        wasCorrected: true,
        profile: correctedProfile,
        oldCalories: caloriaActual,
        newCalories: caloriasCorrecto
      };
    }
    
    console.log('✅ Perfil validado - calorías correctas');
    return { needsUpdate: false, profile };
    
  } catch (error) {
    console.error('❌ Error validando perfil:', error);
    return { needsUpdate: false, profile: null, error };
  }
};

/**
 * Fuerza a un usuario a reconfigurar su perfil
 * Borra sus calorías para que tenga que volver a llenar el formulario
 */
export const forceProfileReconfiguration = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await updateDoc(userDocRef, {
      dailyCalories: null,
      dailyMacros: null,
      needsProfileUpdate: true,
      profileInvalidatedAt: new Date().toISOString()
    });
    
    console.log('✅ Perfil invalidado - usuario debe reconfigurarlo');
    return true;
  } catch (error) {
    console.error('❌ Error invalidando perfil:', error);
    return false;
  }
};
