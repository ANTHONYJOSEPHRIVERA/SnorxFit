// 🚨 SCRIPT PARA FORZAR RECONFIGURACIÓN DE TODOS LOS PERFILES
// ADVERTENCIA: Esto invalidará TODOS los perfiles y usuarios tendrán que volver a configurarse
// Solo ejecutar si realmente quieres que TODOS vuelvan a llenar el formulario

(async function forzarReconfiguracionTotal() {
  console.log('🚨 ===== FORZAR RECONFIGURACIÓN TOTAL =====\n');
  console.log('⚠️  ADVERTENCIA: Este script invalidará TODOS los perfiles de usuario');
  console.log('⚠️  Los usuarios tendrán que volver a completar el formulario inicial\n');
  
  const confirmacion = confirm(
    '⚠️ ¿ESTÁS SEGURO?\n\n' +
    'Esto borrará las calorías y macros de TODOS los usuarios.\n' +
    'Cada usuario tendrá que volver a configurar su perfil.\n\n' +
    '¿Continuar?'
  );
  
  if (!confirmacion) {
    console.log('❌ Operación cancelada');
    return;
  }
  
  const db = firebase.firestore();
  
  try {
    console.log('📊 Obteniendo todos los usuarios...\n');
    const usersSnapshot = await db.collection('users').get();
    
    console.log(`Total de usuarios: ${usersSnapshot.size}\n`);
    
    let procesados = 0;
    const batch = db.batch();
    
    usersSnapshot.docs.forEach(doc => {
      const userId = doc.id;
      const userData = doc.data();
      
      console.log(`🔄 Invalidando perfil: ${userData.name || userId}`);
      
      // Invalidar perfil - borrar calorías y macros
      batch.update(doc.ref, {
        dailyCalories: null,
        dailyMacros: null,
        needsProfileUpdate: true,
        profileInvalidatedAt: new Date().toISOString(),
        invalidationReason: 'Formula recalculation - Nov 2025'
      });
      
      procesados++;
    });
    
    console.log(`\n💾 Guardando cambios en Firebase...`);
    await batch.commit();
    
    console.log('\n✅ ===== OPERACIÓN COMPLETADA =====');
    console.log(`Total de perfiles invalidados: ${procesados}`);
    console.log('\nLos usuarios verán el formulario de perfil la próxima vez que inicien sesión.');
    console.log('Sus datos personales (nombre, email) se mantienen intactos.');
    console.log('Solo tendrán que volver a ingresar: peso, altura, edad, objetivo, actividad.\n');
    
  } catch (error) {
    console.error('❌ Error durante la operación:', error);
  }
})();
