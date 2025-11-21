/**
 * SCRIPT DE EMERGENCIA - Ejecutar directamente en la consola del navegador
 * 
 * Copia TODO este código y pégalo en la consola (F12)
 */

(async function fixCaloriesNow() {
  try {
    console.log('🚀 Iniciando corrección de calorías...');
    
    // Paso 1: Limpiar foodLogs antiguos
    console.log('🧹 Limpiando registros de comida...');
    let cleaned = 0;
    for (let i = 0; i < 60; i++) {
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
    
    // Paso 2: Obtener usuario actual
    const { auth, db } = await import('./config/firebase');
    const { doc, getDoc, updateDoc } = await import('firebase/firestore');
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.error('❌ No hay usuario autenticado. Inicia sesión primero.');
      return;
    }
    
    console.log('👤 Usuario:', currentUser.email);
    
    // Paso 3: Obtener perfil
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.error('❌ No se encontró el perfil');
      return;
    }
    
    const profile = userDoc.data();
    console.log('📊 Perfil actual:', {
      nombre: profile.name,
      peso: profile.weight,
      altura: profile.height,
      edad: profile.age,
      objetivo: profile.goal,
      actividad: profile.activityLevel
    });
    
    // Paso 4: Validar datos
    if (!profile.weight || !profile.height || !profile.age) {
      console.error('❌ Perfil incompleto. Completa tu perfil primero.');
      return;
    }
    
    // Paso 5: Calcular BMR
    const { calculateBMR, calculateDailyCalories, calculateMacros } = await import('./utils/calculations');
    const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
    console.log('📈 BMR calculado:', bmr, 'kcal');
    
    // Paso 6: Calcular calorías según objetivo
    const dailyCalories = calculateDailyCalories(bmr, profile.activityLevel, profile.goal);
    console.log('🔥 Calorías diarias:', dailyCalories, 'kcal');
    
    // Paso 7: Calcular macros
    const macros = calculateMacros(dailyCalories, profile.weight, profile.goal);
    console.log('📊 Macros calculados:', macros);
    
    // Paso 8: Actualizar en Firebase
    await updateDoc(userDocRef, {
      dailyCalories: dailyCalories,
      dailyMacros: macros,
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Perfil actualizado en Firebase');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 VALORES GUARDADOS:');
    console.log(`   🔥 Calorías: ${dailyCalories} kcal`);
    console.log(`   💪 Proteína: ${macros.protein}g`);
    console.log(`   🍞 Carbohidratos: ${macros.carbs}g`);
    console.log(`   🥑 Grasas: ${macros.fat}g`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 ¡COMPLETADO! Recarga la página (F5)');
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Detalles:', error.message);
    console.log('');
    console.log('💡 Alternativa: Ve a Settings y cambia tu peso (ejemplo: 65.4 a 65.5) y guarda.');
  }
})();
