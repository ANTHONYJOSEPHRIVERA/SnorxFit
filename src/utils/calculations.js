import { foodCategories } from '../data/foodGallery';

// Devuelve el IMC con una precisión de 1 decimal. Maneja valores faltantes o inválidos.
export const calculateBMI = (weight, height) => {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  if (!w || !h || h <= 0) return '0.0';
  const heightInMeters = h / 100;
  const bmi = w / (heightInMeters * heightInMeters);
  if (!isFinite(bmi)) return '0.0';
  return bmi.toFixed(1);
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { category: 'Bajo peso', color: 'text-blue-600' };
  if (bmi < 25) return { category: 'Peso normal', color: 'text-green-600' };
  if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-600' };
  return { category: 'Obesidad', color: 'text-red-600' };
};

export const calculateBMR = (weight, height, age, gender) => {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseInt(age, 10);
  if (!w || !h || !a) return 0;
  if (gender === 'male') {
    return Math.round(88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a));
  }
  // Default: fórmula femenina si no es 'male'
  return Math.round(447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a));
};

export const calculateDailyCalories = (bmr, activityLevel, goal = 'maintain') => {
  const base = parseFloat(bmr) || 0;
  if (base === 0) return 0;
  
  // Multiplicadores por nivel de actividad
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };
  
  const m = multipliers[activityLevel] || multipliers.sedentary;
  let tdee = base * m; // Total Daily Energy Expenditure (calorías de mantenimiento)
  
  // Ajustar según objetivo
  if (goal === 'lose') {
    // Déficit calórico: -500 kcal para perder ~0.5kg por semana
    return Math.round(tdee - 500);
  } else if (goal === 'gain') {
    // Superávit calórico: +300 kcal para ganar músculo de forma controlada
    return Math.round(tdee + 300);
  } else {
    // Mantener peso actual
    return Math.round(tdee);
  }
};

/**
 * Calcula la distribución de macronutrientes según objetivo y peso
 * @param {number} dailyCalories - Calorías diarias totales
 * @param {number} weight - Peso corporal en kg
 * @param {string} goal - Objetivo: 'lose', 'gain', 'maintain'
 * @returns {object} { protein, carbs, fat } en gramos
 */
export const calculateMacros = (dailyCalories, weight, goal = 'maintain') => {
  const calories = parseFloat(dailyCalories) || 0;
  const bodyWeight = parseFloat(weight) || 70;
  
  if (calories === 0) {
    return { protein: 0, carbs: 0, fat: 0 };
  }
  
  let proteinGrams, fatGrams, carbsGrams;
  
  if (goal === 'lose') {
    // Perder peso: Alta proteína para preservar músculo
    // Proteína: 2.2g por kg de peso (35% calorías)
    // Grasa: 25% calorías
    // Carbohidratos: 40% calorías
    proteinGrams = Math.round(bodyWeight * 2.2);
    fatGrams = Math.round((calories * 0.25) / 9); // 9 kcal por gramo de grasa
    
    const proteinCals = proteinGrams * 4;
    const fatCals = fatGrams * 9;
    const carbsCals = calories - proteinCals - fatCals;
    carbsGrams = Math.round(carbsCals / 4); // 4 kcal por gramo de carbohidrato
    
  } else if (goal === 'gain') {
    // Ganar músculo: Proteína alta + carbohidratos altos
    // Proteína: 2.0g por kg de peso (30% calorías)
    // Grasa: 25% calorías
    // Carbohidratos: 45% calorías
    proteinGrams = Math.round(bodyWeight * 2.0);
    fatGrams = Math.round((calories * 0.25) / 9);
    
    const proteinCals = proteinGrams * 4;
    const fatCals = fatGrams * 9;
    const carbsCals = calories - proteinCals - fatCals;
    carbsGrams = Math.round(carbsCals / 4);
    
  } else {
    // Mantener: Distribución balanceada
    // Proteína: 1.8g por kg de peso (30% calorías)
    // Grasa: 30% calorías
    // Carbohidratos: 40% calorías
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
};

export const getRecommendedPlan = (bmi, goal) => {
  if (goal === 'lose') return 'weightLoss';
  if (goal === 'gain') return 'muscleGain';
  return 'maintenance';
};

export const generateWorkoutPlan = (fitnessLevel, goal, availableTime) => {
  const plans = {
    beginner: {
      lose: ['cardio-2', 'strength-2', 'flexibility-2'],
      gain: ['strength-1', 'strength-2', 'strength-3'],
      maintain: ['cardio-1', 'strength-2', 'flexibility-1']
    },
    intermediate: {
      lose: ['cardio-1', 'cardio-3', 'strength-1', 'flexibility-1', 'cardio-4'],
      gain: ['strength-1', 'strength-2', 'strength-3', 'cardio-2', 'strength-4'],
      maintain: ['cardio-1', 'strength-2', 'flexibility-1', 'flexibility-3']
    },
    advanced: {
      lose: ['cardio-1', 'cardio-3', 'strength-1', 'strength-2', 'flexibility-1', 'cardio-5', 'strength-5'],
      gain: ['strength-1', 'strength-2', 'strength-3', 'cardio-1', 'flexibility-2', 'strength-4', 'strength-5'],
      maintain: ['cardio-1', 'cardio-3', 'strength-1', 'strength-2', 'flexibility-1', 'flexibility-3', 'cardio-4']
    }
  };

  return plans[fitnessLevel]?.[goal] || plans.beginner.maintain;
};

export const generateCustomMealPlan = (selectedFoods, dailyCalories) => {
  const plan = {
    name: 'Plan Personalizado',
    dailyCalories: dailyCalories,
    meals: []
  };

  const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner'];
  const caloriesPerMealTarget = dailyCalories / mealTypes.length;

  // Flatten selected foods and get their full data
  const allSelectedFoodItems = Object.keys(selectedFoods).flatMap(categoryId => {
    const category = foodCategories.find(cat => cat.id === categoryId);
    if (!category) return [];
    return selectedFoods[categoryId].map(foodId => category.items.find(item => item.id === foodId)).filter(Boolean);
  });

  // If no foods were selected, return a generic plan
  if (allSelectedFoodItems.length === 0) {
    return {
      name: 'Plan Básico (Sin Preferencias)',
      dailyCalories: dailyCalories,
      meals: mealTypes.map(type => ({
        type: type,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Básico`,
        calories: Math.round(caloriesPerMealTarget),
        foods: ['Alimentos variados y balanceados'],
        description: 'Por favor, selecciona tus alimentos preferidos para un plan más personalizado.'
      }))
    };
  }

  // Group selected foods by type (e.g., protein, carb, fat source) for better meal generation
  // Using a more robust classification based on typical food groups
  const proteinSources = allSelectedFoodItems.filter(f => ['meats', 'legumes', 'dairy'].includes(foodCategories.find(cat => cat.items.some(item => item.id === f.id)).id));
  const carbSources = allSelectedFoodItems.filter(f => ['grains', 'fruits', 'vegetables'].includes(foodCategories.find(cat => cat.items.some(item => item.id === f.id)).id));
  const fatSources = allSelectedFoodItems.filter(f => ['nutsSeeds', 'dairy'].includes(foodCategories.find(cat => cat.items.some(item => item.id === f.id)).id));
  const arequipaDishes = allSelectedFoodItems.filter(f => ['arequipaDishes'].includes(foodCategories.find(cat => cat.items.some(item => item.id === f.id)).id));
  const arequipaDesserts = allSelectedFoodItems.filter(f => ['arequipaDesserts'].includes(foodCategories.find(cat => cat.items.some(item => item.id === f.id)).id));

  mealTypes.forEach(type => {
    let currentMealCalories = 0;
    const mealFoods = [];
    const addedFoodIds = new Set(); // To prevent adding the same food multiple times in one meal

    const addFood = (foodList, maxCount = 1) => {
      let count = 0;
      // Shuffle and filter out already added foods
      const availableForSelection = foodList.filter(f => !addedFoodIds.has(f.id)).sort(() => 0.5 - Math.random());
      
      for (const food of availableForSelection) {
        // Check if adding this food would exceed a reasonable calorie limit for the meal
        if (currentMealCalories + food.calories <= caloriesPerMealTarget * 1.5) { // Allow 50% overshoot
          mealFoods.push(food.name);
          currentMealCalories += food.calories;
          addedFoodIds.add(food.id);
          count++;
          if (count >= maxCount) break;
        }
      }
    };

    // Prioritize Arequipa dishes if selected for lunch/dinner
    if ((type === 'lunch' || type === 'dinner') && arequipaDishes.length > 0) {
      addFood(arequipaDishes, 1);
    }

    // Build meals based on type and available food groups
    if (type === 'breakfast') {
      addFood(carbSources, 1); // e.g., oats, bread, fruit
      addFood(proteinSources, 1); // e.g., yogurt, milk
      addFood(fatSources, 1); // e.g., nuts, avocado
    } else if (type === 'lunch' || type === 'dinner') {
      if (mealFoods.length === 0) { // If no Arequipa dish was added
        addFood(proteinSources, 1); // e.g., chicken, beef, lentils
        addFood(carbSources, 1); // e.g., rice, quinoa, potato
        addFood(fatSources, 1); // e.g., avocado, cheese
      }
      addFood(allSelectedFoodItems.filter(f => ['vegetables'].includes(foodCategories.find(cat => cat.items.some(item => item.id === f.id)).id)), 1); // Always try to add a vegetable
    } else if (type === 'snack') {
      addFood(allSelectedFoodItems.filter(f => ['fruits', 'nutsSeeds', 'dairy'].includes(foodCategories.find(cat => cat.items.some(item => item.id === f.id)).id)), 1);
      if (arequipaDesserts.length > 0 && Math.random() < 0.5) { // 50% chance for Arequipa dessert in snack
        addFood(arequipaDesserts, 1);
      }
    }

    // If meal is still too low on calories or empty, fill with more general selected foods
    if (mealFoods.length === 0 || currentMealCalories < caloriesPerMealTarget * 0.7) {
      const shuffledAllFoods = allSelectedFoodItems.filter(f => !addedFoodIds.has(f.id)).sort(() => 0.5 - Math.random());
      for (const food of shuffledAllFoods) {
        if (currentMealCalories + food.calories <= caloriesPerMealTarget * 1.5) {
          mealFoods.push(food.name);
          currentMealCalories += food.calories;
          addedFoodIds.add(food.id);
        }
        if (mealFoods.length >= 3 && currentMealCalories >= caloriesPerMealTarget * 0.8) break;
      }
    }

    // Final fallback if still no foods or very few
    if (mealFoods.length === 0) {
      mealFoods.push('No hay suficientes alimentos seleccionados para generar esta comida. Por favor, selecciona más opciones.');
      currentMealCalories = 0;
    }

    plan.meals.push({
      type: type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Personalizado`,
      calories: Math.round(currentMealCalories),
      foods: mealFoods,
      description: 'Tu comida personalizada basada en tus preferencias.'
    });
  });

  return plan;
};