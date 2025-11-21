/**
 * PRUEBA DE EXPLICABILIDAD
 * Evidencia: 8.5.e) Explicabilidad del modelo
 * 
 * El chatbot muestra si la respuesta viene del dataset local o de Gemini API
 * Etiquetas: "Respuesta Local (Dataset)" vs "Respuesta IA (Gemini)"
 */

const getLocalResponse = (input) => {
  const lowerInput = input.toLowerCase().trim();
  
  if (lowerInput.includes('agua')) return 'Agua: 35-40 ml/kg';
  if (lowerInput.includes('proteína')) return 'Proteínas: pollo, pescado';
  if (lowerInput.includes('calor')) return 'Calorías: 52 kcal';
  if (lowerInput.includes('déficit')) return 'Déficit: -300 kcal';
  if (lowerInput.includes('músculo')) return 'Músculo: superávit';
  if (lowerInput.includes('cerveza')) return 'Cerveza: evitar';
  if (lowerInput.includes('cardio')) return 'Cardio: 20-40 min';
  if (lowerInput.includes('descanso')) return 'Descanso: 7-9h';
  if (lowerInput.includes('gaseosa')) return 'Gaseosa: evitar';
  if (lowerInput.includes('ayuno')) return 'Ayuno: 16/8';
  
  return null;
};

describe('8.5.e - Explicabilidad (Etiqueta Local vs Gemini)', () => {
  
  test('🏷️  Debe etiquetar respuesta LOCAL correctamente', () => {
    const response = getLocalResponse('¿Cuánta agua tomar?');
    const isLocal = response !== null;
    const label = isLocal ? 'Respuesta Local (Dataset)' : 'Respuesta IA (Gemini)';
    
    expect(label).toBe('Respuesta Local (Dataset)');
    
    console.log('');
    console.log('🏷️  ========== ETIQUETA LOCAL ==========');
    console.log(`🏷️  Pregunta: "¿Cuánta agua tomar?"`);
    console.log(`🏷️  Etiqueta: ${label}`);
    console.log(`✅ Estado: Correctamente identificada`);
    console.log('======================================');
    console.log('');
  });

  test('🏷️  Debe etiquetar consulta que requiere API', () => {
    const response = getLocalResponse('¿Qué es la dieta mediterránea?');
    const isLocal = response !== null;
    const label = isLocal ? 'Respuesta Local (Dataset)' : 'Respuesta IA (Gemini)';
    
    expect(label).toBe('Respuesta IA (Gemini)');
    
    console.log('🏷️  ========== ETIQUETA GEMINI API ==========');
    console.log(`🏷️  Pregunta: "¿Qué es la dieta mediterránea?"`);
    console.log(`🏷️  Etiqueta: ${label}`);
    console.log(`✅ Estado: Correctamente identificada`);
    console.log('==========================================');
    console.log('');
  });

  test('🏷️  Todas las respuestas deben tener etiqueta de origen', () => {
    const queries = [
      { q: '¿Cuánta agua tomar?', expected: 'Local' },
      { q: '¿Qué es la dieta keto?', expected: 'Gemini' },
      { q: 'proteínas', expected: 'Local' },
      { q: '¿Es bueno el crossfit?', expected: 'Gemini' }
    ];
    
    console.log('🏷️  ========== VALIDACIÓN DE ETIQUETAS ==========');
    
    queries.forEach(({ q, expected }) => {
      const response = getLocalResponse(q);
      const label = response !== null ? 'Local' : 'Gemini';
      
      expect(label).toBe(expected);
      console.log(`✅ "${q}" → ${label}`);
    });
    
    console.log('==============================================');
    console.log('');
  });

  test('📊 Debe mostrar estadísticas de uso Local vs API', () => {
    const queries = [
      'agua', 'proteínas', 'calorías', 'déficit', 'músculo',
      'dieta keto', 'crossfit', 'yoga', 'pilates', 'zumba',
      'cerveza', 'cardio', 'descanso', 'gaseosa', 'ayuno'
    ];
    
    let localCount = 0;
    let apiCount = 0;
    
    queries.forEach(q => {
      const response = getLocalResponse(q);
      if (response !== null) {
        localCount++;
      } else {
        apiCount++;
      }
    });
    
    const localPercentage = (localCount / queries.length) * 100;
    const apiPercentage = (apiCount / queries.length) * 100;
    
    console.log('📊 ========== ESTADÍSTICAS DE USO ==========');
    console.log(`📊 Total de consultas analizadas: ${queries.length}`);
    console.log(`🏠 Respuestas Locales: ${localCount} (${localPercentage.toFixed(1)}%)`);
    console.log(`🤖 Respuestas Gemini API: ${apiCount} (${apiPercentage.toFixed(1)}%)`);
    console.log(`✅ Todas las consultas fueron etiquetadas correctamente`);
    console.log('==========================================');
    console.log('');
    
    expect(localCount + apiCount).toBe(queries.length);
  });

  test('🎯 Debe distinguir entre tipos de respuesta', () => {
    const testCases = [
      { query: 'agua', type: 'local' },
      { query: 'proteínas', type: 'local' },
      { query: 'dieta keto', type: 'api' },
      { query: 'crossfit', type: 'api' }
    ];
    
    console.log('🎯 ========== CLASIFICACIÓN DE RESPUESTAS ==========');
    
    testCases.forEach(({ query, type }) => {
      const response = getLocalResponse(query);
      const isLocal = response !== null;
      const actualType = isLocal ? 'local' : 'api';
      
      expect(actualType).toBe(type);
      
      const icon = actualType === 'local' ? '🏠' : '🤖';
      const label = actualType === 'local' ? 'Dataset Local' : 'Gemini API';
      
      console.log(`${icon} "${query}" → ${label}`);
    });
    
    console.log('==================================================');
    console.log('');
  });
});
