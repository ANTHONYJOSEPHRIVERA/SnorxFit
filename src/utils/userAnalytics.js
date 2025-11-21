// 🧠 Sistema de Análisis y Personalización de Usuario
import { collection, getDocs, query, orderBy, limit, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Analiza el historial de alimentación del usuario y detecta patrones
 * @param {string} userId - UID del usuario
 * @param {number} days - Días a analizar (default: 30)
 * @returns {Object} - Perfil de preferencias del usuario
 */
export const analyzeUserPreferences = async (userId, days = 30) => {
  try {
    console.log(`🔍 Analizando patrones de ${userId} (últimos ${days} días)...`);
    
    // Obtener últimos N días de foodLogs
    const foodLogsRef = collection(db, 'users', userId, 'foodLogs');
    const q = query(foodLogsRef, orderBy('updatedAt', 'desc'), limit(days));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('⚠️ No hay datos suficientes para análisis');
      return null;
    }
    
    // Contadores de análisis
    const foodFrequency = {}; // {nombreAlimento: cantidad}
    const mealTimePatterns = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let daysAnalyzed = 0;
    
    // Procesar cada día
    snapshot.forEach((doc) => {
      const data = doc.data();
      daysAnalyzed++;
      
      // Analizar cada comida del día
      if (data.meals) {
        Object.entries(data.meals).forEach(([mealType, foods]) => {
          if (Array.isArray(foods)) {
            foods.forEach(food => {
              // Contar frecuencia de alimentos
              const foodName = food.name || 'Desconocido';
              foodFrequency[foodName] = (foodFrequency[foodName] || 0) + 1;
              
              // Acumular macros
              totalCalories += food.calories || 0;
              totalProtein += food.protein || 0;
              totalCarbs += food.carbs || 0;
              totalFat += food.fat || 0;
              
              // Registrar alimentos por tipo de comida
              mealTimePatterns[mealType].push(foodName);
            });
          }
        });
      }
    });
    
    // Calcular top alimentos favoritos
    const sortedFoods = Object.entries(foodFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
    
    const favoriteFoods = sortedFoods.map(([name, count]) => ({
      name,
      frequency: count,
      percentage: Math.round((count / daysAnalyzed) * 100)
    }));
    
    // Detectar alimentos por comida
    const breakfastFavorites = getTopItems(mealTimePatterns.breakfast, 5);
    const lunchFavorites = getTopItems(mealTimePatterns.lunch, 5);
    const dinnerFavorites = getTopItems(mealTimePatterns.dinner, 5);
    
    // Calcular promedios
    const avgCalories = Math.round(totalCalories / daysAnalyzed);
    const avgProtein = Math.round(totalProtein / daysAnalyzed);
    const avgCarbs = Math.round(totalCarbs / daysAnalyzed);
    const avgFat = Math.round(totalFat / daysAnalyzed);
    
    // Detectar preferencias macro
    const totalMacros = avgProtein * 4 + avgCarbs * 4 + avgFat * 9;
    const macroPreferences = {
      protein: Math.round((avgProtein * 4 / totalMacros) * 100),
      carbs: Math.round((avgCarbs * 4 / totalMacros) * 100),
      fat: Math.round((avgFat * 9 / totalMacros) * 100)
    };
    
    // Determinar tipo de dieta predominante
    let dietType = 'Balanceada';
    if (macroPreferences.protein > 35) dietType = 'Alta en Proteína';
    else if (macroPreferences.carbs > 50) dietType = 'Alta en Carbohidratos';
    else if (macroPreferences.fat > 35) dietType = 'Alta en Grasas';
    
    const preferences = {
      daysAnalyzed,
      favoriteFoods,
      mealPatterns: {
        breakfast: breakfastFavorites,
        lunch: lunchFavorites,
        dinner: dinnerFavorites
      },
      averages: {
        calories: avgCalories,
        protein: avgProtein,
        carbs: avgCarbs,
        fat: avgFat
      },
      macroPreferences,
      dietType,
      lastAnalyzed: new Date().toISOString()
    };
    
    // Guardar en Firebase
    await saveUserPreferences(userId, preferences);
    
    console.log('✅ Análisis completado:', preferences);
    return preferences;
    
  } catch (error) {
    console.error('❌ Error en análisis de usuario:', error);
    return null;
  }
};

/**
 * Obtiene los items más frecuentes de un array
 */
const getTopItems = (arr, top = 5) => {
  const frequency = {};
  arr.forEach(item => {
    frequency[item] = (frequency[item] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([name, count]) => ({ name, count }));
};

/**
 * Guarda las preferencias del usuario en Firebase
 */
const saveUserPreferences = async (userId, preferences) => {
  try {
    const prefsRef = doc(db, 'users', userId, 'analytics', 'preferences');
    await setDoc(prefsRef, preferences);
    console.log('💾 Preferencias guardadas en Firebase');
  } catch (error) {
    console.error('❌ Error guardando preferencias:', error);
  }
};

/**
 * Obtiene las preferencias guardadas del usuario
 */
export const getUserPreferences = async (userId) => {
  try {
    const prefsRef = doc(db, 'users', userId, 'analytics', 'preferences');
    const snapshot = await getDoc(prefsRef);
    
    if (snapshot.exists()) {
      return snapshot.data();
    }
    
    // Si no existen, hacer análisis nuevo
    return await analyzeUserPreferences(userId);
  } catch (error) {
    console.error('❌ Error obteniendo preferencias:', error);
    return null;
  }
};

/**
 * Genera sugerencias personalizadas basadas en el historial
 */
export const getPersonalizedSuggestions = (preferences, mealType, currentTime) => {
  if (!preferences) return [];
  
  const suggestions = [];
  
  // Sugerencias basadas en comidas favoritas del tipo de comida actual
  const mealFavorites = preferences.mealPatterns?.[mealType] || [];
  
  if (mealFavorites.length > 0) {
    suggestions.push({
      type: 'frequent',
      title: `Tus favoritos para ${mealType}`,
      items: mealFavorites.slice(0, 3).map(f => f.name)
    });
  }
  
  // Sugerencias basadas en déficit de macros
  if (preferences.macroPreferences) {
    if (preferences.macroPreferences.protein < 25) {
      suggestions.push({
        type: 'macro',
        title: 'Aumenta tu proteína',
        message: 'Normalmente consumes poca proteína. Considera agregar pollo, huevos o pescado.'
      });
    }
  }
  
  // Sugerencias basadas en alimentos top
  const topFoods = preferences.favoriteFoods?.slice(0, 5) || [];
  if (topFoods.length > 0) {
    suggestions.push({
      type: 'top',
      title: 'Tus alimentos más consumidos',
      items: topFoods.map(f => `${f.name} (${f.percentage}% de los días)`)
    });
  }
  
  return suggestions;
};

/**
 * Genera contexto personalizado para Gemini AI
 */
export const generatePersonalizedContext = (userProfile, preferences, foodData) => {
  let context = `\n\n=== PERFIL PERSONALIZADO DEL USUARIO ===\n`;
  
  // Información básica DEL PERFIL INICIAL
  if (userProfile) {
    context += `\n📋 DATOS PERSONALES:\n`;
    context += `Nombre: ${userProfile.name}\n`;
    context += `Edad: ${userProfile.age || 'No especificada'} años\n`;
    context += `Género: ${userProfile.gender === 'male' ? 'Hombre' : 'Mujer'}\n`;
    context += `Peso actual: ${userProfile.weight || 'No registrado'} kg\n`;
    context += `Altura: ${userProfile.height || 'No registrada'} cm\n`;
    context += `IMC: ${userProfile.imc || 'No calculado'} (${userProfile.imcCategory || ''})\n`;
    
    context += `\n🎯 OBJETIVO Y PLAN:\n`;
    context += `Objetivo: ${userProfile.goal === 'lose' ? 'PÉRDIDA DE PESO' : userProfile.goal === 'gain' ? 'GANANCIA DE MÚSCULO' : 'MANTENER PESO'}\n`;
    context += `Nivel de actividad: ${
      userProfile.activityLevel === 'sedentary' ? 'SEDENTARIO (poco o ningún ejercicio)' :
      userProfile.activityLevel === 'light' ? 'LIGERO (ejercicio 1-3 días/semana)' :
      userProfile.activityLevel === 'moderate' ? 'MODERADO (ejercicio 3-5 días/semana)' :
      userProfile.activityLevel === 'active' ? 'ACTIVO (ejercicio 6-7 días/semana)' :
      userProfile.activityLevel === 'veryActive' ? 'MUY ACTIVO (ejercicio intenso diario)' :
      'No especificado'
    }\n`;
    context += `Meta calórica diaria: ${userProfile.dailyCalories || userProfile.calorieGoal || 'No calculada'} kcal\n`;
    const macros = userProfile.dailyMacros || userProfile.macros;
    context += `Macros objetivo: P:${macros?.protein || '?'}g | C:${macros?.carbs || '?'}g | G:${macros?.fat || '?'}g\n`;
    
    if (userProfile.allergies) {
      context += `⚠️ ALERGIAS: ${userProfile.allergies}\n`;
    }
    if (userProfile.chronicDiseases) {
      context += `⚠️ ENFERMEDADES CRÓNICAS: ${userProfile.chronicDiseases}\n`;
    }
    
    // ALIMENTOS SELECCIONADOS EN FOODSELECTION
    if (userProfile.selectedFoods && Object.keys(userProfile.selectedFoods).length > 0) {
      context += `\n🍎 ALIMENTOS QUE LE GUSTAN (seleccionados en perfil):\n`;
      const selectedFoodsList = [];
      Object.entries(userProfile.selectedFoods).forEach(([category, foodIds]) => {
        if (foodIds && foodIds.length > 0) {
          selectedFoodsList.push(...foodIds);
        }
      });
      if (selectedFoodsList.length > 0) {
        context += `Total de alimentos favoritos: ${selectedFoodsList.length}\n`;
        context += `Categorías preferidas: ${Object.keys(userProfile.selectedFoods).join(', ')}\n`;
      }
    }
  }
  
  // Preferencias detectadas
  if (preferences) {
    context += `\nPATRONES DETECTADOS (${preferences.daysAnalyzed} días analizados):\n`;
    context += `Tipo de dieta: ${preferences.dietType}\n`;
    context += `Promedio diario: ${preferences.averages.calories} kcal (P:${preferences.averages.protein}g C:${preferences.averages.carbs}g G:${preferences.averages.fat}g)\n`;
    
    // Alimentos favoritos
    if (preferences.favoriteFoods?.length > 0) {
      context += `\nALIMENTOS MÁS CONSUMIDOS:\n`;
      preferences.favoriteFoods.slice(0, 5).forEach(food => {
        context += `- ${food.name} (${food.percentage}% de los días)\n`;
      });
    }
    
    // Patrones por comida
    if (preferences.mealPatterns?.breakfast?.length > 0) {
      context += `\nDESAYUNOS HABITUALES: ${preferences.mealPatterns.breakfast.slice(0, 3).map(f => f.name).join(', ')}\n`;
    }
    if (preferences.mealPatterns?.lunch?.length > 0) {
      context += `ALMUERZOS HABITUALES: ${preferences.mealPatterns.lunch.slice(0, 3).map(f => f.name).join(', ')}\n`;
    }
  }
  
  // Registro del día actual
  if (foodData?.meals) {
    const allFoods = Object.values(foodData.meals).flat();
    if (allFoods.length > 0) {
      context += `\nREGISTRO DE HOY:\n`;
      Object.entries(foodData.meals).forEach(([mealType, foods]) => {
        if (foods.length > 0) {
          context += `${mealType}: ${foods.map(f => f.name).join(', ')}\n`;
        }
      });
      
      const totalCals = allFoods.reduce((sum, f) => sum + (f.calories || 0), 0);
      context += `Total consumido hoy: ${totalCals} kcal\n`;
    }
  }
  
  context += `\n=== FIN DEL PERFIL ===\n\n`;
  context += `🤖 INSTRUCCIONES PARA LA IA:\n`;
  context += `1. USA esta información para dar respuestas PERSONALIZADAS adaptadas a ${userProfile?.name || 'este usuario'}\n`;
  context += `2. Considera su objetivo (${userProfile?.goal === 'lose' ? 'PÉRDIDA DE PESO' : userProfile?.goal === 'gain' ? 'GANANCIA MUSCULAR' : 'MANTENIMIENTO'})\n`;
  context += `3. Ajusta recomendaciones a su nivel de actividad (${userProfile?.activityLevel || 'no especificado'})\n`;
  context += `4. Sugiere alimentos que le gustan (revisa sus alimentos favoritos arriba)\n`;
  context += `5. Compara su consumo actual con su meta de ${userProfile?.dailyCalories || userProfile?.calorieGoal || '?'} kcal\n`;
  context += `6. Si tiene alergias o enfermedades crónicas, EVITA alimentos contraindicados\n`;
  context += `7. Habla como un ASESOR FITNESS amigable y cercano, usa TÚ y sé conversacional\n`;
  context += `8. Usa emojis para hacer la conversación más amena y fácil de leer\n`;
  context += `9. NO uses lenguaje muy formal o legal, habla como un amigo experto en nutrición\n`;
  context += `10. Si pregunta por recomendaciones, sugiere alimentos de su lista de favoritos\n\n`;
  
  context += `🚨 PROTOCOLOS DE SEGURIDAD Y ÉTICA (OBLIGATORIO):\n`;
  context += `1. NUNCA recomiendes pérdida de peso mayor a 1 kg por semana\n`;
  context += `2. NUNCA sugieras dietas menores a 1200 kcal (mujeres) o 1500 kcal (hombres)\n`;
  context += `3. NUNCA recomiendes eliminar grupos alimenticios completos (carbohidratos, grasas, proteínas)\n`;
  context += `4. NUNCA sugieras ayunos extremos o saltar comidas regularmente\n`;
  context += `5. NUNCA recomiendes ejercicio excesivo (más de 2 horas diarias)\n`;
  context += `6. NUNCA menciones pastillas, laxantes o supresores de apetito\n`;
  context += `7. Si detectas signos de trastorno alimenticio, deriva a profesional de salud mental de forma empática\n`;
  context += `8. Si la pregunta es médica seria (dolor, síntomas), recomienda ver a un médico pero de forma amigable\n`;
  context += `9. SIEMPRE enfatiza sostenibilidad sobre resultados rápidos\n`;
  context += `10. SIEMPRE prioriza salud mental y física sobre estética\n\n`;
  
  context += `⚠️ ADVERTENCIAS OBLIGATORIAS EN RESPUESTAS DE RIESGO:\n`;
  context += `- Si preguntan por pérdida rápida: Explica riesgos de forma conversacional (músculo, metabolismo, rebote)\n`;
  context += `- Si preguntan por calorías muy bajas: Advierte desnutrición pero sin sonar alarmista\n`;
  context += `- Si preguntan por eliminar macros: Explica importancia de forma práctica y entendible\n`;
  context += `- Si preguntan por suplementos dudosos: Recomienda comida real de forma persuasiva\n`;
  context += `- Si sospechas TCA: Muestra empatía y recomienda ayuda profesional:\n`;
  context += `  * "Hermano/a, esto suena serio. Te recomiendo hablar con un profesional."\n`;
  context += `  * Línea EsSalud Perú: 107 (gratuita)\n`;
  context += `  * MINSA Salud Mental: (01) 284-1349\n\n`;
  
  context += `✅ TONO Y ESTILO:\n`;
  context += `- Habla como un ASESOR FITNESS experimentado pero cercano\n`;
  context += `- Usa "hermano", "bro", "crack" ocasionalmente para ser más natural\n`;
  context += `- Explica las cosas de forma SIMPLE y práctica, no técnica\n`;
  context += `- Motiva y celebra los logros del usuario\n`;
  context += `- Si algo está mal, corrígelo pero sin juzgar\n`;
  context += `- Usa ejemplos prácticos de comida peruana\n`;
  context += `- Termina con preguntas abiertas para seguir la conversación\n\n`;
  
  context += `✅ ENFOQUE CORRECTO:\n`;
  context += `- Promueve déficits moderados (300-500 kcal) - "Tranqui, no te mates de hambre"\n`;
  context += `- Sugiere ejercicio balanceado - "3-4 días de gym está perfecto, no te sobreentrenes"\n`;
  context += `- Enfatiza descanso - "El músculo crece durmiendo, no en el gym"\n`;
  context += `- Recomienda proteína adecuada - "Mete pollo, huevos, pescado en cada comida"\n`;
  context += `- Valida progreso lento - "Mejor lento y seguro que rápido y con rebote"\n`;
  context += `- Promueve relación saludable con la comida - "Disfruta tu comida, no es tu enemiga"\n\n`;
  
  context += `📝 DISCLAIMER (solo cuando sea necesario, de forma natural):\n`;
  context += `"Ojo, esto es orientación general. Si tienes algo médico serio o quieres un plan súper personalizado, mejor consulta con un nutricionista. Yo te doy la guía, ellos el plan exacto 💪"\n\n`;
  
  return context;
};
