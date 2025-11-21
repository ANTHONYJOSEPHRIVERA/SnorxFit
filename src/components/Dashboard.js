import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, Target, TrendingUp, Calendar, Award, Sun, Moon, RefreshCcw, Goal, Bell, LogOut, Wifi, WifiOff, Star } from 'lucide-react';
import { calculateBMI, getBMICategory, calculateBMR, calculateDailyCalories } from '../utils/calculations';
import { SUSQuestionnaire } from './SUSQuestionnaire';

// Helpers de traducción para evitar ternarios repetidos
const goalLabels = {
  lose: 'Perder',
  gain: 'Ganar',
  maintain: 'Mantener'
};
const fitnessLevelLabels = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado'
};

const getGoalLabel = (goal) => goalLabels[goal] || 'Mantener';
const getFitnessLabel = (level) => fitnessLevelLabels[level] || 'Principiante';

const Dashboard = ({ userProfile, onNavigate = () => {}, toggleDarkMode, isDarkMode, user, onLogout, isOnline = true }) => {
  const [showSUS, setShowSUS] = useState(false);
  
  // Salvaguardas si todavía no hay perfil
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
        Cargando perfil...
      </div>
    );
  }

  const bmi = calculateBMI(userProfile.weight, userProfile.height);
  const bmiCategory = getBMICategory(parseFloat(bmi) || 0);
  const bmr = calculateBMR(userProfile.weight, userProfile.height, userProfile.age, userProfile.gender);
  const dailyCalories = calculateDailyCalories(bmr, userProfile.activityLevel, userProfile.goal);

  const stats = [
    {
      icon: Activity,
      label: 'IMC',
      value: bmi,
      subtitle: bmiCategory.category,
      color: 'from-blue-500 to-cyan-500',
      textColor: bmiCategory.color
    },
    {
      icon: TrendingUp,
      label: 'Calorías',
      value: dailyCalories,
      subtitle: 'kcal/día',
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-600'
    }
  ];

  const quickActions = [
    {
      title: 'Ejercicios',
      description: 'Tu rutina personalizada',
      icon: Activity,
      color: 'from-blue-500 to-purple-600',
      action: () => onNavigate('workout')
    },
    {
      title: 'Nutrición',
      description: 'Plan de comidas',
      icon: Target,
      color: 'from-green-500 to-teal-600',
      action: () => onNavigate('nutrition')
    }
  ];

  // Mock data for goals and notifications
  const goalProgress = 70; // Example: 70% towards weight goal
  const streakDays = 7; // Example: 7-day workout streak
  const notifications = [
    { id: 1, type: 'streak', message: `¡Felicidades! Llevas ${streakDays} días de racha.`, icon: Award, color: 'text-yellow-500' },
    { id: 2, type: 'reminder', message: 'No olvides registrar tu peso de hoy.', icon: Bell, color: 'text-blue-500' },
    { id: 3, type: 'goal', message: `¡Estás a un ${100 - goalProgress}% de tu meta de peso!`, icon: Goal, color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 mb-8 shadow-xl dark:bg-gray-800/90 dark:border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <User className="w-10 h-10 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  ¡Hola, {userProfile.name}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                Bienvenido a tu perfil
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Usuario: {user.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Botón SUS Questionnaire */}
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

              {/* Indicador de conexión */}
              <motion.div
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                  isOnline 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}
                whileHover={{ scale: 1.05 }}
                title={isOnline ? 'Conectado a la API' : 'Modo offline - usando datos locales'}
              >
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {isOnline ? 'Online' : 'Offline'}
              </motion.div>

              <motion.button
                onClick={toggleDarkMode}
                className={`relative p-3 rounded-full transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg shadow-orange-500/25' 
                    : 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-500/25'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDarkMode ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </motion.div>
              </motion.button>
              
              <motion.button
                onClick={onLogout}
                className="p-3 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Cerrar sesión"
              >
                <LogOut className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Mensaje de bienvenida con Snorlax */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-blue-200/50 dark:border-gray-600"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">😴</span>
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  ¡Snorlax está aquí para apoyarte en tu jornada fitness!
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  "Recuerda: hasta yo hago ejercicio... cuando no estoy durmiendo 💪"
                  {!isOnline && (
                    <span className="ml-2 text-orange-600 dark:text-orange-400">
                      (Modo offline - datos guardados localmente)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Goal Progress Bar */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-8 shadow-xl dark:bg-gray-800/90 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <Goal className="w-8 h-8 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tu Meta de Peso</h2>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 1.5, delay: 0.5 }}
            ></motion.div>
          </div>
          <p className="text-right text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">{goalProgress}% Completado</p>
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-8 shadow-xl dark:bg-gray-800/90 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <Bell className="w-8 h-8 text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notificaciones y Recordatorios</h2>
          </div>
          <div className="space-y-3">
            {notifications.map(notif => (
              <motion.div
                key={notif.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <notif.icon className={`w-5 h-5 ${notif.color}`} />
                <p className="text-gray-700 dark:text-gray-300">{notif.message}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg dark:bg-gray-800/90 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
              <p className={`text-sm font-semibold ${stat.textColor}`}>
                {stat.subtitle}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              onClick={action.action}
              className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-lg text-left hover:shadow-xl transition-all duration-300 dark:bg-gray-800/90 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{action.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{action.description}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Today's Summary */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl dark:bg-gray-800/90 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resumen de Hoy</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 dark:from-gray-700 dark:to-gray-600 dark:border-gray-600">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Ejercicios</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">0 / 3 completados</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 dark:from-gray-700 dark:to-gray-600 dark:border-gray-600">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Calorías</h3>
              <p className="text-green-600 dark:text-green-400 font-semibold">0 / {dailyCalories} kcal</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50 dark:from-gray-700 dark:to-gray-600 dark:border-gray-600">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">Racha</h3>
              <p className="text-purple-600 dark:text-purple-400 font-semibold">1 día</p>
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
                  console.log('✅ SUS Score recibido en Dashboard:', score);
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

export default Dashboard;