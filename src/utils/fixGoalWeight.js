/**
 * Script para corregir el goalWeight en Firebase
 * 
 * INSTRUCCIONES:
 * 1. Abre la consola del navegador (F12)
 * 2. Pega este código completo
 * 3. Ejecuta: fixGoalWeight()
 */

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Corregir goalWeight de todos los usuarios
 * Si goalWeight es > peso+30kg o < peso-30kg, lo recalcula
 */
export async function fixGoalWeight() {
  try {
    console.log('🔧 Corrigiendo metas de peso ilógicas...');
    
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    let fixed = 0;
    
    for (const userDoc of snapshot.docs) {
      const data = userDoc.data();
      const { weight, goalWeight, goal } = data;
      
      if (!weight) continue;
      
      // Validar si goalWeight es ilógico
      if (goalWeight && Math.abs(goalWeight - weight) > 30) {
        let newGoal;
        
        // Calcular meta RAZONABLE según objetivo
        if (goal === 'lose') {
          // Perder peso: 10% del peso actual (ej: 68kg → 61kg)
          newGoal = Math.round(weight * 0.90);
        } else if (goal === 'gain') {
          // Ganar músculo: 10% del peso actual (ej: 68kg → 75kg)
          newGoal = Math.round(weight * 1.10);
        } else {
          // Mantener peso actual
          newGoal = weight;
        }
        
        console.log(`❌ Usuario ${data.email}:`);
        console.log(`   Peso actual: ${weight} kg`);
        console.log(`   Meta INCORRECTA: ${goalWeight} kg (diferencia: ${Math.abs(goalWeight - weight)} kg)`);
        console.log(`   Objetivo: ${goal === 'lose' ? 'Perder peso' : goal === 'gain' ? 'Ganar músculo' : 'Mantener'}`);
        console.log(`   Meta CORREGIDA: ${newGoal} kg`);
        
        // Actualizar en Firebase
        await updateDoc(doc(db, 'users', userDoc.id), {
          goalWeight: newGoal,
          updatedAt: new Date().toISOString()
        });
        
        fixed++;
      }
    }
    
    if (fixed === 0) {
      console.log('✅ Todas las metas están correctas');
    } else {
      console.log(`✅ ${fixed} usuario(s) corregido(s)`);
      console.log('🔄 Por favor, cierra sesión y vuelve a entrar para ver los cambios');
    }
    
    return { success: true, fixed };
    
  } catch (error) {
    console.error('❌ Error:', error);
    return { success: false, error: error.message };
  }
}

// Hacer disponible globalmente en desarrollo
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  window.fixGoalWeight = fixGoalWeight;
  console.log('🔧 Script de corrección cargado. Ejecuta: fixGoalWeight()');
}
