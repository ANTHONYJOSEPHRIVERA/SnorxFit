// 🗑️ ELIMINAR TODAS LAS CUENTAS - RESETEO TOTAL
// ⚠️ ADVERTENCIA: Esto eliminará TODOS los usuarios de Firebase
// Solo ejecutar si estás seguro de que quieres empezar de cero

(async function eliminarTodasLasCuentas() {
  console.log('🗑️ ===== ELIMINACIÓN MASIVA DE CUENTAS =====\n');
  console.log('⚠️ ADVERTENCIA: Esto eliminará TODOS los usuarios de Firestore');
  console.log('⚠️ NO SE PUEDE DESHACER\n');
  
  const confirmar = confirm('⚠️ ¿Estás SEGURO de que quieres ELIMINAR TODAS LAS CUENTAS?\n\nEsto incluye:\n- Todos los perfiles de usuario\n- Todos los registros de alimentos\n- Todos los pesos guardados\n- Todas las rachas\n- Todo el historial\n\nEscribe "ELIMINAR TODO" en la siguiente ventana si estás seguro.');
  
  if (!confirmar) {
    console.log('❌ Cancelado por el usuario');
    return;
  }
  
  const confirmacionTexto = prompt('Escribe "ELIMINAR TODO" para confirmar:');
  
  if (confirmacionTexto !== 'ELIMINAR TODO') {
    console.log('❌ Texto de confirmación incorrecto. Cancelado.');
    return;
  }
  
  console.log('\n🚀 Iniciando eliminación...\n');
  
  const db = firebase.firestore();
  
  try {
    // Obtener TODOS los usuarios
    const usersSnapshot = await db.collection('users').get();
    
    console.log(`📊 Total de usuarios a eliminar: ${usersSnapshot.size}\n`);
    
    if (usersSnapshot.size === 0) {
      console.log('✅ No hay usuarios para eliminar');
      return;
    }
    
    let eliminados = 0;
    let errores = 0;
    
    // Eliminar cada usuario y sus subcolecciones
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      
      try {
        console.log(`🗑️ Eliminando: ${userData.name || userId} (${userData.email || 'Sin email'})`);
        
        // Eliminar subcolecciones (foodLogs, weights, etc.)
        const subCollections = ['foodLogs', 'weights', 'analytics'];
        
        for (const subCollection of subCollections) {
          const subDocs = await db.collection('users').doc(userId).collection(subCollection).get();
          
          if (subDocs.size > 0) {
            console.log(`   📂 Eliminando ${subDocs.size} documentos de ${subCollection}...`);
            
            const batch = db.batch();
            subDocs.docs.forEach(doc => {
              batch.delete(doc.ref);
            });
            await batch.commit();
          }
        }
        
        // Eliminar el documento principal del usuario
        await db.collection('users').doc(userId).delete();
        
        console.log(`   ✅ Usuario eliminado completamente\n`);
        eliminados++;
        
      } catch (error) {
        console.error(`   ❌ Error eliminando ${userId}:`, error);
        errores++;
      }
    }
    
    // Eliminar colecciones globales (chat_metrics, sus_responses, knowledge_tests)
    console.log('\n🗑️ Eliminando colecciones globales...\n');
    
    const globalCollections = ['chat_metrics', 'sus_responses', 'knowledge_tests'];
    
    for (const collectionName of globalCollections) {
      try {
        const docs = await db.collection(collectionName).get();
        
        if (docs.size > 0) {
          console.log(`📂 Eliminando ${docs.size} documentos de ${collectionName}...`);
          
          const batch = db.batch();
          docs.docs.forEach(doc => {
            batch.delete(doc.ref);
          });
          await batch.commit();
          
          console.log(`✅ ${collectionName} eliminada\n`);
        }
      } catch (error) {
        console.error(`❌ Error eliminando ${collectionName}:`, error);
      }
    }
    
    console.log('\n📊 ===== RESUMEN FINAL =====');
    console.log(`Total de usuarios eliminados: ${eliminados}`);
    console.log(`Errores: ${errores}`);
    console.log('\n✅ FIRESTORE LIMPIADO COMPLETAMENTE');
    console.log('\n⚠️ IMPORTANTE:');
    console.log('1. Los usuarios pueden volver a registrarse desde cero');
    console.log('2. Todos los datos fueron eliminados permanentemente');
    console.log('3. Las cuentas de Firebase Authentication AÚN EXISTEN');
    console.log('4. Para eliminar las cuentas de Auth también, ve a:');
    console.log('   Firebase Console → Authentication → Users → Eliminar manualmente');
    console.log('\n🔄 Recarga la página para ver los cambios');
    
  } catch (error) {
    console.error('❌ Error durante la eliminación:', error);
  }
})();

// INSTRUCCIONES:
// 1. Abre la app en el navegador
// 2. Inicia sesión con cualquier cuenta
// 3. Presiona F12 para abrir la consola
// 4. Copia y pega TODO este código
// 5. Presiona Enter
// 6. Confirma 2 veces que quieres eliminar todo
// 7. Espera a que termine
// 8. Ve a Firebase Console → Authentication y elimina las cuentas manualmente
