import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Flame, Target, Mic, Camera, Calendar, CalendarRange, Activity, Apple, Beef, Croissant, Star, TrendingUp, Zap } from 'lucide-react';
import WeightChart from './WeightChart';
import { SUSQuestionnaire } from './SUSQuestionnaire';

const HomeOverview = ({ 
  userProfile, 
  recentWeights = [], 
  dailyCalories = 0, // META de calorías diarias
  dailyCaloriesConsumed = 0, // Calorías CONSUMIDAS hoy
  dailyMacros = { protein: 0, carbs: 0, fat: 0 }, // META de macros diarios
  dailyMacrosConsumed = { protein: 0, carbs: 0, fat: 0 }, // Macros CONSUMIDOS hoy
  onNavigate = () => {}, 
  onQuickAddWeight = () => {}, 
  onOpenScanner = () => {}, 
  onRecalculatePlan = () => {} 
}) => {
  const [range, setRange] = useState('week');
  const [showSUS, setShowSUS] = useState(false);
  const latestWeight = recentWeights.length ? recentWeights[recentWeights.length - 1].weight : userProfile?.weight;
  
  // Calcular meta de peso con validación
  const weightGoal = useMemo(() => {
    const currentWeight = latestWeight || userProfile?.weight || 70;
    let goal = userProfile?.goalWeight;
    
    console.log('🔍 Validando meta:', { 
      goalWeight: goal, 
      currentWeight, 
      diferencia: Math.abs(goal - currentWeight) 
    });
    
    // Si la meta no existe, es 0, o difiere más de 30kg → recalcular
    if (!goal || goal === 0 || Math.abs(goal - currentWeight) > 30) {
      console.log('❌ Meta ilógica detectada, recalculando...');
      
      // Calcular meta RAZONABLE según objetivo
      if (userProfile?.goal === 'lose') {
        goal = Math.round(currentWeight * 0.90); // Perder 10%
      } else if (userProfile?.goal === 'gain') {
        goal = Math.round(currentWeight * 1.10); // Ganar 10%
      } else {
        goal = currentWeight; // Mantener
      }
      
      console.log('✅ Nueva meta calculada:', goal);
    }
    
    return Math.round(goal * 10) / 10;
  }, [userProfile?.goalWeight, userProfile?.goal, userProfile?.weight, latestWeight]);
  
  const progressPct = useMemo(() => {
    if (!latestWeight || !weightGoal) return 0;
    if (userProfile?.goal === 'lose') {
      const start = userProfile?.weight || latestWeight;
      const total = start - weightGoal;
      const done = start - latestWeight;
      if (total <= 0) return 0;
      return Math.min(100, Math.max(0, Math.round((done / total) * 100)));
    }
    if (userProfile?.goal === 'gain') {
      const start = userProfile?.weight || latestWeight;
      const total = weightGoal - start;
      const done = latestWeight - start;
      if (total <= 0) return 0;
      return Math.min(100, Math.max(0, Math.round((done / total) * 100)));
    }
    return 0;
  }, [latestWeight, weightGoal, userProfile]);

  // Macros calculados desde los alimentos registrados (o 0 si no hay datos)
  const weeklyMacros = [
    { label: 'Proteína', value: Math.round(dailyMacros.protein || 0), unit: 'g/día', color: 'bg-blue-500', icon: Beef },
    { label: 'Carbohidratos', value: Math.round(dailyMacros.carbs || 0), unit: 'g/día', color: 'bg-green-500', icon: Apple },
    { label: 'Grasas', value: Math.round(dailyMacros.fat || 0), unit: 'g/día', color: 'bg-yellow-500', icon: Croissant }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-2 sm:p-4 md:p-6 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
        <motion.div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0" initial={{ opacity:0, y:-10}} animate={{ opacity:1, y:0}}>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">Hola {userProfile?.name?.split(' ')[0] || ''} </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Resumen rápido de tu semana</p>
          </div>
          
          {/* Botón Evaluar App */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSUS(true)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base"
            title="Evaluar usabilidad de SnorxFit"
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Evaluar App</span>
          </motion.button>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6" initial={{ opacity:0}} animate={{ opacity:1}} transition={{ delay:.1 }}>
          <div className="md:col-span-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
                <h2 className="font-semibold text-sm sm:text-base">Balance Calórico Hoy</h2>
              </div>
              <button onClick={onQuickAddWeight} className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-xs sm:text-sm font-semibold shadow-lg transition flex items-center justify-center gap-2">
                <Scale className="w-4 h-4" />
                <span>Registrar Peso</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
              {/* Meta Diaria */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold mb-1">Meta Diaria</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">{dailyCalories || 2000}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">kcal objetivo</p>
              </div>
              
              {/* Consumidas */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-green-200 dark:border-green-800">
                <p className="text-xs uppercase tracking-wide text-green-600 dark:text-green-400 font-semibold mb-1">Consumidas</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-green-600 dark:text-green-400">{dailyCaloriesConsumed || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">kcal registradas</p>
              </div>
              
              {/* Déficit/Superávit */}
              <div className={`bg-gradient-to-br rounded-xl sm:rounded-2xl p-3 sm:p-4 border ${
                (dailyCalories || 2000) - (dailyCaloriesConsumed || 0) >= 0 
                  ? 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800' 
                  : 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800'
              }`}>
                <p className={`text-xs uppercase tracking-wide font-semibold mb-1 ${
                  (dailyCalories || 2000) - (dailyCaloriesConsumed || 0) >= 0 
                    ? 'text-orange-600 dark:text-orange-400' 
                    : 'text-purple-600 dark:text-purple-400'
                }`}>
                  {(dailyCalories || 2000) - (dailyCaloriesConsumed || 0) >= 0 ? 'Déficit' : 'Excedente'}
                </p>
                <p className={`text-2xl sm:text-3xl font-extrabold ${
                  (dailyCalories || 2000) - (dailyCaloriesConsumed || 0) >= 0 
                    ? 'text-orange-600 dark:text-orange-400' 
                    : 'text-purple-600 dark:text-purple-400'
                }`}>
                  {Math.abs((dailyCalories || 2000) - (dailyCaloriesConsumed || 0))}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">kcal restantes</p>
              </div>
            </div>

            {/* Barra de Progreso Visual */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Progreso del día</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {Math.round(((dailyCaloriesConsumed || 0) / (dailyCalories || 2000)) * 100)}%
                </p>
              </div>
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full ${
                    ((dailyCaloriesConsumed || 0) / (dailyCalories || 2000)) > 1.1 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                      : ((dailyCaloriesConsumed || 0) / (dailyCalories || 2000)) > 0.9
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((dailyCaloriesConsumed || 0) / (dailyCalories || 2000)) * 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              
              {/* Tips Dinámicos según Progreso */}
              <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                {(() => {
                  const consumed = dailyCaloriesConsumed || 0;
                  const goal = dailyCalories || 2000;
                  const percentage = (consumed / goal) * 100;
                  const remaining = goal - consumed;
                  const userGoal = userProfile?.goal || 'maintain';
                  
                  // Sin registros aún
                  if (consumed === 0) {
                    return (
                      <div className="flex items-start gap-2">
                        <span className="text-lg">📝</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">¡Comienza tu día!</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Registra tu desayuno para empezar a trackear tu progreso. ¡Vamos con todo! 💪
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  // 0-25% del objetivo
                  if (percentage < 25) {
                    return (
                      <div className="flex items-start gap-2">
                        <span className="text-lg">🌅</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">¡Buen inicio!</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Te quedan {remaining.toFixed(0)} kcal. Asegúrate de incluir proteína en cada comida y no saltarte comidas. 💪
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  // 25-50% del objetivo
                  if (percentage < 50) {
                    return (
                      <div className="flex items-start gap-2">
                        <span className="text-lg">🔥</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">¡Vas bien!</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Llevas {consumed.toFixed(0)} kcal. {userGoal === 'lose' ? 'Prioriza proteína para mantener músculo.' : userGoal === 'gain' ? 'Mete carbos después del gym.' : 'Mantén el balance de macros.'} 💯
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  // 50-75% del objetivo
                  if (percentage < 75) {
                    return (
                      <div className="flex items-start gap-2">
                        <span className="text-lg">⚡</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">¡Excelente progreso!</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Te restan {remaining.toFixed(0)} kcal. {userGoal === 'lose' ? 'Evita grasas extras y prioriza verduras.' : userGoal === 'gain' ? 'Aprovecha la ventana post-entreno si vas al gym.' : 'Sigue así, estás en buen camino.'} 🎯
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  // 75-95% del objetivo
                  if (percentage < 95) {
                    return (
                      <div className="flex items-start gap-2">
                        <span className="text-lg">🎯</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">¡Casi en tu meta!</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Solo {remaining.toFixed(0)} kcal restantes. {userGoal === 'lose' ? 'Una comida ligera y listo.' : userGoal === 'gain' ? 'Completa con un snack proteico.' : 'Termina el día con algo ligero.'} ✨
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  // 95-110% del objetivo
                  if (percentage <= 110) {
                    return (
                      <div className="flex items-start gap-2">
                        <span className="text-lg">✅</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-700 dark:text-green-300">¡Perfecto!</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {userGoal === 'lose' ? 'Cumpliste tu déficit. Mañana repite.' : userGoal === 'gain' ? 'Meta alcanzada. El músculo crece al descansar.' : 'Día completado exitosamente.'} ¡Descansa bien! 😴
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  // Más de 110%
                  return (
                    <div className="flex items-start gap-2">
                      <span className="text-lg">⚠️</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">Te pasaste un poco</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {userGoal === 'lose' ? 'No hagas de esto un hábito. Mañana vuelve al plan.' : userGoal === 'gain' ? 'Superávit muy alto, mañana modera un poco.' : 'Intenta no superar tanto tu meta diaria.'} 💪
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Info de Peso Actual */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Peso Actual</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{latestWeight} kg</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Meta</p>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{weightGoal} kg</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Progreso</p>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{progressPct}%</p>
                </div>
              </div>
              
              {/* Mensaje motivacional según progreso */}
              {progressPct === 0 ? (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                    🚀 ¡Acabas de empezar! Registra tu peso semanalmente para ver tu progreso.
                  </p>
                </div>
              ) : progressPct > 0 && progressPct < 25 ? (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-700 dark:text-green-300 text-center">
                    💪 ¡Gran inicio! Cada paso cuenta. Sigue así.
                  </p>
                </div>
              ) : progressPct >= 25 && progressPct < 50 ? (
                <div className="mt-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 text-center">
                    🔥 ¡Vas por buen camino! Ya llevas {progressPct}% de tu meta.
                  </p>
                </div>
              ) : progressPct >= 50 && progressPct < 75 ? (
                <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-xs text-purple-700 dark:text-purple-300 text-center">
                    ⚡ ¡Más de la mitad! No aflojes ahora. ¡Tú puedes!
                  </p>
                </div>
              ) : progressPct >= 75 && progressPct < 100 ? (
                <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-xs text-orange-700 dark:text-orange-300 text-center">
                    🎯 ¡Casi lo logras! Solo te falta {100 - progressPct}%. ¡Último esfuerzo!
                  </p>
                </div>
              ) : progressPct >= 100 ? (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 text-center">
                    🏆 ¡META CUMPLIDA! Ahora mantén y define tu siguiente objetivo.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-sm">Presupuesto Diario</h3>
              </div>
              <p className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">{dailyCalories} <span className="text-base font-medium">kcal</span></p>
              <p className="text-[11px] mt-1 text-gray-500">Calculado según tu perfil</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {weeklyMacros.map(m => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className="text-center bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3">
                      <Icon className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-300" />
                      <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{m.label}</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{m.value}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">{m.unit}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <CalendarRange className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-sm">Accesos Rápidos</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={()=> onNavigate('foodLog')} className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-sm font-semibold shadow hover:shadow-lg transition flex flex-col items-center gap-2">
                  <Apple className="w-6 h-6" />
                  <span>Registrar Alimentos</span>
                </button>
                <button onClick={()=> onNavigate('weightTracker')} className="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white text-sm font-semibold shadow hover:shadow-lg transition flex flex-col items-center gap-2">
                  <Scale className="w-6 h-6" />
                  <span>Registrar Peso</span>
                </button>
                <button onClick={()=> onNavigate('progress')} className="p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white text-sm font-semibold shadow hover:shadow-lg transition flex flex-col items-center gap-2 col-span-2">
                  <Activity className="w-6 h-6" />
                  <span>Ver Mi Progreso</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0, y:10}} animate={{ opacity:1, y:0}} transition={{ delay:.2 }} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl p-4 md:p-6 shadow-xl">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm md:text-base">
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-sky-500"/> Análisis de Tendencias
          </h3>
          
          {/* Análisis Semanal */}
          <div className="space-y-3 md:space-y-4">
            {(() => {
              const daysActive = Math.floor((Date.now() - new Date(userProfile?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)) + 1;
              const currentStreak = userProfile?.currentStreak || 1;
              const totalWeightLoss = (userProfile?.weight || 0) - (latestWeight || 0);
              const daysToGoal = weightGoal ? Math.abs(latestWeight - weightGoal) / 0.5 : 0; // 0.5kg por semana
              const estimatedDate = new Date();
              estimatedDate.setDate(estimatedDate.getDate() + (daysToGoal * 7));
              const goal = userProfile?.goal || 'maintain';
              
              return (
                <>
                  {/* Estadísticas Rápidas - RESPONSIVE */}
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {/* Días Activos */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg md:rounded-xl p-2 md:p-3 border border-blue-100 dark:border-blue-800">
                      <div className="flex items-center gap-1 md:gap-2 mb-1">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Días activo</span>
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300">{daysActive}</p>
                      <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1 truncate">
                        {daysActive < 7 ? '¡Primer semana!' : daysActive < 30 ? 'Buen ritmo 💪' : '¡Veterano! 🏆'}
                      </p>
                    </div>
                    
                    {/* Consistencia */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg md:rounded-xl p-2 md:p-3 border border-green-100 dark:border-green-800">
                      <div className="flex items-center gap-1 md:gap-2 mb-1">
                        <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-600 dark:text-green-400" />
                        <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Consistencia</span>
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-green-700 dark:text-green-300">
                        {Math.min(100, Math.round((currentStreak / daysActive) * 100))}%
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1 truncate">
                        {currentStreak === daysActive ? '¡Perfecto! 🔥' : currentStreak > daysActive * 0.8 ? 'Muy bien 💯' : 'Mejora ⚡'}
                      </p>
                    </div>
                    
                    {/* Velocidad */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg md:rounded-xl p-2 md:p-3 border border-purple-100 dark:border-purple-800">
                      <div className="flex items-center gap-1 md:gap-2 mb-1">
                        <Target className="w-3 h-3 md:w-4 md:h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-[10px] md:text-xs text-gray-600 dark:text-gray-400">Velocidad</span>
                      </div>
                      <p className="text-base md:text-lg font-bold text-purple-700 dark:text-purple-300">
                        {totalWeightLoss > 0 ? `${(totalWeightLoss / (daysActive / 7)).toFixed(1)}` : '0.0'} kg
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">por semana</p>
                    </div>
                  </div>
                  
                  {/* Predicción y Recomendaciones - RESPONSIVE */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-3 md:p-4 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="bg-amber-100 dark:bg-amber-900/40 rounded-lg p-1.5 md:p-2 flex-shrink-0">
                        <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-xs md:text-sm">
                          {goal === 'lose' ? '🎯 Proyección de Meta' : goal === 'gain' ? '💪 Proyección de Ganancia' : '✨ Mantenimiento'}
                        </h4>
                        
                        {goal === 'lose' && latestWeight > weightGoal ? (
                          <>
                            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                              Te faltan <strong className="text-amber-700 dark:text-amber-300">{(latestWeight - weightGoal).toFixed(1)} kg</strong> para tu meta.
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              📅 Fecha estimada: <strong>{estimatedDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                              {daysToGoal * 7 < 90 ? ' 🚀 ¡Estás cerca!' : ' 💪 Sigue firme'}
                            </p>
                            <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-700">
                              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">💡 Tips para mantener el ritmo:</p>
                              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• {currentStreak < 7 ? 'Mantén consistencia toda la semana' : 'Excelente racha, sigue así'}</li>
                                <li>• {totalWeightLoss / (daysActive / 7) > 1 ? '⚠️ Bajas muy rápido, modera un poco' : totalWeightLoss / (daysActive / 7) > 0.3 ? 'Velocidad perfecta (0.5-1 kg/semana)' : 'Sé más estricto con el déficit'}</li>
                                <li>• Registra peso cada {daysActive < 14 ? 'semana' : '3-4 días'} para mejor seguimiento</li>
                              </ul>
                            </div>
                          </>
                        ) : goal === 'gain' && latestWeight < weightGoal ? (
                          <>
                            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                              Te faltan <strong className="text-amber-700 dark:text-amber-300">{(weightGoal - latestWeight).toFixed(1)} kg</strong> de músculo.
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              📅 Fecha estimada: <strong>{estimatedDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                            </p>
                            <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-700">
                              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">💡 Tips para ganar músculo limpio:</p>
                              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Superávit moderado (+300-500 kcal)</li>
                                <li>• Proteína alta (2g/kg peso corporal)</li>
                                <li>• Entrena pesado 4-5 veces/semana</li>
                                <li>• Descansa 7-9 horas (ahí crece el músculo)</li>
                              </ul>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                              {latestWeight === weightGoal ? '🏆 ¡Meta alcanzada! Ahora mantén.' : '✅ Estás en tu peso ideal.'}
                            </p>
                            <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-700">
                              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">💡 Tips para mantenimiento:</p>
                              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Come a tus calorías de mantenimiento</li>
                                <li>• Sigue entrenando 3-4 veces/semana</li>
                                <li>• Monitorea peso semanalmente</li>
                                <li>• Disfruta el proceso sin obsesionarte</li>
                              </ul>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Comparación vs Última Semana */}
                  {daysActive > 7 && (
                    <div className="bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 rounded-xl p-4 border border-cyan-200 dark:border-cyan-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Comparación Semanal</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Progreso esta semana</p>
                          <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300">
                            {currentStreak >= 7 ? '✅ 7/7 días' : `📊 ${currentStreak}/7 días`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Cambio de peso</p>
                          <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300">
                            {totalWeightLoss > 0 ? `-${totalWeightLoss.toFixed(1)}` : totalWeightLoss < 0 ? `+${Math.abs(totalWeightLoss).toFixed(1)}` : '0.0'} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Análisis de Balance Calórico Semanal */}
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-800">
                    <div className="flex items-center gap-2 mb-3">
                      <Flame className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Balance Energético</h4>
                    </div>
                    <div className="space-y-3">
                      {/* Calorías de Hoy */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Consumidas hoy</span>
                        <span className="text-sm font-bold text-violet-700 dark:text-violet-300">
                          {dailyCaloriesConsumed.toFixed(0)} kcal
                        </span>
                      </div>
                      
                      {/* Barra de progreso mini */}
                      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${
                            (dailyCaloriesConsumed / dailyCalories) > 1.1 
                              ? 'bg-gradient-to-r from-red-400 to-orange-400' 
                              : (dailyCaloriesConsumed / dailyCalories) > 0.9
                              ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                              : 'bg-gradient-to-r from-blue-400 to-indigo-400'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (dailyCaloriesConsumed / dailyCalories) * 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      
                      {/* Déficit/Superávit */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {dailyCaloriesConsumed > dailyCalories ? 'Superávit' : 'Déficit'}
                        </span>
                        <span className={`text-sm font-bold ${
                          dailyCaloriesConsumed > dailyCalories 
                            ? 'text-orange-600 dark:text-orange-400' 
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {dailyCaloriesConsumed > dailyCalories ? '+' : '-'}
                          {Math.abs(dailyCalories - dailyCaloriesConsumed).toFixed(0)} kcal
                        </span>
                      </div>
                      
                      {/* Macros del Día */}
                      <div className="pt-2 border-t border-violet-200 dark:border-violet-700">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Macros consumidos hoy:</p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span className="text-xs text-gray-600 dark:text-gray-400">Proteína</span>
                            </div>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              {dailyMacrosConsumed?.protein?.toFixed(0) || 0}g
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              /{dailyMacros?.protein?.toFixed(0) || 0}g
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span className="text-xs text-gray-600 dark:text-gray-400">Carbos</span>
                            </div>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              {dailyMacrosConsumed?.carbs?.toFixed(0) || 0}g
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              /{dailyMacros?.carbs?.toFixed(0) || 0}g
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                              <span className="text-xs text-gray-600 dark:text-gray-400">Grasas</span>
                            </div>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                              {dailyMacrosConsumed?.fat?.toFixed(0) || 0}g
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              /{dailyMacros?.fat?.toFixed(0) || 0}g
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Evaluación de Macros */}
                      {dailyCaloriesConsumed > 0 && (
                        <div className="pt-2 border-t border-violet-200 dark:border-violet-700">
                          <div className="flex items-start gap-2">
                            <span className="text-lg">
                              {(() => {
                                const proteinPct = ((dailyMacrosConsumed?.protein || 0) / (dailyMacros?.protein || 1)) * 100;
                                if (proteinPct < 70) return '⚠️';
                                if (proteinPct > 120) return '🔥';
                                return '✅';
                              })()}
                            </span>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {(() => {
                                const proteinPct = ((dailyMacrosConsumed?.protein || 0) / (dailyMacros?.protein || 1)) * 100;
                                if (proteinPct < 70) return 'Proteína baja. Agrega pollo, huevos o pescado.';
                                if (proteinPct > 120) return '¡Excelente consumo de proteína! Perfecto para músculo.';
                                return 'Balance de macros correcto. Sigue así 💪';
                              })()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Insights y Recomendaciones Personalizadas */}
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-rose-200 dark:border-rose-800">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Insights Personalizados</h4>
                    </div>
                    <div className="space-y-2">
                      {/* Insight 1: Consistencia */}
                      <div className="flex items-start gap-2">
                        <span className="text-base mt-0.5">
                          {currentStreak >= 7 ? '🔥' : currentStreak >= 3 ? '💪' : '🌱'}
                        </span>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {currentStreak >= 7 
                            ? `¡Racha de ${currentStreak} días! Eres imparable. Sigue así y los resultados vendrán solos.`
                            : currentStreak >= 3
                            ? `Llevas ${currentStreak} días seguidos. ¡3 más y completas una semana perfecta!`
                            : currentStreak === 1
                            ? '¡Buen inicio! La consistencia es clave. Regresa mañana para continuar.'
                            : 'Empieza tu racha hoy. Cada día cuenta para tu transformación.'}
                        </p>
                      </div>
                      
                      {/* Insight 2: Velocidad de Progreso */}
                      {totalWeightLoss !== 0 && daysActive >= 7 && (
                        <div className="flex items-start gap-2">
                          <span className="text-base mt-0.5">
                            {totalWeightLoss / (daysActive / 7) > 1 ? '⚠️' : totalWeightLoss / (daysActive / 7) > 0.3 ? '✅' : '📊'}
                          </span>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            {totalWeightLoss / (daysActive / 7) > 1
                              ? `Bajas ${(totalWeightLoss / (daysActive / 7)).toFixed(1)} kg/semana. Es muy rápido, modera el déficit para no perder músculo.`
                              : totalWeightLoss / (daysActive / 7) > 0.3
                              ? `Velocidad perfecta: ${(totalWeightLoss / (daysActive / 7)).toFixed(1)} kg/semana. Sostenible y saludable.`
                              : 'Progreso lento. Sé más estricto con el déficit y asegura proteína alta.'}
                          </p>
                        </div>
                      )}
                      
                      {/* Insight 3: Balance Calórico */}
                      {dailyCaloriesConsumed > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-base mt-0.5">
                            {dailyCaloriesConsumed > dailyCalories * 1.1 ? '🔴' : dailyCaloriesConsumed < dailyCalories * 0.5 ? '⚠️' : '🟢'}
                          </span>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            {dailyCaloriesConsumed > dailyCalories * 1.1
                              ? 'Te pasaste bastante hoy. No te culpes, mañana vuelve al plan.'
                              : dailyCaloriesConsumed < dailyCalories * 0.5
                              ? 'Muy pocas calorías para esta hora. Come más para no ralentizar metabolismo.'
                              : 'Balance calórico correcto. Termina el día cumpliendo tu meta.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </motion.div>
      </div>

      {/* Modal SUS Questionnaire */}
      <AnimatePresence>
        {showSUS && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSUS(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Evaluación de Usabilidad
                </h2>
                <button
                  onClick={() => setShowSUS(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>
              <SUSQuestionnaire 
                onComplete={(score) => {
                  console.log('✅ SUS Score recibido:', score);
                  setTimeout(() => {
                    setShowSUS(false);
                    alert(`¡Gracias por tu evaluación! Tu score SUS: ${score.toFixed(1)}/100\n\nEsto nos ayuda mucho a mejorar SnorxFit 💪`);
                  }, 3000);
                }} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeOverview;
