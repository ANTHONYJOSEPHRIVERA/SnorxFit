/**
 * Utilidad para limpiar datos de localStorage
 */

/**
 * Limpia todos los registros de comida (foodLog)
 */
export function clearAllFoodLogs() {
  let cleaned = 0;
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith('foodLog_')) {
      localStorage.removeItem(key);
      cleaned++;
    }
  });
  
  console.log(`✅ ${cleaned} registros de comida limpiados`);
  return cleaned;
}

/**
 * Limpia foodLogs antiguos (más de X días)
 */
export function clearOldFoodLogs(daysToKeep = 30) {
  let cleaned = 0;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];
  
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith('foodLog_')) {
      const dateStr = key.replace('foodLog_', '');
      if (dateStr < cutoffStr) {
        localStorage.removeItem(key);
        cleaned++;
      }
    }
  });
  
  console.log(`✅ ${cleaned} registros antiguos limpiados (>${daysToKeep} días)`);
  return cleaned;
}

/**
 * Limpia perfiles antiguos en caché
 */
export function clearOldProfiles() {
  let cleaned = 0;
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith('snorxfit_profile_')) {
      // Mantener solo el perfil actual
      // Los demás son de sesiones anteriores
      localStorage.removeItem(key);
      cleaned++;
    }
  });
  
  console.log(`✅ ${cleaned} perfiles en caché limpiados`);
  return cleaned;
}

/**
 * Limpieza completa (usar con cuidado)
 */
export function clearAllAppData() {
  const keys = Object.keys(localStorage);
  const appKeys = keys.filter(key => 
    key.startsWith('foodLog_') || 
    key.startsWith('snorxfit_') ||
    key.startsWith('chatHistory_')
  );
  
  appKeys.forEach(key => localStorage.removeItem(key));
  
  console.log(`✅ ${appKeys.length} items de app limpiados`);
  return appKeys.length;
}

// Hacer disponibles globalmente en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.clearAllFoodLogs = clearAllFoodLogs;
  window.clearOldFoodLogs = clearOldFoodLogs;
  window.clearOldProfiles = clearOldProfiles;
  window.clearAllAppData = clearAllAppData;
  
  console.log('🧹 Funciones de limpieza disponibles:');
  console.log('   clearAllFoodLogs() - Limpia todos los foodLogs');
  console.log('   clearOldFoodLogs(30) - Limpia foodLogs >30 días');
  console.log('   clearOldProfiles() - Limpia perfiles en caché');
  console.log('   clearAllAppData() - Limpieza completa');
}
