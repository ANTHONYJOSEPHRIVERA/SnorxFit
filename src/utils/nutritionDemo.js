/**
 * Demo y ejemplos del sistema de recomendaciones nutricionales variadas
 * Muestra cómo usar el sistema y datos de ejemplo para testing
 */

import { generateVariedRecommendations, getAlternatives, generateMealPlanWithAlternatives } from './nutritionRecommendations';

// Datos de ejemplo para testing sin necesidad del CSV completo
export const sampleFoods = [
  // Proteínas
  { nombre: 'Chicken Breast', nombre_es: 'Pechuga de Pollo', calorias: 165, proteina: 31, carbohidratos: 0, grasa_total: 3.6 },
  { nombre: 'Salmon', nombre_es: 'Salmón', calorias: 208, proteina: 22, carbohidratos: 0, grasa_total: 12 },
  { nombre: 'Tuna', nombre_es: 'Atún', calorias: 144, proteina: 30, carbohidratos: 0, grasa_total: 1 },
  { nombre: 'Eggs', nombre_es: 'Huevos', calorias: 155, proteina: 13, carbohidratos: 1.1, grasa_total: 11 },
  { nombre: 'Greek Yogurt', nombre_es: 'Yogurt Griego', calorias: 59, proteina: 10, carbohidratos: 3.6, grasa_total: 0.4 },
  
  // Carbohidratos
  { nombre: 'Brown Rice', nombre_es: 'Arroz Integral', calorias: 111, proteina: 2.6, carbohidratos: 22, grasa_total: 0.9 },
  { nombre: 'Oats', nombre_es: 'Avena', calorias: 389, proteina: 16.9, carbohidratos: 66.3, grasa_total: 6.9 },
  { nombre: 'Sweet Potato', nombre_es: 'Camote', calorias: 86, proteina: 1.6, carbohidratos: 20, grasa_total: 0.1 },
  { nombre: 'Quinoa', nombre_es: 'Quinoa', calorias: 120, proteina: 4.4, carbohidratos: 22, grasa_total: 1.9 },
  { nombre: 'Whole Wheat Bread', nombre_es: 'Pan Integral', calorias: 69, proteina: 3.6, carbohidratos: 12, grasa_total: 1.2 },
  
  // Frutas
  { nombre: 'Banana', nombre_es: 'Plátano', calorias: 89, proteina: 1.1, carbohidratos: 23, grasa_total: 0.3 },
  { nombre: 'Apple', nombre_es: 'Manzana', calorias: 52, proteina: 0.3, carbohidratos: 14, grasa_total: 0.2 },
  { nombre: 'Orange', nombre_es: 'Naranja', calorias: 47, proteina: 0.9, carbohidratos: 12, grasa_total: 0.1 },
  { nombre: 'Strawberries', nombre_es: 'Fresas', calorias: 32, proteina: 0.7, carbohidratos: 7.7, grasa_total: 0.3 },
  { nombre: 'Blueberries', nombre_es: 'Arándanos', calorias: 57, proteina: 0.7, carbohidratos: 14, grasa_total: 0.3 },
  
  // Verduras
  { nombre: 'Broccoli', nombre_es: 'Brócoli', calorias: 34, proteina: 2.8, carbohidratos: 7, grasa_total: 0.4 },
  { nombre: 'Spinach', nombre_es: 'Espinaca', calorias: 23, proteina: 2.9, carbohidratos: 3.6, grasa_total: 0.4 },
  { nombre: 'Carrot', nombre_es: 'Zanahoria', calorias: 41, proteina: 0.9, carbohidratos: 10, grasa_total: 0.2 },
  { nombre: 'Bell Pepper', nombre_es: 'Pimiento', calorias: 31, proteina: 1, carbohidratos: 7, grasa_total: 0.3 },
  { nombre: 'Tomato', nombre_es: 'Tomate', calorias: 18, proteina: 0.9, carbohidratos: 3.9, grasa_total: 0.2 },
  
  // Grasas saludables
  { nombre: 'Avocado', nombre_es: 'Aguacate', calorias: 160, proteina: 2, carbohidratos: 9, grasa_total: 15 },
  { nombre: 'Almonds', nombre_es: 'Almendras', calorias: 579, proteina: 21, carbohidratos: 22, grasa_total: 50 },
  { nombre: 'Walnuts', nombre_es: 'Nueces', calorias: 654, proteina: 15, carbohidratos: 14, grasa_total: 65 },
  { nombre: 'Olive Oil', nombre_es: 'Aceite de Oliva', calorias: 884, proteina: 0, carbohidratos: 0, grasa_total: 100 },
  { nombre: 'Chia Seeds', nombre_es: 'Semillas de Chía', calorias: 486, proteina: 17, carbohidratos: 42, grasa_total: 31 }
];

// Ejemplos de uso del sistema
export const demoExamples = {
  // Ejemplo 1: Recomendaciones para desayuno enfocado en pérdida de peso
  breakfastWeightLoss: async () => {
    console.log('🌅 Ejemplo: Desayuno para pérdida de peso');
    try {
      const recommendations = await generateVariedRecommendations('desayuno', 'perdida_peso', [], 3);
      console.log('Recomendaciones:', recommendations);
      return recommendations;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  },

  // Ejemplo 2: Alternativas cuando no te gusta un alimento
  findAlternatives: async () => {
    console.log('🔄 Ejemplo: Buscar alternativas al pollo');
    const chickenFood = sampleFoods.find(f => f.nombre_es === 'Pechuga de Pollo');
    if (chickenFood) {
      try {
        const alternatives = await getAlternatives(chickenFood, 'almuerzo', 5);
        console.log('Alternativas al pollo:', alternatives);
        return alternatives;
      } catch (error) {
        console.error('Error:', error);
        return [];
      }
    }
    return [];
  },

  // Ejemplo 3: Plan completo de comidas con alternativas
  fullMealPlan: async () => {
    console.log('🍽️ Ejemplo: Plan completo de comidas');
    const userProfile = {
      weight: 70,
      height: 175,
      age: 28,
      gender: 'male',
      activityLevel: 'moderate'
    };
    
    try {
      const fullPlan = await generateMealPlanWithAlternatives(
        userProfile,
        'mantenimiento',
        ['vegetales', 'frutas'],
        ['mariscos'] // restricciones
      );
      console.log('Plan completo:', fullPlan);
      return fullPlan;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
};

// Función helper para testing
export const testRecommendationSystem = async () => {
  console.log('🧪 Iniciando pruebas del sistema de recomendaciones...\n');
  
  const results = {
    breakfast: await demoExamples.breakfastWeightLoss(),
    alternatives: await demoExamples.findAlternatives(),
    fullPlan: await demoExamples.fullMealPlan()
  };
  
  console.log('\n✅ Pruebas completadas');
  return results;
};

// Tips de uso para los desarrolladores
export const usageTips = {
  title: '💡 Tips para usar el sistema de recomendaciones variadas',
  tips: [
    {
      tip: 'Objetivos Nutricionales',
      description: 'Usa "perdida_peso" para priorizar proteínas y verduras, "ganancia_muscular" para proteínas y carbohidratos',
      example: 'generateVariedRecommendations("almuerzo", "perdida_peso", [], 3)'
    },
    {
      tip: 'Alimentos Rechazados',
      description: 'Mantén una lista de alimentos que el usuario no quiere para filtrar las recomendaciones',
      example: 'const rejected = [{nombre: "Brócoli", ...}]; generateVariedRecommendations("cena", "mantenimiento", rejected, 3)'
    },
    {
      tip: 'Obtener Alternativas',
      description: 'Cuando el usuario rechaza un alimento, usa getAlternatives() para sugerir opciones similares',
      example: 'const alternatives = await getAlternatives(rejectedFood, "desayuno", 5)'
    },
    {
      tip: 'Personalización',
      description: 'Ajusta las opciones por grupo cambiando el parámetro optionsPerGroup según las necesidades del usuario',
      example: 'generateVariedRecommendations("snack", "energia_deportiva", [], 5) // 5 opciones por grupo'
    },
    {
      tip: 'Integración UI',
      description: 'Combina con FoodRecommendationCard para una interfaz visual atractiva que muestre macros y permita acciones',
      example: '<FoodRecommendationCard food={food} onReject={handleReject} onAdd={handleAdd} />'
    }
  ]
};

export default {
  sampleFoods,
  demoExamples,
  testRecommendationSystem,
  usageTips
};