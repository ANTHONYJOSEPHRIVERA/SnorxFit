// 🔧 SCRIPT DE CORRECCIÓN - Recalcular calorías de TODOS los usuarios
// EJECUTAR DESDE LA CONSOLA DEL NAVEGADOR cuando estés logueado como ADMIN

(async function recalcularCaloriasUsuarios() {
  console.log('🔧 ===== INICIANDO RECÁLCULO MASIVO =====');
  
  const db = firebase.firestore();
  
  // Función de cálculo BMR (copiada de calculations.js)
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
  
  // Función de cálculo de macros
  function calculateMacros(dailyCalories, weight, goal = 'maintain') {
    const calories = parseFloat(dailyCalories) || 0;
    const bodyWeight = parseFloat(weight) || 70;
    
    if (calories === 0) {
      return { protein: 0, carbs: 0, fat: 0 };
    }
    
    let proteinGrams, fatGrams, carbsGrams;
    
    if (goal === 'lose') {
      proteinGrams = Math.round(bodyWeight * 2.2);
      fatGrams = Math.round((calories * 0.25) / 9);
      
      const proteinCals = proteinGrams * 4;
      const fatCals = fatGrams * 9;
      const carbsCals = calories - proteinCals - fatCals;
      carbsGrams = Math.round(carbsCals / 4);
      
    } else if (goal === 'gain') {
      proteinGrams = Math.round(bodyWeight * 2.0);
      fatGrams = Math.round((calories * 0.25) / 9);
      
      const proteinCals = proteinGrams * 4;
      const fatCals = fatGrams * 9;
      const carbsCals = calories - proteinCals - fatCals;
      carbsGrams = Math.round(carbsCals / 4);
      
    } else {
      proteinGrams = Math.round(bodyWeight * 1.8);
      fatGrams = Math.round((calories * 0.30) / 9);
      
      const proteinCals = proteinGrams * 4;
      const fatCals = fatGrams * 9;
      const carbsCals = calories - proteinCals - fatCals;
      carbsGrams = Math.round(carbsCals / 4);
    }
    
    return {
      protein: Math.max(0, proteinGrams),
      carbs: Math.max(0, carbsGrams),
      fat: Math.max(0, fatGrams)
    };
  }
  
  try {
    // Obtener TODOS los usuarios
    const usersSnapshot = await db.collection('users').get();
    
    console.log(`📊 Total de usuarios encontrados: ${usersSnapshot.size}`);
    
    let corregidos = 0;
    let errores = 0;
    const reporteUsuarios = [];
    
    // Procesar cada usuario
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const profile = userDoc.data();
      
      // Validar que tenga los datos necesarios
      if (!profile.weight || !profile.height || !profile.age) {
        console.warn(`⚠️ Usuario ${userId} (${profile.name || 'Sin nombre'}) - Datos incompletos`);
        errores++;
        continue;
      }
      
      // Calcular valores CORRECTOS
      const bmrCorrecto = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
      const caloriasCorrecto = calculateDailyCalories(bmrCorrecto, profile.activityLevel, profile.goal);
      const macrosCorrecto = calculateMacros(caloriasCorrecto, profile.weight, profile.goal);
      
      const caloriaActual = profile.dailyCalories || 0;
      
      // Verificar si necesita corrección (diferencia > 100 kcal)
      const diferencia = Math.abs(caloriasCorrecto - caloriaActual);
      
      const reporte = {
        uid: userId,
        nombre: profile.name || 'Sin nombre',
        email: profile.email || 'Sin email',
        peso: profile.weight,
        altura: profile.height,
        edad: profile.age,
        genero: profile.gender,
        objetivo: profile.goal,
        actividad: profile.activityLevel,
        caloriaAnterior: caloriaActual,
        caloriaCorrecta: caloriasCorrecto,
        diferencia: diferencia,
        necesitaCorreccion: diferencia > 100
      };
      
      reporteUsuarios.push(reporte);
      
      if (diferencia > 100) {
        console.log(`\n🔧 CORRIGIENDO: ${profile.name || userId}`);
        console.log(`   Anterior: ${caloriaActual} kcal`);
        console.log(`   Correcto: ${caloriasCorrecto} kcal`);
        console.log(`   Diferencia: ${diferencia} kcal`);
        
        // ACTUALIZAR en Firebase
        await db.collection('users').doc(userId).update({
          dailyCalories: caloriasCorrecto,
          dailyMacros: macrosCorrecto,
          updatedAt: new Date().toISOString(),
          recalculatedAt: new Date().toISOString()
        });
        
        corregidos++;
      } else {
        console.log(`✅ ${profile.name || userId} - Calorías correctas (${caloriaActual} kcal)`);
      }
    }
    
    // REPORTE FINAL
    console.log('\n\n📊 ===== REPORTE FINAL =====');
    console.log(`Total de usuarios: ${usersSnapshot.size}`);
    console.log(`Usuarios corregidos: ${corregidos}`);
    console.log(`Usuarios con datos incompletos: ${errores}`);
    console.log(`Usuarios correctos: ${usersSnapshot.size - corregidos - errores}`);
    
    // Tabla detallada
    console.log('\n\n📋 TABLA DE TODOS LOS USUARIOS:');
    console.table(reporteUsuarios.map(u => ({
      Nombre: u.nombre,
      Peso: u.peso + 'kg',
      Altura: u.altura + 'cm',
      Edad: u.edad,
      Objetivo: u.objetivo,
      'Antes (kcal)': u.caloriaAnterior,
      'Correcto (kcal)': u.caloriaCorrecta,
      'Diferencia': u.diferencia,
      '¿Corregido?': u.necesitaCorreccion ? '✅ SÍ' : 'No necesario'
    })));
    
    // Usuarios que NECESITABAN corrección
    const usuariosCorregidos = reporteUsuarios.filter(u => u.necesitaCorreccion);
    if (usuariosCorregidos.length > 0) {
      console.log('\n\n⚠️ USUARIOS QUE TENÍAN CALORÍAS INCORRECTAS:');
      console.table(usuariosCorregidos.map(u => ({
        Nombre: u.nombre,
        Email: u.email,
        'Calor. Anterior': u.caloriaAnterior,
        'Calor. Correcta': u.caloriaCorrecta,
        'Diferencia': u.diferencia + ' kcal'
      })));
    }
    
    console.log('\n✅ ===== RECÁLCULO COMPLETADO =====');
    console.log('Todos los usuarios ahora tienen calorías CORRECTAS según sus datos.');
    console.log('Los cambios se han guardado en Firebase.');
    
  } catch (error) {
    console.error('❌ Error durante el recálculo:', error);
  }
})();

// INSTRUCCIONES:
// 1. Abre la app en el navegador
// 2. Inicia sesión (puede ser cualquier usuario)
// 3. Presiona F12 para abrir la consola
// 4. Copia y pega TODO este código
// 5. Presiona Enter
// 6. Espera a que termine (puede tardar unos segundos)
// 7. Revisa el reporte en la consola
