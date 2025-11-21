// Sistema de recomendaciones nutricionales variadas
// Ofrece múltiples alternativas para cada tipo de comida/objetivo nutricional

import { findFoods } from '../data/nutritionIndex';

// Grupos de alimentos similares nutricional y funcionalmente
const foodGroups = {
  proteinas_magras: {
    name: 'Proteínas Magras',
    searchTerms: ['chicken breast', 'fish', 'tuna', 'salmon', 'turkey', 'egg white', 'tofu'],
    alternatives: ['pollo', 'pescado', 'atún', 'salmón', 'pavo', 'clara de huevo', 'tofu', 'quinoa'],
    macroProfile: { protein: 'high', fat: 'low', carbs: 'low' }
  },
  proteinas_completas: {
    name: 'Proteínas Completas',
    searchTerms: ['beef', 'pork', 'lamb', 'cheese', 'milk', 'yogurt', 'eggs'],
    alternatives: ['res', 'cerdo', 'cordero', 'queso', 'leche', 'yogurt', 'huevos', 'pescado graso'],
    macroProfile: { protein: 'high', fat: 'medium', carbs: 'low' }
  },
  carbohidratos_complejos: {
    name: 'Carbohidratos Complejos',
    searchTerms: ['rice', 'oats', 'quinoa', 'sweet potato', 'potato', 'bread', 'pasta'],
    alternatives: ['arroz integral', 'avena', 'quinoa', 'camote', 'papa', 'pan integral', 'pasta integral'],
    macroProfile: { protein: 'medium', fat: 'low', carbs: 'high' }
  },
  frutas_energeticas: {
    name: 'Frutas Energéticas',
    searchTerms: ['banana', 'apple', 'orange', 'mango', 'pineapple', 'grapes'],
    alternatives: ['plátano', 'manzana', 'naranja', 'mango', 'piña', 'uvas', 'fresas', 'kiwi'],
    macroProfile: { protein: 'low', fat: 'low', carbs: 'high' }
  },
  verduras_verdes: {
    name: 'Verduras Verdes',
    searchTerms: ['spinach', 'broccoli', 'lettuce', 'kale', 'green beans'],
    alternatives: ['espinaca', 'brócoli', 'lechuga', 'col rizada', 'vainitas', 'acelga', 'apio'],
    macroProfile: { protein: 'low', fat: 'low', carbs: 'low' }
  },
  verduras_coloridas: {
    name: 'Verduras Coloridas',
    searchTerms: ['carrot', 'pepper', 'tomato', 'cucumber', 'beet'],
    alternatives: ['zanahoria', 'pimiento', 'tomate', 'pepino', 'remolacha', 'calabaza', 'berenjena'],
    macroProfile: { protein: 'low', fat: 'low', carbs: 'medium' }
  },
  grasas_saludables: {
    name: 'Grasas Saludables',
    searchTerms: ['avocado', 'olive oil', 'nuts', 'almonds', 'salmon', 'chia'],
    alternatives: ['aguacate', 'aceite de oliva', 'nueces', 'almendras', 'salmón', 'chía', 'semillas'],
    macroProfile: { protein: 'medium', fat: 'high', carbs: 'low' }
  },
  snacks_saludables: {
    name: 'Snacks Saludables',
    searchTerms: ['yogurt', 'fruit', 'nuts', 'berries', 'cheese'],
    alternatives: ['yogurt griego', 'frutas', 'frutos secos', 'berries', 'queso bajo grasa', 'hummus'],
    macroProfile: { protein: 'medium', fat: 'medium', carbs: 'medium' }
  }
};

// Momentos del día y sus necesidades nutricionales
const mealTypes = {
  desayuno: {
    name: 'Desayuno',
    priority: ['carbohidratos_complejos', 'proteinas_completas', 'frutas_energeticas'],
    avoid: [],
    calorieRatio: 0.25
  },
  almuerzo: {
    name: 'Almuerzo',
    priority: ['proteinas_magras', 'carbohidratos_complejos', 'verduras_coloridas', 'grasas_saludables'],
    avoid: [],
    calorieRatio: 0.35
  },
  cena: {
    name: 'Cena',
    priority: ['proteinas_magras', 'verduras_verdes', 'verduras_coloridas'],
    avoid: ['carbohidratos_complejos'],
    calorieRatio: 0.25
  },
  snack: {
    name: 'Snack',
    priority: ['snacks_saludables', 'frutas_energeticas'],
    avoid: [],
    calorieRatio: 0.15
  }
};

// Objetivos nutricionales y sus prioridades
const nutritionGoals = {
  perdida_peso: {
    name: 'Pérdida de Peso',
    priority: ['proteinas_magras', 'verduras_verdes', 'verduras_coloridas'],
    moderate: ['grasas_saludables', 'frutas_energeticas'],
    limit: ['carbohidratos_complejos']
  },
  ganancia_muscular: {
    name: 'Ganancia Muscular',
    priority: ['proteinas_completas', 'proteinas_magras', 'carbohidratos_complejos'],
    moderate: ['grasas_saludables'],
    limit: []
  },
  mantenimiento: {
    name: 'Mantenimiento',
    priority: ['proteinas_magras', 'carbohidratos_complejos', 'verduras_coloridas', 'grasas_saludables'],
    moderate: ['frutas_energeticas', 'snacks_saludables'],
    limit: []
  },
  energia_deportiva: {
    name: 'Energía Deportiva',
    priority: ['carbohidratos_complejos', 'proteinas_completas', 'frutas_energeticas'],
    moderate: ['grasas_saludables'],
    limit: []
  }
};

/**
 * Genera recomendaciones variadas para un momento específico
 * @param {string} mealType - Tipo de comida (desayuno, almuerzo, cena, snack)
 * @param {string} goal - Objetivo nutricional
 * @param {Array} excludedFoods - Alimentos que el usuario no quiere
 * @param {number} optionsPerGroup - Número de opciones por grupo de alimentos
 * @returns {Promise<Object>} Recomendaciones organizadas por grupos
 */
export const generateVariedRecommendations = async (
  mealType = 'almuerzo',
  goal = 'mantenimiento',
  excludedFoods = [],
  optionsPerGroup = 3
) => {
  const meal = mealTypes[mealType] || mealTypes.almuerzo;
  const goalConfig = nutritionGoals[goal] || nutritionGoals.mantenimiento;
  
  const recommendations = {};
  const excludedNames = excludedFoods.map(f => f.toLowerCase());
  
  // Combinar prioridades del momento del día y objetivo nutricional
  const priorityGroups = [...new Set([...meal.priority, ...goalConfig.priority])];
  
  for (const groupId of priorityGroups) {
    const group = foodGroups[groupId];
    if (!group) continue;
    
    // Buscar alternativas para este grupo
    const allOptions = [];
    
    // Buscar usando términos en inglés y alternativas en español
    for (const term of [...group.searchTerms, ...group.alternatives]) {
      try {
        const results = await findFoods(term, 10);
        allOptions.push(...results);
      } catch (error) {
        console.warn(`Error buscando ${term}:`, error);
      }
    }
    
    // Filtrar duplicados y excluidos
    const uniqueOptions = allOptions
      .filter((food, index, self) => 
        index === self.findIndex(f => f.nombre === food.nombre || f.nombre_es === food.nombre_es)
      )
      .filter(food => {
        const name = (food.nombre_es || food.nombre || '').toLowerCase();
        return !excludedNames.some(excluded => name.includes(excluded));
      })
      .slice(0, optionsPerGroup * 2); // Obtener más opciones para tener variedad
    
    if (uniqueOptions.length > 0) {
      recommendations[groupId] = {
        groupName: group.name,
        macroProfile: group.macroProfile,
        options: uniqueOptions.slice(0, optionsPerGroup),
        alternativeOptions: uniqueOptions.slice(optionsPerGroup, optionsPerGroup * 2)
      };
    }
  }
  
  return {
    mealType: meal.name,
    goal: goalConfig.name,
    recommendations,
    totalGroups: Object.keys(recommendations).length
  };
};

/**
 * Obtiene alternativas para un alimento específico que el usuario rechazó
 * @param {Object} rejectedFood - Alimento rechazado
 * @param {string} mealType - Tipo de comida
 * @param {number} limit - Número máximo de alternativas
 * @returns {Promise<Array>} Lista de alimentos alternativos
 */
export const getAlternatives = async (rejectedFood, mealType = 'almuerzo', limit = 5) => {
  // Identificar el grupo nutricional del alimento rechazado
  const foodName = (rejectedFood.nombre_es || rejectedFood.nombre || '').toLowerCase();
  
  let matchedGroup = null;
  for (const [groupId, group] of Object.entries(foodGroups)) {
    const isMatch = group.searchTerms.some(term => foodName.includes(term.toLowerCase())) ||
                   group.alternatives.some(alt => foodName.includes(alt.toLowerCase()));
    
    if (isMatch) {
      matchedGroup = { id: groupId, ...group };
      break;
    }
  }
  
  if (!matchedGroup) {
    // Si no encontramos grupo específico, buscar por categoría nutricional similar
    const calorias = rejectedFood.calorias || 0;
    const proteina = rejectedFood.proteina || 0;
    const carbohidratos = rejectedFood.carbohidratos || 0;
    const grasa = rejectedFood.grasa_total || 0;
    
    // Buscar alimentos con perfil nutricional similar
    return await findFoods('', limit * 2);
  }
  
  // Buscar alternativas del mismo grupo
  const alternatives = [];
  const rejectedName = foodName;
  
  for (const term of [...matchedGroup.searchTerms, ...matchedGroup.alternatives]) {
    if (term.toLowerCase() === rejectedName) continue; // Evitar el mismo alimento
    
    try {
      const results = await findFoods(term, 3);
      alternatives.push(...results);
    } catch (error) {
      console.warn(`Error buscando alternativa ${term}:`, error);
    }
  }
  
  // Filtrar duplicados y el alimento rechazado
  const uniqueAlternatives = alternatives
    .filter((food, index, self) => 
      index === self.findIndex(f => f.nombre === food.nombre || f.nombre_es === food.nombre_es)
    )
    .filter(food => {
      const name = (food.nombre_es || food.nombre || '').toLowerCase();
      return name !== rejectedName;
    })
    .slice(0, limit);
  
  return uniqueAlternatives;
};

/**
 * Genera un plan de comidas completo con múltiples opciones
 * @param {Object} userProfile - Perfil del usuario
 * @param {string} goal - Objetivo nutricional
 * @param {Array} preferences - Preferencias alimentarias
 * @param {Array} restrictions - Restricciones/alergias
 * @returns {Promise<Object>} Plan de comidas con alternativas
 */
export const generateMealPlanWithAlternatives = async (
  userProfile,
  goal = 'mantenimiento',
  preferences = [],
  restrictions = []
) => {
  const mealPlan = {};
  const meals = ['desayuno', 'snack', 'almuerzo', 'cena'];
  
  for (const meal of meals) {
    mealPlan[meal] = await generateVariedRecommendations(
      meal,
      goal,
      restrictions,
      3 // 3 opciones por grupo
    );
  }
  
  return {
    userProfile,
    goal,
    preferences,
    restrictions,
    mealPlan,
    generatedAt: new Date().toISOString()
  };
};

export default {
  generateVariedRecommendations,
  getAlternatives,
  generateMealPlanWithAlternatives,
  foodGroups,
  mealTypes,
  nutritionGoals
};