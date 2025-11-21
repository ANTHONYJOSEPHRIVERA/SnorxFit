// 🧪 Script de Prueba de Conectividad - SnorxFit
// Este script verifica que todos los componentes estén correctamente conectados a Firebase

import { db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, query, limit } from 'firebase/firestore';

const testConnectivity = async () => {
  console.log('🧪 ===== INICIANDO PRUEBAS DE CONECTIVIDAD =====\n');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };

  // 1. Test: Conexión a Firebase
  try {
    console.log('📡 Test 1: Conexión a Firebase Firestore...');
    if (db) {
      console.log('   ✅ Firebase inicializado correctamente');
      results.passed++;
    } else {
      console.error('   ❌ Firebase NO inicializado');
      results.failed++;
    }
  } catch (error) {
    console.error('   ❌ Error conectando a Firebase:', error);
    results.failed++;
  }

  console.log('');

  // 2. Test: Colección users
  try {
    console.log('📊 Test 2: Colección "users"...');
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(query(usersRef, limit(1)));
    
    if (!usersSnapshot.empty) {
      const userData = usersSnapshot.docs[0].data();
      console.log('   ✅ Colección "users" accesible');
      console.log('   📝 Campos encontrados:', Object.keys(userData).join(', '));
      
      // Verificar campos de rachas
      if (userData.currentStreak !== undefined && userData.longestStreak !== undefined) {
        console.log('   ✅ Sistema de rachas configurado');
        console.log(`   🔥 Ejemplo - Racha actual: ${userData.currentStreak}, Récord: ${userData.longestStreak}`);
      } else {
        console.log('   ⚠️  Campos de rachas no encontrados en usuario de muestra');
        results.warnings++;
      }
      
      results.passed++;
    } else {
      console.log('   ⚠️  Colección vacía (normal en app nueva)');
      results.warnings++;
    }
  } catch (error) {
    console.error('   ❌ Error accediendo a "users":', error.message);
    results.failed++;
  }

  console.log('');

  // 3. Test: Colección chat_metrics
  try {
    console.log('💬 Test 3: Colección "chat_metrics"...');
    const metricsRef = collection(db, 'chat_metrics');
    const metricsSnapshot = await getDocs(query(metricsRef, limit(5)));
    
    if (!metricsSnapshot.empty) {
      console.log(`   ✅ Colección "chat_metrics" accesible (${metricsSnapshot.size} registros encontrados)`);
      
      // Análisis de tipos de métricas
      const types = metricsSnapshot.docs.map(doc => doc.data().messageType);
      console.log('   📊 Tipos de mensajes:', [...new Set(types)].join(', '));
      results.passed++;
    } else {
      console.log('   ⚠️  Colección vacía (normal si no se ha usado el chatbot)');
      results.warnings++;
    }
  } catch (error) {
    console.error('   ❌ Error accediendo a "chat_metrics":', error.message);
    results.failed++;
  }

  console.log('');

  // 4. Test: Colección sus_responses
  try {
    console.log('⭐ Test 4: Colección "sus_responses"...');
    const susRef = collection(db, 'sus_responses');
    const susSnapshot = await getDocs(query(susRef, limit(5)));
    
    if (!susSnapshot.empty) {
      console.log(`   ✅ Colección "sus_responses" accesible (${susSnapshot.size} respuestas)`);
      
      const scores = susSnapshot.docs.map(doc => doc.data().score);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      console.log(`   📈 Score SUS promedio: ${avgScore.toFixed(1)}/100`);
      results.passed++;
    } else {
      console.log('   ⚠️  Colección vacía (normal si no se ha evaluado la app)');
      results.warnings++;
    }
  } catch (error) {
    console.error('   ❌ Error accediendo a "sus_responses":', error.message);
    results.failed++;
  }

  console.log('');

  // 5. Test: Subcollection foodLogs (requiere userId)
  try {
    console.log('🍎 Test 5: Subcollection "foodLogs"...');
    
    // Intentar obtener un usuario para probar foodLogs
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(query(usersRef, limit(1)));
    
    if (!usersSnapshot.empty) {
      const userId = usersSnapshot.docs[0].id;
      const today = new Date().toISOString().split('T')[0];
      
      const foodLogRef = doc(db, 'users', userId, 'foodLogs', today);
      const foodLogSnap = await getDoc(foodLogRef);
      
      if (foodLogSnap.exists()) {
        const foodData = foodLogSnap.data();
        console.log(`   ✅ FoodLog encontrado para hoy (${today})`);
        
        if (foodData.meals) {
          const mealCounts = Object.keys(foodData.meals).map(
            meal => `${meal}: ${foodData.meals[meal].length} items`
          );
          console.log('   🍽️  Comidas registradas:', mealCounts.join(', '));
        }
        
        results.passed++;
      } else {
        console.log(`   ⚠️  No hay foodLog para hoy (${today}) - normal si no se ha registrado`);
        results.warnings++;
      }
    } else {
      console.log('   ⚠️  No hay usuarios para probar foodLogs');
      results.warnings++;
    }
  } catch (error) {
    console.error('   ❌ Error accediendo a "foodLogs":', error.message);
    results.failed++;
  }

  console.log('');

  // 6. Test: Verificar estructura de datos
  console.log('🔍 Test 6: Verificación de estructura de datos...');
  try {
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(query(usersRef, limit(1)));
    
    if (!usersSnapshot.empty) {
      const userData = usersSnapshot.docs[0].data();
      
      const requiredFields = [
        'email',
        'uid',
        'currentStreak',
        'longestStreak',
        'lastLoginDate'
      ];
      
      const missingFields = requiredFields.filter(field => !(field in userData));
      
      if (missingFields.length === 0) {
        console.log('   ✅ Todos los campos requeridos presentes');
        results.passed++;
      } else {
        console.log('   ⚠️  Campos faltantes:', missingFields.join(', '));
        results.warnings++;
      }
    } else {
      console.log('   ⚠️  No hay usuarios para verificar estructura');
      results.warnings++;
    }
  } catch (error) {
    console.error('   ❌ Error verificando estructura:', error.message);
    results.failed++;
  }

  console.log('');
  console.log('🎯 ===== RESUMEN DE PRUEBAS =====');
  console.log(`   ✅ Exitosas: ${results.passed}`);
  console.log(`   ⚠️  Advertencias: ${results.warnings}`);
  console.log(`   ❌ Fallidas: ${results.failed}`);
  console.log('');

  if (results.failed === 0) {
    console.log('🎉 ¡TODAS LAS CONEXIONES FUNCIONAN CORRECTAMENTE!');
    console.log('');
    console.log('📝 Próximos pasos:');
    console.log('   1. Registra comidas en FoodLog');
    console.log('   2. Usa el chatbot para generar métricas');
    console.log('   3. Completa el cuestionario SUS');
    console.log('   4. Verifica que las rachas incrementen al iniciar sesión días consecutivos');
  } else {
    console.log('⚠️  Algunas pruebas fallaron. Revisa los errores arriba.');
  }

  return results;
};

// Ejecutar pruebas si se llama directamente
if (typeof window !== 'undefined') {
  window.testConnectivity = testConnectivity;
  console.log('💡 Ejecuta window.testConnectivity() en la consola para probar conectividad');
}

export default testConnectivity;
