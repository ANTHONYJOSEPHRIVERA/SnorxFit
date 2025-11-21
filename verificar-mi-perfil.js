// 🔍 VERIFICAR TU PERFIL ACTUAL
// Ejecutar en consola (F12) cuando estés logueado

(async function verificarMiPerfil() {
  console.log('🔍 ===== VERIFICANDO TU PERFIL =====\n');
  
  const auth = firebase.auth();
  const db = firebase.firestore();
  const user = auth.currentUser;
  
  if (!user) {
    console.error('❌ No hay usuario logueado');
    return;
  }
  
  console.log('✅ Usuario:', user.email);
  console.log('🆔 UID:', user.uid, '\n');
  
  // Función de cálculo BMR
  function calculateBMR(weight, height, age, gender) {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age, 10);
    if (!w || !h || !a) return 0;
    if (gender === 'male') {
      return Math.round(88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a));
    }
    return Math.round(447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a));
  }
  
  // Función de cálculo TDEE
  function calculateDailyCalories(bmr, activityLevel, goal = 'maintain') {
    const base = parseFloat(bmr) || 0;
    if (base === 0) return 0;
    
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    
    const m = multipliers[activityLevel] || multipliers.sedentary;
    let tdee = base * m;
    
    if (goal === 'lose') {
      return Math.round(tdee - 500);
    } else if (goal === 'gain') {
      return Math.round(tdee + 300);
    } else {
      return Math.round(tdee);
    }
  }
  
  try {
    const profileDoc = await db.collection('users').doc(user.uid).get();
    
    if (!profileDoc.exists) {
      console.error('❌ No existe perfil en Firebase');
      return;
    }
    
    const profile = profileDoc.data();
    
    console.log('📋 ===== TUS DATOS GUARDADOS =====');
    console.log('Nombre:', profile.name);
    console.log('Peso:', profile.weight, 'kg');
    console.log('Altura:', profile.height, 'cm');
    console.log('Edad:', profile.age, 'años');
    console.log('Género:', profile.gender === 'male' ? 'Hombre' : 'Mujer');
    console.log('Objetivo:', 
      profile.goal === 'lose' ? 'PERDER PESO' : 
      profile.goal === 'gain' ? 'GANAR MÚSCULO' : 
      'MANTENER PESO'
    );
    console.log('Nivel de actividad:', 
      profile.activityLevel === 'sedentary' ? 'Sedentario' :
      profile.activityLevel === 'light' ? 'Ligero' :
      profile.activityLevel === 'moderate' ? 'Moderado' :
      profile.activityLevel === 'active' ? 'Activo' :
      profile.activityLevel === 'veryActive' ? 'Muy Activo' :
      profile.activityLevel
    );
    
    console.log('\n💾 CALORÍAS GUARDADAS EN TU PERFIL:');
    console.log('→', profile.dailyCalories, 'kcal\n');
    
    // RECALCULAR VALORES CORRECTOS
    const bmrCorrecto = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
    
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    const multiplier = multipliers[profile.activityLevel] || 1.2;
    const tdee = bmrCorrecto * multiplier;
    
    const caloriasCorrecto = calculateDailyCalories(bmrCorrecto, profile.activityLevel, profile.goal);
    
    console.log('🧮 ===== CÁLCULO CORRECTO =====');
    console.log('1. BMR (Metabolismo Basal):', bmrCorrecto, 'kcal');
    console.log('   Fórmula:', profile.gender === 'male' ? 'Harris-Benedict Hombres' : 'Harris-Benedict Mujeres');
    console.log('   = 88.362 + (13.397 × ' + profile.weight + ') + (4.799 × ' + profile.height + ') - (5.677 × ' + profile.age + ')');
    
    console.log('\n2. TDEE (Gasto Diario Total):');
    console.log('   BMR × Factor de Actividad');
    console.log('   =', bmrCorrecto, '×', multiplier);
    console.log('   =', Math.round(tdee), 'kcal');
    
    console.log('\n3. Calorías según OBJETIVO:');
    if (profile.goal === 'lose') {
      console.log('   PÉRDIDA DE PESO: TDEE - 500 kcal');
      console.log('   =', Math.round(tdee), '- 500');
    } else if (profile.goal === 'gain') {
      console.log('   GANANCIA MUSCULAR: TDEE + 300 kcal');
      console.log('   =', Math.round(tdee), '+ 300');
    } else {
      console.log('   MANTENIMIENTO: TDEE (sin cambios)');
    }
    console.log('   =', caloriasCorrecto, 'kcal\n');
    
    // COMPARACIÓN
    const diferencia = Math.abs(profile.dailyCalories - caloriasCorrecto);
    const porcentajeDiferencia = ((diferencia / caloriasCorrecto) * 100).toFixed(1);
    
    console.log('⚖️ ===== COMPARACIÓN =====');
    console.log('Guardado en tu perfil:', profile.dailyCalories, 'kcal');
    console.log('Valor CORRECTO:', caloriasCorrecto, 'kcal');
    console.log('Diferencia:', diferencia, 'kcal (' + porcentajeDiferencia + '%)');
    
    if (diferencia > 100) {
      console.log('\n❌ ¡TUS CALORÍAS ESTÁN INCORRECTAS!');
      console.log('Diferencia significativa detectada:', diferencia, 'kcal');
      console.log('\n🔧 SOLUCIÓN:');
      console.log('1. Copia este valor correcto:', caloriasCorrecto, 'kcal');
      console.log('2. O ejecuta el script de corrección masiva');
      console.log('3. O vuelve a completar tu perfil');
      
      // Ofrecer corrección automática
      console.log('\n💡 ¿Quieres CORREGIR AHORA?');
      console.log('Ejecuta este código:');
      console.log(`
firebase.firestore().collection('users').doc('${user.uid}').update({
  dailyCalories: ${caloriasCorrecto},
  updatedAt: new Date().toISOString()
}).then(() => {
  console.log('✅ Calorías corregidas a ${caloriasCorrecto} kcal');
  console.log('Recarga la página para ver los cambios');
});
      `);
    } else {
      console.log('\n✅ TUS CALORÍAS SON CORRECTAS');
      console.log('Diferencia menor a 100 kcal - dentro del margen aceptable');
    }
    
    // MACROS
    if (profile.dailyMacros) {
      console.log('\n📊 MACROS GUARDADOS:');
      console.log('  Proteína:', profile.dailyMacros.protein, 'g');
      console.log('  Carbohidratos:', profile.dailyMacros.carbs, 'g');
      console.log('  Grasas:', profile.dailyMacros.fat, 'g');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
