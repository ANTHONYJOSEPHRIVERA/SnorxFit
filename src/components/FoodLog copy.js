import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Coffee, UtensilsCrossed, Moon, Cookie, Droplet, Trash2, Search } from 'lucide-react';
import { ALIMENTOS_DB } from '../data/foodDatabase';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Función helper para obtener fecha local en formato YYYY-MM-DD (sin conversión UTC)
const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const FoodLog = ({ userProfile, onBack, onMacrosUpdate }) => {
  const { user, isOnline } = useAuth();
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  }); 
  const [water, setWater] = useState(0);
  const [currentMeal, setCurrentMeal] = useState('breakfast');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFoodList, setShowFoodList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' o 'summary'

  // Cargar datos del localStorage (cache) y Firebase al inicio
  useEffect(() => {
    const loadFoodLog = async () => {
      console.log('🔄 Cargando datos para fecha:', selectedDate);
      setIsLoading(true);
      
      try {
        // 1. Cargar desde localStorage primero (instantáneo)
        const cachedData = localStorage.getItem(`foodLog_${selectedDate}`);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          console.log('💾 Datos desde localStorage:', parsed);
          setMeals(parsed.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] });
          setWater(parsed.water || 0);
        }
        
        // 2. Si estamos online, cargar desde Firebase (actualizado)
        if (isOnline && user) {
          const foodLogRef = doc(db, 'users', user.uid, 'foodLogs', selectedDate);
          const foodLogSnap = await getDoc(foodLogRef);
          
          if (foodLogSnap.exists()) {
            const firebaseData = foodLogSnap.data();
            console.log('📥 FoodLog cargado desde Firebase:', selectedDate, firebaseData);
            setMeals(firebaseData.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] });
            setWater(firebaseData.water || 0);
            
            // Actualizar cache
            localStorage.setItem(`foodLog_${selectedDate}`, JSON.stringify({
              meals: firebaseData.meals,
              water: firebaseData.water
            }));
          } else if (!cachedData) {
            // No hay datos ni en Firebase ni en cache
            setMeals({ breakfast: [], lunch: [], dinner: [], snacks: [] });
            setWater(0);
          }
        }
      } catch (error) {
        console.error('❌ Error al cargar FoodLog:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) loadFoodLog();
  }, [selectedDate, user, isOnline]);

  // Función para guardar manualmente (cuando el usuario presione el botón)
  const handleSaveAll = async () => {
    if (!user) return;
    
    setIsSaving(true);
    const dataToSave = { meals, water, updatedAt: new Date() };
    
    try {
      // 1. Guardar en localStorage
      localStorage.setItem(`foodLog_${selectedDate}`, JSON.stringify(dataToSave));
      console.log('✅ Guardado en localStorage');
      
      // 2. Guardar en Firebase
      if (isOnline) {
        const foodLogRef = doc(db, 'users', user.uid, 'foodLogs', selectedDate);
        await setDoc(foodLogRef, dataToSave, { merge: true });
        console.log('💾 FoodLog guardado en Firebase:', selectedDate, '✅');
      }
      
      // 3. Notificar macros
      const today = getLocalDateString();
      if (selectedDate === today && onMacrosUpdate) {
        const allFoods = Object.values(meals).flat();
        const macros = {
          protein: allFoods.reduce((sum, food) => sum + (food.protein || 0), 0),
          carbs: allFoods.reduce((sum, food) => sum + (food.carbs || 0), 0),
          fat: allFoods.reduce((sum, food) => sum + (food.fat || 0), 0)
        };
        onMacrosUpdate(macros);
      }
      
      // 4. Cambiar a modo visualización
      setViewMode('summary');
      setIsSaving(false);
      
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      setIsSaving(false);
      alert('Error al guardar. Intenta de nuevo.');
    }
  };

  const mealTypes = [
    { id: 'breakfast', label: 'Desayuno', icon: Coffee, color: 'from-yellow-500 to-orange-500' },
    { id: 'lunch', label: 'Almuerzo', icon: UtensilsCrossed, color: 'from-green-500 to-teal-500' },
    { id: 'dinner', label: 'Cena', icon: Moon, color: 'from-blue-500 to-purple-500' },
    { id: 'snacks', label: 'Meriendas', icon: Cookie, color: 'from-pink-500 to-red-500' }
  ];

  const handleAddFood = (food) => {
    console.log('🍽️ Agregando comida:', food.nombre, 'a', currentMeal);
    const newFood = {
      id: Date.now(),
      name: food.nombre,
      calories: food.calorias,
      protein: food.proteinas || 0,
      carbs: food.carbohidratos || 0,
      fat: food.grasas || 0
    };
    
    setMeals(prev => {
      const updated = {
        ...prev,
        [currentMeal]: [...prev[currentMeal], newFood]
      };
      console.log('✅ Estado actualizado:', currentMeal, '=', updated[currentMeal].length, 'items');
      return updated;
    });
    
    setSearchTerm('');
    setShowFoodList(false);
  };

  const filteredFoods = searchTerm.trim()
    ? ALIMENTOS_DB.filter(food => food.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleDeleteFood = (mealType, foodId) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter(food => food.id !== foodId)
    }));
  };

  const getTotalCalories = () => {
    return Object.values(meals).flat().reduce((sum, food) => sum + food.calories, 0);
  };

  const getTotalMacros = () => {
    const allFoods = Object.values(meals).flat();
    return {
      protein: allFoods.reduce((sum, food) => sum + (food.protein || 0), 0),
      carbs: allFoods.reduce((sum, food) => sum + (food.carbs || 0), 0),
      fat: allFoods.reduce((sum, food) => sum + (food.fat || 0), 0)
    };
  };

  // Análisis nutricional del día
  const getNutritionalAnalysis = () => {
    const totalCalories = getTotalCalories();
    const macros = getTotalMacros();
    
    // Calorías objetivo del usuario (de su perfil)
    const targetCalories = userProfile?.calorieGoal || 2000;
    const caloriesDiff = totalCalories - targetCalories;
    const caloriesPercent = (totalCalories / targetCalories) * 100;
    
    // Macros objetivo (basado en calorías)
    const targetProtein = (targetCalories * 0.30) / 4; // 30% de calorías = proteína (4 cal/g)
    const targetCarbs = (targetCalories * 0.40) / 4;   // 40% de calorías = carbos (4 cal/g)
    const targetFat = (targetCalories * 0.30) / 9;     // 30% de calorías = grasa (9 cal/g)
    
    const analysis = {
      totalCalories,
      targetCalories,
      caloriesDiff,
      caloriesPercent,
      status: caloriesDiff > 500 ? 'excess' : caloriesDiff > 200 ? 'warning' : caloriesDiff < -200 ? 'low' : 'good',
      macros: {
        protein: { current: macros.protein, target: targetProtein, percent: (macros.protein / targetProtein) * 100 },
        carbs: { current: macros.carbs, target: targetCarbs, percent: (macros.carbs / targetCarbs) * 100 },
        fat: { current: macros.fat, target: targetFat, percent: (macros.fat / targetFat) * 100 }
      },
      recommendations: []
    };
    
    // Generar recomendaciones
    if (analysis.status === 'excess') {
      analysis.recommendations.push({
        type: 'warning',
        message: `⚠️ Te pasaste por ${Math.abs(caloriesDiff).toFixed(0)} calorías hoy. No hagas de esto un hábito.`
      });
    } else if (analysis.status === 'warning') {
      analysis.recommendations.push({
        type: 'info',
        message: `ℹ️ Estás ${Math.abs(caloriesDiff).toFixed(0)} calorías por encima de tu objetivo. Considera reducir porciones mañana.`
      });
    } else if (analysis.status === 'low') {
      analysis.recommendations.push({
        type: 'warning',
        message: `⚠️ Estás ${Math.abs(caloriesDiff).toFixed(0)} calorías por debajo. Come más para mantener energía.`
      });
    } else {
      analysis.recommendations.push({
        type: 'success',
        message: `✅ ¡Perfecto! Estás dentro de tu objetivo calórico.`
      });
    }
    
    // Análisis de macros
    if (macros.protein < targetProtein * 0.8) {
      analysis.recommendations.push({
        type: 'warning',
        message: `🥩 Proteína baja. Necesitas ${(targetProtein - macros.protein).toFixed(0)}g más.`
      });
    }
    
    if (macros.carbs > targetCarbs * 1.3) {
      analysis.recommendations.push({
        type: 'info',
        message: `🍞 Muchos carbohidratos. Considera reducir harinas y azúcares.`
      });
    }
    
    if (macros.fat > targetFat * 1.3) {
      analysis.recommendations.push({
        type: 'info',
        message: `🥑 Muchas grasas. Revisa frituras y aceites.`
      });
    }
    
    // Balance de comidas
    const mealsWithFood = Object.entries(meals).filter(([_, foods]) => foods.length > 0).length;
    if (mealsWithFood < 3) {
      analysis.recommendations.push({
        type: 'info',
        message: `🍽️ Solo registraste ${mealsWithFood} comida(s). Intenta hacer al menos 3 comidas al día.`
      });
    }
    
    return analysis;
  };

  const totalMacros = getTotalMacros();
  const nutritionalAnalysis = getNutritionalAnalysis();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Registro de Alimentos</h1>
                {isSaving && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Guardando...
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Registra todo lo que comes hoy
              </p>
            </div>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800"
          />
        </motion.div>

        {/* Resumen diario */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-4 shadow-lg">
            <p className="text-sm font-medium opacity-90">Calorías</p>
            <p className="text-3xl font-bold">{getTotalCalories()}</p>
            <p className="text-xs opacity-75">kcal</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-4 shadow-lg">
            <p className="text-sm font-medium opacity-90">Proteínas</p>
            <p className="text-3xl font-bold">{totalMacros.protein.toFixed(1)}</p>
            <p className="text-xs opacity-75">gramos</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-4 shadow-lg">
            <p className="text-sm font-medium opacity-90">Carbos</p>
            <p className="text-3xl font-bold">{totalMacros.carbs.toFixed(1)}</p>
            <p className="text-xs opacity-75">gramos</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-amber-500 text-white rounded-2xl p-4 shadow-lg">
            <p className="text-sm font-medium opacity-90">Grasas</p>
            <p className="text-3xl font-bold">{totalMacros.fat.toFixed(1)}</p>
            <p className="text-xs opacity-75">gramos</p>
          </div>
        </motion.div>

        {/* MODO EDICIÓN: Agregar comidas */}
        {viewMode === 'edit' && (
          <>
            {/* Tabs de comidas */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
          {mealTypes.map((meal) => {
            const Icon = meal.icon;
            return (
              <button
                key={meal.id}
                onClick={() => setCurrentMeal(meal.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                  currentMeal === meal.id
                    ? `bg-gradient-to-r ${meal.color} text-white shadow-lg`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {meal.label}
              </button>
            );
          })}
        </div>

        {/* Buscar y agregar alimento */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowFoodList(e.target.value.length > 0);
              }}
              placeholder="Buscar alimento... ej: cereal, pollo, pizza, inka cola zero"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700"
            />
          </div>

          {/* Lista de resultados */}
          {showFoodList && filteredFoods.length > 0 && (
            <div className="mt-3 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-xl">
              {filteredFoods.slice(0, 20).map((food, index) => (
                <button
                  key={index}
                  onClick={() => handleAddFood(food)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{food.nombre}</span>
                    <div className="flex gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span className="bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded">{food.calorias} kcal</span>
                      {food.proteinas && <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">P: {food.proteinas}g</span>}
                      {food.carbohidratos && <span className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded">C: {food.carbohidratos}g</span>}
                      {food.grasas && <span className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">G: {food.grasas}g</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showFoodList && filteredFoods.length === 0 && searchTerm.trim() && (
            <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center text-gray-600 dark:text-gray-400">
              No se encontraron alimentos. Prueba con otro nombre.
            </div>
          )}

          {showFoodList && (
            <button
              onClick={() => {
                setSearchTerm('');
                setShowFoodList(false);
              }}
              className="mt-3 w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancelar
            </button>
          )}
        </motion.div>

        {/* Lista de alimentos agregados */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            {mealTypes.find(m => m.id === currentMeal)?.label}
            <span className="text-sm font-normal text-gray-500">
              ({meals[currentMeal].length} items)
            </span>
          </h3>

          {meals[currentMeal].length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay alimentos registrados. Busca y agrega algo arriba 👆
            </p>
          ) : (
            <div className="space-y-2">
              {meals[currentMeal].map((food) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <div className="flex-1">
                    <p className="font-medium">{food.name}</p>
                    <div className="flex gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                      <span className="bg-orange-100 dark:bg-orange-900 px-2 py-0.5 rounded">{food.calories} kcal</span>
                      {food.protein > 0 && <span className="bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">P: {food.protein}g</span>}
                      {food.carbs > 0 && <span className="bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded">C: {food.carbs}g</span>}
                      {food.fat > 0 && <span className="bg-yellow-100 dark:bg-yellow-900 px-2 py-0.5 rounded">G: {food.fat}g</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFood(currentMeal, food.id)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Panel de Análisis Nutricional del Día */}
        {getTotalCalories() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              📊 Análisis del Día
            </h3>

            {/* Barra de progreso de calorías */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Calorías del día</span>
                <span className="text-sm">
                  <span className={`font-bold ${
                    nutritionalAnalysis.status === 'excess' ? 'text-red-600' :
                    nutritionalAnalysis.status === 'warning' ? 'text-orange-600' :
                    nutritionalAnalysis.status === 'low' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {nutritionalAnalysis.totalCalories.toFixed(0)}
                  </span>
                  {' / '}
                  <span className="text-gray-600 dark:text-gray-400">
                    {nutritionalAnalysis.targetCalories} kcal
                  </span>
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    nutritionalAnalysis.status === 'excess' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    nutritionalAnalysis.status === 'warning' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                    nutritionalAnalysis.status === 'low' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                    'bg-gradient-to-r from-green-500 to-green-600'
                  }`}
                  style={{ width: `${Math.min(nutritionalAnalysis.caloriesPercent, 100)}%` }}
                />
              </div>
              
              {nutritionalAnalysis.caloriesPercent > 100 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  +{(nutritionalAnalysis.caloriesPercent - 100).toFixed(0)}% sobre tu objetivo
                </p>
              )}
            </div>

            {/* Progreso de Macros */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Proteínas</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {nutritionalAnalysis.macros.protein.current.toFixed(0)}g
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                    style={{ width: `${Math.min(nutritionalAnalysis.macros.protein.percent, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Carbos</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {nutritionalAnalysis.macros.carbs.current.toFixed(0)}g
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                    style={{ width: `${Math.min(nutritionalAnalysis.macros.carbs.percent, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Grasas</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {nutritionalAnalysis.macros.fat.current.toFixed(0)}g
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all"
                    style={{ width: `${Math.min(nutritionalAnalysis.macros.fat.percent, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Recomendaciones */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                💡 Recomendaciones
              </h4>
              {nutritionalAnalysis.recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-xl text-sm ${
                    rec.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' :
                    rec.type === 'warning' ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800' :
                    'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  }`}
                >
                  {rec.message}
                </div>
              ))}
            </div>
          </motion.div>
        )}

            {/* Botón Guardar Todo */}
            <motion.button
              onClick={handleSaveAll}
              disabled={isSaving || getTotalCalories() === 0}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 ${
                isSaving || getTotalCalories() === 0
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {isSaving ? '💾 Guardando...' : '✅ Guardar Todo y Ver Resumen'}
            </motion.button>
          </>
        )}

        {/* MODO RESUMEN: Visualización limpia de lo que comió */}
        {viewMode === 'summary' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Encabezado del resumen */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-2">✅ ¡Guardado Exitosamente!</h2>
              <p className="text-sm opacity-90">Resumen de tu alimentación del día</p>
            </div>

            {/* Resumen por comida */}
            {mealTypes.map((mealType) => {
              const mealFoods = meals[mealType.id];
              if (mealFoods.length === 0) return null;
              
              const Icon = mealType.icon;
              const mealTotalCalories = mealFoods.reduce((sum, food) => sum + food.calories, 0);
              const mealTotalProtein = mealFoods.reduce((sum, food) => sum + food.protein, 0);
              const mealTotalCarbs = mealFoods.reduce((sum, food) => sum + food.carbs, 0);
              const mealTotalFat = mealFoods.reduce((sum, food) => sum + food.fat, 0);
              
              return (
                <div key={mealType.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                  <div className={`flex items-center gap-3 mb-4 pb-3 border-b-2 border-gradient-to-r ${mealType.color}`}>
                    <div className={`p-3 bg-gradient-to-r ${mealType.color} rounded-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{mealType.label}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {mealFoods.length} alimento{mealFoods.length > 1 ? 's' : ''} • {mealTotalCalories} kcal
                      </p>
                    </div>
                  </div>

                  {/* Lista de alimentos de esta comida */}
                  <div className="space-y-3">
                    {mealFoods.map((food, index) => (
                      <div 
                        key={food.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{food.name}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-xs font-medium">
                              🔥 {food.calories} kcal
                            </span>
                            {food.protein > 0 && (
                              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium">
                                🥩 P: {food.protein}g
                              </span>
                            )}
                            {food.carbs > 0 && (
                              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-medium">
                                🍞 C: {food.carbs}g
                              </span>
                            )}
                            {food.fat > 0 && (
                              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-xs font-medium">
                                🥑 G: {food.fat}g
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total de esta comida */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Calorías</p>
                        <p className="text-lg font-bold text-orange-600">{mealTotalCalories}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Proteínas</p>
                        <p className="text-lg font-bold text-blue-600">{mealTotalProtein.toFixed(1)}g</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Carbos</p>
                        <p className="text-lg font-bold text-green-600">{mealTotalCarbs.toFixed(1)}g</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Grasas</p>
                        <p className="text-lg font-bold text-yellow-600">{mealTotalFat.toFixed(1)}g</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Panel de Análisis Nutricional */}
            {getTotalCalories() > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  📊 Análisis Nutricional del Día
                </h3>

                {/* Barra de progreso de calorías */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Calorías del día</span>
                    <span className="text-sm">
                      <span className={`font-bold ${
                        nutritionalAnalysis.status === 'excess' ? 'text-red-600' :
                        nutritionalAnalysis.status === 'warning' ? 'text-orange-600' :
                        nutritionalAnalysis.status === 'low' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {nutritionalAnalysis.totalCalories.toFixed(0)}
                      </span>
                      {' / '}
                      <span className="text-gray-600 dark:text-gray-400">
                        {nutritionalAnalysis.targetCalories} kcal
                      </span>
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        nutritionalAnalysis.status === 'excess' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                        nutritionalAnalysis.status === 'warning' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                        nutritionalAnalysis.status === 'low' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${Math.min(nutritionalAnalysis.caloriesPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Recomendaciones */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    💡 Recomendaciones
                  </h4>
                  {nutritionalAnalysis.recommendations.map((rec, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-xl text-sm ${
                        rec.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800' :
                        rec.type === 'warning' ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800' :
                        'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      }`}
                    >
                      {rec.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botón para editar de nuevo */}
            <button
              onClick={() => setViewMode('edit')}
              className="w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all transform hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
            >
              ✏️ Editar Registro
            </button>
          </motion.div>
        )}

        {/* Contador de agua */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Droplet className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Vasos de agua</p>
                <p className="text-3xl font-bold">{water}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setWater(Math.max(0, water - 1))}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition"
              >
                <span className="text-2xl">−</span>
              </button>
              <button
                onClick={() => setWater(water + 1)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
          <p className="text-sm opacity-75 mt-2">Meta: 8 vasos al día</p>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodLog;
