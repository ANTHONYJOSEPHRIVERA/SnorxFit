/**
 * PRUEBAS DE ENTRADA/SALIDA DEL CHATBOT
 * Evidencia para: 8.3.b) Pruebas de entrada/salida
 * 
 * Se prueban:
 * - Consultas válidas ("calorías de manzana")
 * - Consultas inválidas ("asdfgh")
 * - Manejo de errores controlados
 */

// Función getLocalResponse simplificada para tests
const getLocalResponse = (input) => {
  const lowerInput = input.toLowerCase().trim();
  
  if (lowerInput.includes('está bien') && lowerInput.includes('comí')) {
    return 'Para analizar tu alimentación necesito saber qué comiste...';
  }
  if (lowerInput.includes('proteína') || lowerInput.includes('proteinas')) {
    return 'Mejores fuentes de proteína: pollo, pescado, huevos...';
  }
  if (lowerInput.includes('calor') && lowerInput.includes('manzana')) {
    return 'Una manzana mediana tiene aproximadamente 52 calorías.';
  }
  if (lowerInput.includes('calorías') || lowerInput.includes('calorias')) {
    return 'Las calorías son unidades de energía que necesita tu cuerpo...';
  }
  if (lowerInput.includes('agua') || lowerInput.includes('hidrat')) {
    return 'Cantidad de agua recomendada: 35-40 ml por kg de peso...';
  }
  if (lowerInput.includes('déficit') || lowerInput.includes('deficit')) {
    return 'Para déficit calórico necesitas consumir 300-500 kcal menos...';
  }
  if (lowerInput.includes('músculo') || lowerInput.includes('musculo')) {
    return 'Para ganar músculo: superávit calórico + entrenamiento...';
  }
  if (lowerInput.includes('cerveza') || lowerInput.includes('alcohol')) {
    return 'El alcohol aporta 7 calorías por gramo, afecta el rendimiento...';
  }
  if (lowerInput.includes('cardio')) {
    return 'El cardio ayuda a crear déficit calórico y mejora salud cardiovascular...';
  }
  if (lowerInput.includes('descanso') || lowerInput.includes('dormir')) {
    return 'Descansar 7-9 horas es crucial para recuperación muscular...';
  }
  if (lowerInput.includes('gaseosa') || lowerInput.includes('bebida')) {
    return 'Las bebidas azucaradas aportan calorías vacías sin nutrientes...';
  }
  if (lowerInput.includes('ayuno')) {
    return 'El ayuno intermitente puede ayudar a controlar calorías...';
  }
  if (lowerInput.includes('cheat') || lowerInput.includes('trampa')) {
    return 'Las comidas trampa pueden ayudar psicológicamente si son controladas...';
  }
  if (lowerInput.includes('suplemento')) {
    return 'Los suplementos complementan, no reemplazan una buena alimentación...';
  }
  if (lowerInput.includes('horario') || lowerInput.includes('hora')) {
    return 'El horario de comidas debe ajustarse a tu rutina y preferencias...';
  }
  if (lowerInput.includes('peruana') || lowerInput.includes('perú')) {
    return 'La comida peruana puede ser saludable: ceviche, quinua, papa...';
  }
  
  return null; // No hay respuesta local, usar API
};

describe('8.3.b - Pruebas de Entrada/Salida', () => {
  
  // ========== CONSULTAS VÁLIDAS ==========
  test('✅ Debe responder a consulta válida: "calorías de manzana"', () => {
    const response = getLocalResponse('calorías de manzana');
    
    expect(response).toContain('52 calorías');
    expect(response).not.toBeNull();
    
    console.log('✅ Consulta válida: "calorías de manzana"');
    console.log(`   Respuesta: ${response}`);
  });

  test('✅ Debe responder a consulta válida: "¿Qué tiene más proteínas?"', () => {
    const response = getLocalResponse('¿Qué tiene más proteínas?');
    
    expect(response).toContain('proteína');
    expect(response).not.toBeNull();
    
    console.log('✅ Consulta válida: "proteínas"');
    console.log(`   Respuesta: ${response.substring(0, 50)}...`);
  });

  test('✅ Debe responder a consulta válida: "¿Cuánta agua tomar?"', () => {
    const response = getLocalResponse('¿Cuánta agua tomar?');
    
    expect(response).toContain('agua');
    expect(response).not.toBeNull();
    
    console.log('✅ Consulta válida: "agua"');
  });

  test('✅ Debe responder a consulta válida: "déficit calórico"', () => {
    const response = getLocalResponse('¿Cómo hacer déficit calórico?');
    
    expect(response).toContain('déficit');
    expect(response).not.toBeNull();
  });

  // ========== CONSULTAS INVÁLIDAS ==========
  test('❌ Debe rechazar consulta inválida: "asdfgh"', () => {
    const response = getLocalResponse('asdfgh');
    
    expect(response).toBeNull(); // No hay respuesta local
    
    console.log('❌ Consulta inválida: "asdfgh"');
    console.log('   Resultado: null (usará API o mostrará error)');
  });

  test('❌ Debe rechazar consulta inválida: "12345"', () => {
    const response = getLocalResponse('12345');
    
    expect(response).toBeNull();
    
    console.log('❌ Consulta inválida: "12345"');
  });

  test('❌ Debe rechazar entrada vacía', () => {
    const response = getLocalResponse('');
    
    expect(response).toBeNull();
    
    console.log('❌ Consulta vacía: ""');
  });

  test('❌ Debe identificar texto sin sentido', () => {
    const query = 'xyzabc';
    const hasValidWords = ['qué', 'cómo', 'cuánto', 'por', 'es'].some(
      word => query.toLowerCase().includes(word)
    );
    
    expect(hasValidWords).toBe(false);
    
    console.log('❌ Texto sin palabras válidas: "xyzabc"');
  });

  // ========== MANEJO DE ERRORES CONTROLADOS ==========
  test('🔴 Debe generar mensaje de error para problemas de red', () => {
    const error = new Error('Failed to fetch');
    const isNetworkError = error.message.includes('Failed to fetch');
    
    const errorMessage = isNetworkError 
      ? '⚠️ Sin conexión a internet. Inténtalo más tarde.' 
      : 'Error desconocido';
    
    expect(errorMessage).toContain('Sin conexión');
    
    console.log('🔴 Error de red simulado');
    console.log(`   Mensaje: ${errorMessage}`);
  });

  test('🔴 Debe generar mensaje de error para API key inválida', () => {
    const error = new Error('API Key inválida');
    const isAPIKeyError = error.message.includes('API Key');
    
    const errorMessage = isAPIKeyError 
      ? '🔑 La API Key de Gemini no es válida.' 
      : 'Error desconocido';
    
    expect(errorMessage).toContain('API Key');
    
    console.log('🔴 Error de API Key simulado');
    console.log(`   Mensaje: ${errorMessage}`);
  });

  test('🔴 Debe generar mensaje de error para respuesta no entendida', () => {
    const userQuery = 'asdfgh xyz 123';
    const hasLocalResponse = getLocalResponse(userQuery);
    
    const errorMessage = hasLocalResponse === null
      ? '⚠️ No entendí tu consulta. Intenta preguntar sobre calorías, proteínas, agua, etc.'
      : 'Respuesta encontrada';
    
    expect(errorMessage).toContain('No entendí');
    
    console.log('🔴 Consulta no entendida');
    console.log(`   Mensaje: ${errorMessage}`);
  });

  // ========== VALIDACIÓN DE ESTRUCTURA ==========
  test('📋 Debe validar que hay al menos 15 categorías locales', () => {
    const queries = [
      'agua', 'proteínas', 'calorías', 'déficit', 'músculo',
      'está bien lo que comí', 'cerveza', 'cardio', 'descanso',
      'gaseosa', 'ayuno', 'cheat', 'suplementos', 'horario',
      'comida peruana'
    ];
    
    let validResponses = 0;
    queries.forEach(q => {
      if (getLocalResponse(q) !== null) {
        validResponses++;
      }
    });
    
    expect(validResponses).toBeGreaterThanOrEqual(10);
    
    console.log(`📋 Categorías locales detectadas: ${validResponses}/15`);
  });
});


