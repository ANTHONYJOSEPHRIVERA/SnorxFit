// 🔍 SCRIPT DE DEBUG - Verificar Perfil del Usuario
// Pega este código en la CONSOLA del navegador (F12) cuando estés logueado

(async function debugUserProfile() {
  console.log('🔍 ===== INICIANDO DEBUG DE PERFIL =====');
  
  // Obtener usuario actual de Firebase Auth
  const auth = window.firebase?.auth?.();
  if (!auth) {
    console.error('❌ Firebase Auth no disponible');
    return;
  }
  
  const user = auth.currentUser;
  if (!user) {
    console.error('❌ No hay usuario logueado');
    return;
  }
  
  console.log('✅ Usuario logueado:', user.email);
  console.log('🆔 UID:', user.uid);
  
  // Obtener perfil de Firestore
  const db = window.firebase?.firestore?.();
  if (!db) {
    console.error('❌ Firestore no disponible');
    return;
  }
  
  try {
    const profileRef = db.collection('users').doc(user.uid);
    const profileDoc = await profileRef.get();
    
    if (!profileDoc.exists) {
      console.error('❌ No existe perfil en Firestore para este usuario');
      return;
    }
    
    const profile = profileDoc.data();
    
    console.log('\n📋 ===== DATOS DEL PERFIL =====');
    console.log('Nombre:', profile.name || '❌ FALTA');
    console.log('Email:', profile.email || '❌ FALTA');
    console.log('Edad:', profile.age || '❌ FALTA');
    console.log('Peso:', profile.weight || '❌ FALTA', 'kg');
    console.log('Altura:', profile.height || '❌ FALTA', 'cm');
    console.log('Género:', profile.gender || '❌ FALTA');
    console.log('IMC:', profile.imc || '❌ FALTA');
    console.log('Categoría IMC:', profile.imcCategory || '❌ FALTA');
    
    console.log('\n🎯 ===== OBJETIVO Y PLAN =====');
    console.log('Objetivo:', profile.goal || '❌ FALTA', 
      profile.goal === 'lose' ? '(Perder peso)' :
      profile.goal === 'gain' ? '(Ganar músculo)' :
      profile.goal === 'maintain' ? '(Mantener)' : ''
    );
    console.log('Nivel de actividad:', profile.activityLevel || '❌ FALTA',
      profile.activityLevel === 'sedentary' ? '(Sedentario)' :
      profile.activityLevel === 'light' ? '(Ligero)' :
      profile.activityLevel === 'moderate' ? '(Moderado)' :
      profile.activityLevel === 'active' ? '(Activo)' :
      profile.activityLevel === 'veryActive' ? '(Muy Activo)' : ''
    );
    console.log('Meta de peso:', profile.goalWeight || '❌ FALTA', 'kg');
    
    console.log('\n📊 ===== CALORÍAS Y MACROS =====');
    console.log('Calorías diarias:', profile.dailyCalories || profile.calorieGoal || '❌ FALTA', 'kcal');
    
    if (profile.dailyMacros) {
      console.log('Macros (dailyMacros):');
      console.log('  - Proteína:', profile.dailyMacros.protein || '❌', 'g');
      console.log('  - Carbohidratos:', profile.dailyMacros.carbs || '❌', 'g');
      console.log('  - Grasas:', profile.dailyMacros.fat || '❌', 'g');
    } else if (profile.macros) {
      console.log('Macros (macros):');
      console.log('  - Proteína:', profile.macros.protein || '❌', 'g');
      console.log('  - Carbohidratos:', profile.macros.carbs || '❌', 'g');
      console.log('  - Grasas:', profile.macros.fat || '❌', 'g');
    } else {
      console.warn('⚠️ NO HAY MACROS GUARDADOS');
    }
    
    console.log('\n🍎 ===== ALIMENTOS FAVORITOS =====');
    if (profile.selectedFoods) {
      const categories = Object.keys(profile.selectedFoods);
      console.log('Categorías con alimentos:', categories.length);
      
      let totalFoods = 0;
      categories.forEach(cat => {
        const count = profile.selectedFoods[cat]?.length || 0;
        totalFoods += count;
        console.log(`  - ${cat}: ${count} alimentos`);
      });
      
      console.log('Total de alimentos favoritos:', totalFoods);
      
      if (totalFoods === 0) {
        console.warn('⚠️ TIENES CATEGORÍAS PERO SIN ALIMENTOS');
      }
    } else {
      console.error('❌ NO HAY ALIMENTOS FAVORITOS GUARDADOS');
    }
    
    console.log('\n⚠️ ===== ALERGIAS Y CONDICIONES =====');
    console.log('Alergias:', profile.allergies || 'Ninguna');
    console.log('Enfermedades crónicas:', profile.chronicDiseases || 'Ninguna');
    
    console.log('\n📅 ===== FECHAS =====');
    console.log('Creado:', profile.createdAt || '❌ FALTA');
    console.log('Actualizado:', profile.updatedAt || '❌ FALTA');
    
    console.log('\n✅ ===== RESUMEN DE VALIDACIÓN =====');
    
    const checks = {
      'Datos básicos (nombre, edad, peso, altura)': !!(profile.name && profile.age && profile.weight && profile.height),
      'Objetivo definido': !!profile.goal,
      'Nivel de actividad': !!profile.activityLevel,
      'Calorías calculadas': !!(profile.dailyCalories || profile.calorieGoal),
      'Macros calculados': !!(profile.dailyMacros || profile.macros),
      'Alimentos favoritos': !!(profile.selectedFoods && Object.keys(profile.selectedFoods).length > 0)
    };
    
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(passed ? '✅' : '❌', check);
    });
    
    const allPassed = Object.values(checks).every(v => v === true);
    
    if (allPassed) {
      console.log('\n🎉 ¡PERFIL COMPLETO! El chatbot debería funcionar perfectamente.');
    } else {
      console.warn('\n⚠️ PERFIL INCOMPLETO. Algunos datos faltan.');
      console.warn('Recomendación: Vuelve a completar el perfil inicial.');
    }
    
    console.log('\n📦 ===== OBJETO COMPLETO =====');
    console.log(JSON.stringify(profile, null, 2));
    
  } catch (error) {
    console.error('❌ Error obteniendo perfil:', error);
  }
  
  console.log('\n🔍 ===== FIN DEL DEBUG =====');
})();

// INSTRUCCIONES:
// 1. Abre la app en el navegador
// 2. Inicia sesión
// 3. Presiona F12 para abrir la consola
// 4. Copia y pega TODO este código
// 5. Presiona Enter
// 6. Revisa los resultados en la consola
