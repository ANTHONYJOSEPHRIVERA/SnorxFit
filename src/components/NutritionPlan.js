import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Utensils, Clock, Flame, Apple, Coffee, Sun, Moon, RefreshCw, X, ThumbsDown, Shuffle, Check } from 'lucide-react';
import { nutritionDatabase } from '../data/nutrition';
import { findFoods, listCategories } from '../data/nutritionIndex';
import { foodCategories } from '../data/foodGallery';
import { getRecommendedPlan, calculateDailyCalories, calculateBMR, generateCustomMealPlan } from '../utils/calculations';
import { generateVariedRecommendations, getAlternatives, generateMealPlanWithAlternatives } from '../utils/nutritionRecommendations';
import FoodRecommendationCard from './FoodRecommendationCard';

const NutritionPlan = ({ userProfile, onBack = () => {}, selectedFoods }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [currentNutritionPlan, setCurrentNutritionPlan] = useState(null);
  const [foodSearch, setFoodSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // Estado interno para alimentos añadidos manualmente (por id artificial y macros)
  const [addedFoods, setAddedFoods] = useState([]); // {id, nombre, calorias, proteina, carbohidratos, grasa_total}
  const [foodCategory, setFoodCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Estados para recomendaciones variadas
  const [recommendations, setRecommendations] = useState(null);
  const [rejectedFoods, setRejectedFoods] = useState([]);
  const [currentMealType, setCurrentMealType] = useState('almuerzo');
  const [nutritionGoal, setNutritionGoal] = useState('mantenimiento');
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Estados para tracking de consumo
  const [consumedMeals, setConsumedMeals] = useState([]);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [mealAlternatives, setMealAlternatives] = useState({}); // {mealType: [alternatives]}
  const [loadingAlternatives, setLoadingAlternatives] = useState({});

  // Derivar un objeto compatible con generateCustomMealPlan incorporando addedFoods dentro de una categoría virtual
  const buildSelectedFromAdded = () => {
    if (addedFoods.length === 0) return selectedFoods || {};
    // Creamos/inyectamos una categoría virtual 'customAdded'
    const base = { ...(selectedFoods || {}) };
    base.customAdded = addedFoods.map(f => f.id);
    return base;
  };

  const debounceRef = useRef();
  useEffect(() => {
    let active = true;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (foodSearch.trim().length === 0) {
      setSearchResults([]);
      // Aun así si hay categoría seleccionada listamos los primeros
      if (foodCategory) {
        (async () => {
          const res = await findFoods('', 25, { categoria: foodCategory });
          if (active) setSearchResults(res);
        })();
      }
      return;
    }
    debounceRef.current = setTimeout(() => {
      (async () => {
        const res = await findFoods(foodSearch, 25, { categoria: foodCategory || undefined });
        if (active) setSearchResults(res);
      })();
    }, 350);
    return () => { active = false; };
  }, [foodSearch, foodCategory]);

  // Cargar categorías (solo una vez)
  useEffect(()=>{
    (async () => { try { const cats = await listCategories(); setCategories(cats); } catch {/* ignore */} })();
  }, []);

  // Restaurar añadidos desde localStorage
  useEffect(()=>{
    try {
      const stored = localStorage.getItem('snorx_added_foods');
      if (stored) setAddedFoods(JSON.parse(stored));
    } catch {/* ignore */}
  }, []);
  // Persistir
  useEffect(()=>{
    try { localStorage.setItem('snorx_added_foods', JSON.stringify(addedFoods)); } catch {/* ignore */}
  }, [addedFoods]);

  // Cargar consumo guardado
  useEffect(() => {
    try {
      const storedConsumed = localStorage.getItem('snorx_consumed_meals');
      const storedCalories = localStorage.getItem('snorx_consumed_calories');
      
      if (storedConsumed) {
        setConsumedMeals(JSON.parse(storedConsumed));
      }
      if (storedCalories) {
        setConsumedCalories(parseInt(storedCalories) || 0);
      }
    } catch (error) {
      console.error('Error loading consumed meals:', error);
    }
  }, []);

  // Resetear consumo diario (opcional - se puede hacer manualmente)
  const resetDailyConsumption = () => {
    setConsumedMeals([]);
    setConsumedCalories(0);
    try {
      localStorage.removeItem('snorx_consumed_meals');
      localStorage.removeItem('snorx_consumed_calories');
    } catch (error) {
      console.error('Error resetting consumption:', error);
    }
  };

  useEffect(() => {
    const bmr = calculateBMR(userProfile.weight, userProfile.height, userProfile.age, userProfile.gender);
    const dailyCalories = calculateDailyCalories(bmr, userProfile.activityLevel);
    const mergedSelected = buildSelectedFromAdded();
    if (mergedSelected && Object.keys(mergedSelected).some(cat => mergedSelected[cat].length > 0)) {
      // Extend foodCategories con categoría virtual si hay añadidos
      const hasVirtual = foodCategories.some(c => c.id === 'customAdded');
      if (!hasVirtual && addedFoods.length > 0) {
        foodCategories.push({
          id: 'customAdded',
            name: 'Añadidos Manuales',
            image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1974&auto=format&fit=crop',
            items: addedFoods.map(f => ({
              id: f.id,
              name: f.nombre,
              icon: '➕',
              calories: f.calorias || 0,
              protein: f.proteina || 0,
              carbs: f.carbohidratos || 0,
              fat: f.grasa_total || 0
            }))
        });
      } else if (hasVirtual) {
        // Actualiza items
        const idx = foodCategories.findIndex(c => c.id === 'customAdded');
        if (idx !== -1) {
          foodCategories[idx].items = addedFoods.map(f => ({
            id: f.id,
            name: f.nombre,
            icon: '➕',
            calories: f.calorias || 0,
            protein: f.proteina || 0,
            carbs: f.carbohidratos || 0,
            fat: f.grasa_total || 0
          }));
        }
      }
      const customPlan = generateCustomMealPlan(mergedSelected, dailyCalories);
      setCurrentNutritionPlan(customPlan);
    } else {
      const recommendedPlanKey = getRecommendedPlan(0, userProfile.goal);
      setCurrentNutritionPlan(nutritionDatabase.mealPlans[recommendedPlanKey]);
    }
  }, [userProfile, selectedFoods, addedFoods]);

  if (!currentNutritionPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-white">
        <p className="text-xl font-semibold">Cargando tu plan nutricional...</p>
      </div>
    );
  }

  const getMealIcon = (type) => {
    switch (type) {
      case 'breakfast': return Sun;
      case 'lunch': return Utensils;
      case 'snack': return Apple;
      case 'dinner': return Moon;
      default: return Utensils;
    }
  };

  const getMealTime = (type) => {
    switch (type) {
      case 'breakfast': return '7:00 - 9:00 AM';
      case 'lunch': return '12:00 - 2:00 PM';
      case 'snack': return '4:00 - 5:00 PM';
      case 'dinner': return '7:00 - 9:00 PM';
      default: return '';
    }
  };

  const getMealColor = (type) => {
    switch (type) {
      case 'breakfast': return 'from-yellow-500 to-orange-500';
      case 'lunch': return 'from-green-500 to-teal-500';
      case 'snack': return 'from-purple-500 to-pink-500';
      case 'dinner': return 'from-blue-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Funciones para el sistema de recomendaciones variadas
  const loadRecommendations = async (mealType = currentMealType, goal = nutritionGoal) => {
    setLoadingRecommendations(true);
    try {
      const recs = await generateVariedRecommendations(mealType, goal, rejectedFoods, 3);
      setRecommendations(recs);
      setCurrentMealType(mealType);
      setNutritionGoal(goal);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error cargando recomendaciones:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const rejectFood = async (food) => {
    const newRejected = [...rejectedFoods, food];
    setRejectedFoods(newRejected);
    
    // Obtener alternativas para este alimento
    try {
      const alternatives = await getAlternatives(food, currentMealType, 3);
      
      // Actualizar las recomendaciones con las alternativas
      if (recommendations && alternatives.length > 0) {
        const updatedRecs = { ...recommendations };
        
        // Encontrar el grupo al que pertenece este alimento y reemplazar con alternativas
        Object.keys(updatedRecs.recommendations).forEach(groupId => {
          const group = updatedRecs.recommendations[groupId];
          const foodIndex = group.options.findIndex(f => 
            f.nombre === food.nombre || f.nombre_es === food.nombre_es
          );
          
          if (foodIndex !== -1) {
            // Reemplazar el alimento rechazado con alternativas
            group.options.splice(foodIndex, 1, ...alternatives.slice(0, 1));
            if (group.alternativeOptions) {
              group.alternativeOptions = [...alternatives.slice(1), ...group.alternativeOptions];
            } else {
              group.alternativeOptions = alternatives.slice(1);
            }
          }
        });
        
        setRecommendations(updatedRecs);
      }
    } catch (error) {
      console.error('Error obteniendo alternativas:', error);
    }
  };

  const addFoodFromRecommendations = (food) => {
    const newFood = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nombre: food.nombre_es || food.nombre,
      calorias: food.calorias || 0,
      proteina: food.proteina || 0,
      carbohidratos: food.carbohidratos || 0,
      grasa_total: food.grasa_total || 0,
      fibra: food.fibra || 0,
      azucares: food.azucares || 0
    };
    
    setAddedFoods(prev => [...prev, newFood]);
  };

  const shuffleRecommendations = () => {
    loadRecommendations(currentMealType, nutritionGoal);
  };

  // Funciones para tracking de consumo
  const markMealAsConsumed = (meal) => {
    if (!consumedMeals.find(m => m.type === meal.type)) {
      const newConsumed = [...consumedMeals, meal];
      setConsumedMeals(newConsumed);
      setConsumedCalories(prev => prev + meal.calories);
      
      // Guardar en localStorage
      try {
        localStorage.setItem('snorx_consumed_meals', JSON.stringify(newConsumed));
        localStorage.setItem('snorx_consumed_calories', (consumedCalories + meal.calories).toString());
      } catch (error) {
        console.error('Error saving consumed meals:', error);
      }
    }
  };

  const unmarkMealAsConsumed = (meal) => {
    const newConsumed = consumedMeals.filter(m => m.type !== meal.type);
    setConsumedMeals(newConsumed);
    setConsumedCalories(prev => prev - meal.calories);
    
    // Actualizar localStorage
    try {
      localStorage.setItem('snorx_consumed_meals', JSON.stringify(newConsumed));
      localStorage.setItem('snorx_consumed_calories', (consumedCalories - meal.calories).toString());
    } catch (error) {
      console.error('Error updating consumed meals:', error);
    }
  };

  const isMealConsumed = (mealType) => {
    return consumedMeals.some(m => m.type === mealType);
  };

  // Función para generar alternativas para una comida específica
  const generateMealAlternatives = async (mealType, currentMeal) => {
    setLoadingAlternatives(prev => ({ ...prev, [mealType]: true }));
    
    try {
      // Mapear tipos de comida a nuestro sistema
      const mealTypeMapping = {
        'breakfast': 'desayuno',
        'lunch': 'almuerzo', 
        'dinner': 'cena',
        'snack': 'snack'
      };
      
      const mappedMealType = mealTypeMapping[mealType] || 'almuerzo';
      
      // Generar nuevas recomendaciones para este tipo de comida
      const alternatives = await generateVariedRecommendations(
        mappedMealType,
        nutritionGoal,
        rejectedFoods,
        2 // Solo 2 opciones por grupo para alternativas de comida
      );
      
      // Convertir recomendaciones a formato de comida
      const mealAlts = [];
      if (alternatives && alternatives.recommendations) {
        Object.values(alternatives.recommendations).forEach(group => {
          group.options.forEach(food => {
            mealAlts.push({
              name: `${group.groupName} - ${food.nombre_es || food.nombre}`,
              type: mealType,
              calories: Math.round((food.calorias || 0) * 1.2), // Ajustar para tamaño de comida
              description: `${food.calorias || 0} kcal - P: ${food.proteina || 0}g, C: ${food.carbohidratos || 0}g, G: ${food.grasa_total || 0}g`,
              foods: [food.nombre_es || food.nombre]
            });
          });
        });
      }
      
      setMealAlternatives(prev => ({
        ...prev,
        [mealType]: mealAlts.slice(0, 3) // Máximo 3 alternativas
      }));
      
    } catch (error) {
      console.error('Error generating meal alternatives:', error);
    } finally {
      setLoadingAlternatives(prev => ({ ...prev, [mealType]: false }));
    }
  };

  const replaceMealWithAlternative = (originalMealType, alternativeMeal) => {
    // Actualizar el plan nutricional con la alternativa seleccionada
    const updatedPlan = { ...currentNutritionPlan };
    const mealIndex = updatedPlan.meals.findIndex(m => m.type === originalMealType);
    
    if (mealIndex !== -1) {
      updatedPlan.meals[mealIndex] = alternativeMeal;
      setCurrentNutritionPlan(updatedPlan);
      
      // Limpiar alternativas para esta comida
      setMealAlternatives(prev => ({
        ...prev,
        [originalMealType]: []
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-8 shadow-xl dark:bg-gray-800/90 dark:border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onBack}
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plan Nutricional</h1>
                <p className="text-gray-600 dark:text-gray-400">{currentNutritionPlan.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <motion.button
                  onClick={() => loadRecommendations()}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shuffle className="w-4 h-4" />
                  <span className="hidden sm:inline">Recomendaciones</span>
                </motion.button>
                {consumedCalories > 0 && (
                  <motion.button
                    onClick={resetDailyConsumption}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Reset</span>
                  </motion.button>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Calorías objetivo</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{currentNutritionPlan.dailyCalories} kcal</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Nutrition Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg dark:bg-gray-800/90 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">Plan Diario</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentNutritionPlan.dailyCalories} kcal</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg dark:bg-gray-800/90 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Utensils className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">Consumido</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{consumedCalories} kcal</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg dark:bg-gray-800/90 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Coffee className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">Restante</span>
            </div>
            <p className={`text-2xl font-bold ${(currentNutritionPlan.dailyCalories - consumedCalories) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {currentNutritionPlan.dailyCalories - consumedCalories} kcal
            </p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg dark:bg-gray-800/90 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Apple className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">Comidas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{consumedMeals.length}/{currentNutritionPlan.meals.length}</p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 mb-8 shadow-lg dark:bg-gray-800/90 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Progreso Diario</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round((consumedCalories / currentNutritionPlan.dailyCalories) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
            <motion.div
              className={`h-4 rounded-full transition-all duration-500 ${
                consumedCalories <= currentNutritionPlan.dailyCalories 
                  ? 'bg-gradient-to-r from-green-400 to-green-600' 
                  : 'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min((consumedCalories / currentNutritionPlan.dailyCalories) * 100, 100)}%` 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Consumido: {consumedCalories} kcal</span>
            <span>Objetivo: {currentNutritionPlan.dailyCalories} kcal</span>
          </div>
        </motion.div>

        {/* Meal Plan */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {currentNutritionPlan.meals.map((meal, index) => {
            const MealIcon = getMealIcon(meal.type);
            
            return (
              <motion.div
                key={meal.type}
                className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800/90 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`relative p-3 rounded-xl bg-gradient-to-r ${getMealColor(meal.type)} ${isMealConsumed(meal.type) ? 'ring-4 ring-green-300' : ''}`}>
                      <MealIcon className="w-6 h-6 text-white" />
                      {isMealConsumed(meal.type) && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{meal.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{getMealTime(meal.type)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          <span>{meal.calories} kcal</span>
                        </div>
                        {isMealConsumed(meal.type) && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <span className="font-medium">✓ Consumido</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {!isMealConsumed(meal.type) ? (
                      <>
                        <motion.button
                          onClick={() => markMealAsConsumed(meal)}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ✓ Consumido
                        </motion.button>
                        <motion.button
                          onClick={() => generateMealAlternatives(meal.type, meal)}
                          disabled={loadingAlternatives[meal.type]}
                          className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {loadingAlternatives[meal.type] ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            'No me gusta'
                          )}
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => unmarkMealAsConsumed(meal)}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ✗ Deshacer
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => setSelectedMeal(selectedMeal === meal.type ? null : meal.type)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {selectedMeal === meal.type ? 'Ocultar' : 'Ver Detalles'}
                    </motion.button>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">{meal.description}</p>

                <motion.div
                  initial={false}
                  animate={{
                    height: selectedMeal === meal.type ? 'auto' : 0,
                    opacity: selectedMeal === meal.type ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Alimentos incluidos:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {meal.foods.map((food, foodIndex) => (
                        <motion.div
                          key={foodIndex}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl dark:bg-gray-700"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: foodIndex * 0.1 }}
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900">
                            <span className="text-green-600 font-semibold text-sm dark:text-green-300">✓</span>
                          </div>
                          <span className="text-gray-700 font-medium dark:text-gray-300">{food}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Alternativas para esta comida específica */}
                    {mealAlternatives[meal.type] && mealAlternatives[meal.type].length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
                          🔄 Otras opciones para {meal.name.toLowerCase()}:
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {mealAlternatives[meal.type].map((alternative, altIndex) => (
                            <motion.div
                              key={altIndex}
                              className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: altIndex * 0.1 }}
                            >
                              <h6 className="font-medium text-gray-900 dark:text-white mb-2">
                                {alternative.name}
                              </h6>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {alternative.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                  {alternative.calories} kcal
                                </span>
                                <motion.button
                                  onClick={() => replaceMealWithAlternative(meal.type, alternative)}
                                  className="px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Elegir esta
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Daily Summary */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 mt-8 shadow-xl dark:bg-gray-800/90 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Resumen Nutricional Diario</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Distribución de Calorías</h3>
              <div className="space-y-3">
                {currentNutritionPlan.meals.map((meal) => {
                  const percentage = Math.round((meal.calories / currentNutritionPlan.dailyCalories) * 100);
                  return (
                    <div key={meal.type} className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{meal.type === 'breakfast' ? 'Desayuno' : meal.type === 'lunch' ? 'Almuerzo' : meal.type === 'snack' ? 'Merienda' : 'Cena'}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                          <div 
                            className={`h-full bg-gradient-to-r ${getMealColor(meal.type)} rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white w-12">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recomendaciones</h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Bebe al menos 8 vasos de agua al día</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Come cada 3-4 horas para mantener el metabolismo activo</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Incluye proteína en cada comida</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Ajusta las porciones según tu nivel de hambre</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recomendaciones Variadas */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 mt-8 shadow-xl dark:bg-gray-800/90 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recomendaciones Variadas</h2>
              <p className="text-gray-600 dark:text-gray-400">Múltiples opciones para cada comida - ¡Encuentra lo que te gusta!</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                onClick={shuffleRecommendations}
                disabled={loadingRecommendations}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shuffle className="w-4 h-4" />
                Nuevas Ideas
              </motion.button>
            </div>
          </div>

          {/* Selectores de comida y objetivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Comida
              </label>
              <select
                value={currentMealType}
                onChange={(e) => loadRecommendations(e.target.value, nutritionGoal)}
                className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="desayuno">🌅 Desayuno</option>
                <option value="almuerzo">🍽️ Almuerzo</option>
                <option value="cena">🌙 Cena</option>
                <option value="snack">🍎 Snack</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Objetivo Nutricional
              </label>
              <select
                value={nutritionGoal}
                onChange={(e) => loadRecommendations(currentMealType, e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="perdida_peso">🎯 Pérdida de Peso - Proteínas y verduras</option>
                <option value="ganancia_muscular">💪 Ganancia Muscular - Proteínas y carbohidratos</option>
                <option value="mantenimiento">⚖️ Mantenimiento - Dieta balanceada</option>
                <option value="energia_deportiva">⚡ Energía Deportiva - Carbohidratos y proteínas</option>
              </select>
            </div>
          </div>

          {/* Recomendaciones por grupos */}
          {loadingRecommendations ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-green-500" />
              <p className="text-gray-600 dark:text-gray-400">Generando recomendaciones...</p>
            </div>
          ) : recommendations ? (
            <div className="space-y-6">
              {Object.entries(recommendations.recommendations).map(([groupId, group]) => (
                <div key={groupId} className="border border-gray-200 dark:border-gray-600 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.groupName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Perfil: Proteína {group.macroProfile.protein}, Grasa {group.macroProfile.fat}, Carbohidratos {group.macroProfile.carbs}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.options.map((food, index) => (
                      <FoodRecommendationCard
                        key={`${food.nombre}-${index}`}
                        food={food}
                        groupName={group.groupName}
                        macroProfile={group.macroProfile}
                        onReject={rejectFood}
                        onAdd={addFoodFromRecommendations}
                      />
                    ))}
                  </div>
                  
                  {/* Alternativas adicionales */}
                  {group.alternativeOptions && group.alternativeOptions.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Más opciones similares:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.alternativeOptions.slice(0, 3).map((alt, altIndex) => (
                          <FoodRecommendationCard
                            key={`alt-${alt.nombre}-${altIndex}`}
                            food={alt}
                            groupName={group.groupName}
                            macroProfile={group.macroProfile}
                            onReject={rejectFood}
                            onAdd={addFoodFromRecommendations}
                            isAlternative={true}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <motion.button
                onClick={() => loadRecommendations()}
                className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Generar Recomendaciones
              </motion.button>
            </div>
          )}

          {/* Alimentos rechazados */}
          {rejectedFoods.length > 0 && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Alimentos que no te gustan ({rejectedFoods.length})
                </h4>
                <motion.button
                  onClick={() => setRejectedFoods([])}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-2">
                {rejectedFoods.map((food, index) => (
                  <span
                    key={`rejected-${index}`}
                    className="px-2 py-1 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 text-xs rounded-full"
                  >
                    {food.nombre_es || food.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Food Search (from CSV index) */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 mt-8 shadow-xl dark:bg-gray-800/90 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Buscador de Alimentos (Base CSV + Alias)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Ingresa el nombre o alias local (ej: "rocoto", "soltero", "chupe", "cuy") para ver calorías y macros básicos (por porción) y añadirlos a tu plan.
          </p>
          <div className="mb-6 flex flex-col md:flex-row gap-3">
            <input
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              placeholder="Buscar (nombre o alias)..."
              className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={foodCategory}
              onChange={(e)=> setFoodCategory(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              <option value="">Todas las categorías</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} ({c.total})</option>
              ))}
            </select>
          </div>
          {foodSearch.trim().length > 0 && (
            <div>
              {searchResults.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Sin resultados.</p>
              )}
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                {searchResults.map(item => {
                  const already = addedFoods.some(f => f.id === `csv_${item.id}`);
                  return (
                    <div key={item.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{item.nombre_es || item.nombre}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Porción: {item.porcion || '—'}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">{item.categoria}</p>
                        {already && <span className="text-xs text-green-600 dark:text-green-400 font-medium">Añadido</span>}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs items-center">
                        <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Cal: {item.calorias ?? '—'}</span>
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Prot: {item.proteina ?? '—'} g</span>
                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Carb: {item.carbohidratos ?? '—'} g</span>
                        <span className="px-2 py-1 rounded bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">Grasa: {item.grasa_total ?? '—'} g</span>
                        {item.fibra != null && (
                          <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">Fibra: {item.fibra} g</span>
                        )}
                        {item.azucares != null && (
                          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Azúcares: {item.azucares} g</span>
                        )}
                        <button
                          disabled={already}
                          onClick={() => setAddedFoods(prev => [...prev, {
                            id: `csv_${item.id}`,
                            nombre: item.nombre_es || item.nombre,
                            calorias: item.calorias,
                            proteina: item.proteina,
                            carbohidratos: item.carbohidratos,
                            grasa_total: item.grasa_total
                          }])}
                          className={`ml-2 px-3 py-1 rounded-lg text-xs font-semibold transition ${already ? 'bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-300 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                        >{already ? 'Añadido' : 'Añadir'}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {addedFoods.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Alimentos añadidos al plan:</h3>
              <div className="flex flex-wrap gap-2">
                {addedFoods.map(f => (
                  <div key={f.id} className="flex items-center gap-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-2 py-1 rounded-lg text-xs">
                    <span>{f.nombre}</span>
                    <button
                      onClick={() => setAddedFoods(prev => prev.filter(x => x.id !== f.id))}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 ml-1"
                      title="Quitar"
                    >×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NutritionPlan;