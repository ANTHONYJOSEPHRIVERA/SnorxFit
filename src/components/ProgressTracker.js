import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar, Award, Target, Scale, Activity, Star } from 'lucide-react';
import { SUSQuestionnaire } from './SUSQuestionnaire';
import { useAuth } from '../contexts/AuthContext';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const ProgressTracker = ({ userProfile, onBack = () => {} }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showSUS, setShowSUS] = useState(false);
  const [foodLogs, setFoodLogs] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Cargar datos reales desde Firebase
  useEffect(() => {
    const loadProgressData = async () => {
      if (!user?.uid) return;
      
      setLoading(true);
      try {
        console.log('📊 Cargando datos de progreso para:', user.uid);
        
        // Generar fechas de los últimos 7 días
        const today = new Date();
        const dates = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          dates.push(dateStr);
        }
        
        console.log('📅 Buscando datos para:', dates);
        
        // Cargar cada día individualmente
        const foodLogsRef = collection(db, `users/${user.uid}/foodLogs`);
        const logs = [];
        
        for (const dateStr of dates) {
          const docRef = doc(db, `users/${user.uid}/foodLogs`, dateStr);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            logs.push({
              id: dateStr,
              date: dateStr,
              ...data
            });
            console.log(`✅ Datos encontrados para ${dateStr}:`, data);
          }
        }
        
        setFoodLogs(logs);
        console.log('📊 Total food logs cargados:', logs.length);
        
        // Historial de peso se carga desde Firebase en App.js
        setWeightHistory([{ weight: userProfile?.weight || 0, date: new Date() }]);
        
      } catch (error) {
        console.error('❌ Error cargando datos de progreso:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, [user?.uid, userProfile?.weight]);

  // Calcular calorías por día de los últimos 7 días
  const calculateDailyCalories = () => {
    const dailyCalories = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    
    foodLogs.forEach(log => {
      if (log.meals) {
        const totalCalories = Object.values(log.meals)
          .flat()
          .reduce((sum, food) => sum + (food.calories || 0), 0);
        
        // El log.date es un string YYYY-MM-DD
        const logDate = new Date(log.date);
        const diffDays = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
        
        console.log(`📅 ${log.date}: ${totalCalories} kcal (hace ${diffDays} días)`);
        
        if (diffDays >= 0 && diffDays < 7) {
          dailyCalories[6 - diffDays] = totalCalories;
        }
      }
    });
    
    console.log('📊 Calorías diarias calculadas:', dailyCalories);
    return dailyCalories;
  };

  // Calcular promedio de calorías
  const calculateAverageCalories = () => {
    const dailyCalories = calculateDailyCalories();
    const nonZeroDays = dailyCalories.filter(cal => cal > 0);
    
    if (nonZeroDays.length === 0) return 0;
    
    const avg = nonZeroDays.reduce((sum, cal) => sum + cal, 0) / nonZeroDays.length;
    return Math.round(avg);
  };

  // Calcular días con registro
  const calculateDaysWithLogs = () => {
    return foodLogs.length;
  };

  // Asegurar que el peso sea un número válido
  const userWeight = parseFloat(userProfile?.weight) || 0;
  
  // Obtener calorías diarias reales
  const dailyCaloriesData = calculateDailyCalories();
  const averageCalories = calculateAverageCalories();
  const daysWithLogs = calculateDaysWithLogs();

  // Progress data - AHORA CON DATOS REALES
  const progressData = {
    week: {
      workouts: [0, 0, 0, 0, 0, 0, 0], // Ejercicios no implementados (fuera de alcance)
      weight: userWeight > 0 ? [userWeight, userWeight, userWeight, userWeight, userWeight, userWeight, userWeight] : [0, 0, 0, 0, 0, 0, 0],
      calories: dailyCaloriesData
    },
    month: {
      workouts: [0, 0, 0, 0],
      weight: userWeight > 0 ? [userWeight, userWeight, userWeight, userWeight] : [0, 0, 0, 0],
      calories: [0, 0, 0, 0] // Pendiente: datos mensuales (solo hay semanales por ahora)
    }
  };

  const currentData = progressData[selectedPeriod];
  const labels = selectedPeriod === 'week' 
    ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    : ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];

  const currentStreak = userProfile?.currentStreak || 0;
  const longestStreak = userProfile?.longestStreak || 0;

  const achievements = [
    {
      title: 'Primera Sesión',
      description: 'Inicia sesión por primera vez',
      icon: '🎯',
      date: currentStreak >= 1 ? 'Desbloqueado' : 'Próximamente',
      unlocked: currentStreak >= 1
    },
    {
      title: 'Racha de 3 Días',
      description: 'Inicia sesión 3 días consecutivos',
      icon: '🔥',
      date: longestStreak >= 3 ? 'Desbloqueado' : 'Próximamente',
      unlocked: longestStreak >= 3
    },
    {
      title: 'Racha de 7 Días',
      description: 'Inicia sesión toda una semana',
      icon: '🏆',
      date: longestStreak >= 7 ? 'Desbloqueado' : 'Próximamente',
      unlocked: longestStreak >= 7
    },
    {
      title: 'Primer Registro',
      description: 'Registra tus alimentos por primera vez',
      icon: '📝',
      date: daysWithLogs >= 1 ? 'Desbloqueado' : 'Próximamente',
      unlocked: daysWithLogs >= 1
    },
    {
      title: 'Registro Constante',
      description: 'Registra alimentos 5 días en una semana',
      icon: '💪',
      date: daysWithLogs >= 5 ? 'Desbloqueado' : 'Próximamente',
      unlocked: daysWithLogs >= 5
    },
    {
      title: 'Semana Completa',
      description: 'Registra alimentos todos los días de la semana',
      icon: '⭐',
      date: daysWithLogs >= 7 ? 'Desbloqueado' : 'Próximamente',
      unlocked: daysWithLogs >= 7
    }
  ];

  const stats = [
    {
      label: 'Peso Actual',
      value: `${userWeight > 0 ? userWeight.toFixed(1) : '0'} kg`,
      change: userWeight > 0 ? 'Registrado' : 'Registra tu peso',
      icon: Scale,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Días con Registro',
      value: `${daysWithLogs} días`,
      change: daysWithLogs > 0 ? '¡Vas muy bien!' : 'Empieza a registrar',
      icon: Award,
      color: 'from-orange-500 to-red-500'
    },
    {
      label: 'Calorías Promedio',
      value: averageCalories > 0 ? averageCalories.toString() : '0',
      change: averageCalories > 0 ? `${daysWithLogs} días registrados` : 'Registra tus comidas',
      icon: Target,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Racha Actual',
      value: `${currentStreak} días`,
      change: currentStreak > 0 ? `Récord: ${longestStreak} días` : 'Inicia sesión diariamente',
      icon: Activity,
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto">
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Progreso</h1>
                <p className="text-gray-600 dark:text-gray-400">Seguimiento de tu evolución fitness</p>
              </div>
            </div>
            
            {/* Botón Evaluar App */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSUS(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transition-shadow"
              title="Evaluar usabilidad de SnorxFit"
            >
              <Star className="w-5 h-5" />
              <span className="hidden sm:inline">Evaluar App</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Period Selector - Movido fuera del header */}
        <div className="flex justify-end gap-2 mb-6">
          {['week', 'month'].map((period) => (
            <motion.button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {period === 'week' ? 'Semana' : 'Mes'}
            </motion.button>
          ))}
        </div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg dark:bg-gray-800/90 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 font-semibold">{stat.change}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rachas Widget */}
          <motion.div
            className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 backdrop-blur-xl border border-orange-200/50 dark:border-orange-800/50 rounded-3xl p-8 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">🔥 Tus Rachas</h2>
            </div>
            
            <div className="space-y-6">
              {/* Racha de Login */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Racha de Sesión</p>
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-extrabold text-orange-600 dark:text-orange-400">
                    {userProfile?.currentStreak || 0}
                  </p>
                  <p className="text-lg text-gray-500 dark:text-gray-400">días</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {(userProfile?.currentStreak || 0) > 0 
                    ? `¡Has iniciado sesión ${userProfile?.currentStreak} días seguidos!` 
                    : 'Inicia sesión diariamente para comenzar tu racha'}
                </p>
              </div>

              {/* Récord Personal */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Récord Personal</p>
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-extrabold text-red-600 dark:text-red-400">
                    {userProfile?.longestStreak || 0}
                  </p>
                  <p className="text-lg text-gray-500 dark:text-gray-400">días</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {(userProfile?.longestStreak || 0) > 0 
                    ? `Tu mejor racha fue de ${userProfile?.longestStreak} días consecutivos` 
                    : 'Aún no tienes un récord registrado'}
                </p>
              </div>

              {/* Racha de Registro de Alimentos */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Racha de Registro</p>
                  <span className="text-2xl">📝</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-extrabold text-green-600 dark:text-green-400">
                    {daysWithLogs}
                  </p>
                  <p className="text-lg text-gray-500 dark:text-gray-400">días</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {daysWithLogs > 0 
                    ? `Has registrado alimentos ${daysWithLogs} días en la última semana` 
                    : 'Comienza a registrar tus comidas diariamente'}
                </p>
              </div>

              {/* Motivación */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-4 text-center">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
                  {(userProfile?.currentStreak || 0) >= 7 
                    ? '¡Increíble! Mantén el ritmo 💪' 
                    : (userProfile?.currentStreak || 0) >= 3 
                      ? '¡Vas muy bien! Sigue así 🎯' 
                      : '¡Empieza tu racha hoy! 🚀'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl dark:bg-gray-800/90 dark:border-gray-700"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Logros</h2>
            </div>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    achievement.unlocked
                      ? 'border-green-200 bg-green-50/50 dark:bg-green-900/50'
                      : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-700/50'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${achievement.unlocked ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        {achievement.description}
                      </p>
                      <p className={`text-xs font-medium mt-1 ${achievement.unlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        {achievement.date}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Weight Progress */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 mt-8 shadow-xl dark:bg-gray-800/90 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Scale className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Evolución del Peso</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Progreso {selectedPeriod === 'week' ? 'Semanal' : 'Mensual'}</h3>
              <div className="space-y-3">
                {currentData.weight.map((weight, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl dark:bg-gray-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">{labels[index]}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">{weight.toFixed(1)} kg</span>
                      {index > 0 && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          weight < currentData.weight[index - 1]
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : weight > currentData.weight[index - 1]
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                        }`}>
                          {weight < currentData.weight[index - 1] ? '↓' : weight > currentData.weight[index - 1] ? '↑' : '→'}
                          {Math.abs(weight - currentData.weight[index - 1]).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resumen</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200 dark:bg-green-900 dark:border-green-700">
                  <p className="text-green-800 dark:text-green-300 font-semibold">Peso Inicial</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-200">{userProfile.weight} kg</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 dark:bg-blue-900 dark:border-blue-700">
                  <p className="text-blue-800 dark:text-blue-300 font-semibold">Peso Actual</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{currentData.weight[currentData.weight.length - 1].toFixed(1)} kg</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 dark:bg-purple-900 dark:border-purple-700">
                  <p className="text-purple-800 dark:text-purple-300 font-semibold">Cambio Total</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                    {(currentData.weight[currentData.weight.length - 1] - userProfile.weight).toFixed(1)} kg
                  </p>
                </div>
              </div>
            </div>
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

export default ProgressTracker;