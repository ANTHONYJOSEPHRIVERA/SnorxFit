import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, TrendingDown, TrendingUp, Calendar, Award, 
  Download, Scale, Flame, Activity, Target, CheckCircle2,
  Apple, Beef, Cookie
} from 'lucide-react';

const Report = ({ userProfile, recentWeights = [], onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // week, month, all

  // Función helper para calcular racha (días consecutivos)
  const calculateStreak = (days) => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].active) streak++;
      else break;
    }
    return streak;
  };

  // Calcular estadísticas de peso
  const weightStats = useMemo(() => {
    if (!recentWeights || recentWeights.length === 0) {
      // Calcular meta razonable si no hay datos
      let goal = userProfile?.goalWeight || 0;
      const current = userProfile?.weight || 0;
      
      // Validar que la meta tenga sentido
      if (goal && current && Math.abs(goal - current) > 30) {
        // Meta ilógica, recalcular
        if (userProfile?.goal === 'lose') {
          goal = current - 5;
        } else if (userProfile?.goal === 'gain') {
          goal = current + 5;
        } else {
          goal = current;
        }
      }
      
      return {
        current: current,
        initial: current,
        change: 0,
        trend: 'stable',
        goal: goal,
        progress: 0
      };
    }

    const sortedWeights = [...recentWeights].sort((a, b) => new Date(a.date) - new Date(b.date));
    const initial = sortedWeights[0]?.weight || userProfile?.weight || 0;
    const current = sortedWeights[sortedWeights.length - 1]?.weight || userProfile?.weight || 0;
    const change = current - initial;
    
    // Validar meta de peso
    let goal = userProfile?.goalWeight || current;
    if (Math.abs(goal - current) > 30) {
      // Meta ilógica, recalcular basado en objetivo (10% del peso actual)
      if (userProfile?.goal === 'lose') {
        goal = Math.round(current * 0.90); // Perder 10%
      } else if (userProfile?.goal === 'gain') {
        goal = Math.round(current * 1.10); // Ganar 10%
      } else {
        goal = current; // Mantener
      }
    }
    
    let progress = 0;
    if (userProfile?.goal === 'lose' && initial > goal) {
      progress = Math.min(100, Math.max(0, ((initial - current) / (initial - goal)) * 100));
    } else if (userProfile?.goal === 'gain' && initial < goal) {
      progress = Math.min(100, Math.max(0, ((current - initial) / (goal - initial)) * 100));
    }

    return {
      current: current.toFixed(1),
      initial: initial.toFixed(1),
      change: change.toFixed(1),
      trend: change < -0.1 ? 'down' : change > 0.1 ? 'up' : 'stable',
      goal: goal.toFixed(1),
      progress: Math.round(progress)
    };
  }, [recentWeights, userProfile]);

  // Calcular estadísticas de calorías (de FoodLog)
  const calorieStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const savedData = localStorage.getItem(`foodLog_${dateStr}`);
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const meals = parsed.meals || {};
        const allFoods = Object.values(meals).flat();
        const totalCalories = allFoods.reduce((sum, food) => sum + (food.calories || 0), 0);
        last7Days.push({ date: dateStr, calories: totalCalories });
      } else {
        last7Days.push({ date: dateStr, calories: 0 });
      }
    }

    const avgCalories = last7Days.reduce((sum, day) => sum + day.calories, 0) / 7;
    const targetCalories = userProfile?.dailyCalories || 2000;

    return {
      today: last7Days[6]?.calories || 0,
      average: Math.round(avgCalories),
      target: targetCalories,
      adherence: targetCalories > 0 ? Math.round((avgCalories / targetCalories) * 100) : 0,
      history: last7Days
    };
  }, [userProfile]);

  // Calcular días activos
  const activityStats = useMemo(() => {
    const today = new Date();
    const last30Days = [];
    let activeDays = 0;

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const savedData = localStorage.getItem(`foodLog_${dateStr}`);
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const meals = parsed.meals || {};
        const hasData = Object.values(meals).flat().length > 0;
        if (hasData) activeDays++;
        last30Days.push({ date: dateStr, active: hasData });
      } else {
        last30Days.push({ date: dateStr, active: false });
      }
    }

    return {
      activeDays,
      totalDays: 30,
      streak: calculateStreak(last30Days),
      adherence: Math.round((activeDays / 30) * 100)
    };
  }, []);

  // Exportar datos
  const exportWeights = () => {
    const rows = [['Fecha', 'Peso (kg)'], ...(recentWeights.map(r => [r.date, r.weight]))];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snorxfit_pesos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAllData = () => {
    const data = {
      perfil: userProfile,
      pesos: recentWeights,
      fechaExportacion: new Date().toISOString()
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snorxfit_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            )}
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                📊 Reporte de Progreso
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Análisis completo de tu evolución
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportWeights}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Download size={16} />
              Exportar Pesos
            </button>
            <button
              onClick={exportAllData}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Download size={16} />
              Backup Completo
            </button>
          </div>
        </motion.div>

        {/* Tarjetas de Estadísticas Principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {/* Peso Actual */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <Scale className="w-8 h-8 opacity-80" />
              {weightStats.trend === 'down' && <TrendingDown className="w-6 h-6" />}
              {weightStats.trend === 'up' && <TrendingUp className="w-6 h-6" />}
            </div>
            <p className="text-sm opacity-90 font-medium">Peso Actual</p>
            <p className="text-4xl font-extrabold">{weightStats.current}</p>
            <p className="text-xs opacity-75">kg</p>
            <p className="text-sm mt-2 opacity-90">
              {weightStats.change > 0 ? '+' : ''}{weightStats.change} kg desde inicio
            </p>
          </div>

          {/* Progreso hacia Meta */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-xl">
            <Target className="w-8 h-8 opacity-80 mb-2" />
            <p className="text-sm opacity-90 font-medium">Progreso a Meta</p>
            <p className="text-4xl font-extrabold">{weightStats.progress}%</p>
            <p className="text-xs opacity-75">Meta: {weightStats.goal} kg</p>
            <div className="mt-2 w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white"
                style={{ width: `${weightStats.progress}%` }}
              />
            </div>
          </div>

          {/* Calorías Promedio */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-xl">
            <Flame className="w-8 h-8 opacity-80 mb-2" />
            <p className="text-sm opacity-90 font-medium">Calorías Promedio</p>
            <p className="text-4xl font-extrabold">{calorieStats.average}</p>
            <p className="text-xs opacity-75">kcal/día (últimos 7 días)</p>
            <p className="text-sm mt-2 opacity-90">
              Meta: {calorieStats.target} kcal
            </p>
          </div>

          {/* Días Activos */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-xl">
            <Activity className="w-8 h-8 opacity-80 mb-2" />
            <p className="text-sm opacity-90 font-medium">Días Activos</p>
            <p className="text-4xl font-extrabold">{activityStats.activeDays}</p>
            <p className="text-xs opacity-75">de {activityStats.totalDays} días</p>
            <p className="text-sm mt-2 opacity-90">
              🔥 Racha: {activityStats.streak} días
            </p>
          </div>
        </motion.div>

        {/* Sección de Logros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Logros Desbloqueados
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Logro: Primera semana */}
            {activityStats.activeDays >= 7 && (
              <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-900 dark:text-white">Primera Semana</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">7 días activo</p>
              </div>
            )}

            {/* Logro: Racha de 7 días */}
            {activityStats.streak >= 7 && (
              <div className="p-4 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-900 dark:text-white">Racha Semanal</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">7 días seguidos</p>
              </div>
            )}

            {/* Logro: Meta 50% */}
            {weightStats.progress >= 50 && (
              <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-900 dark:text-white">Mitad del Camino</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">50% completado</p>
              </div>
            )}

            {/* Logro: 10 registros de peso */}
            {recentWeights.length >= 10 && (
              <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-900 dark:text-white">Constancia</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">10+ pesadas</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Resumen Detallado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Resumen de Usuario */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              📋 Información del Usuario
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {userProfile?.name || 'No configurado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Edad:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {userProfile?.age || '-'} años
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Altura:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {userProfile?.height || '-'} cm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Objetivo:</span>
                <span className="font-semibold text-gray-900 dark:text-white capitalize">
                  {userProfile?.goal === 'lose' ? 'Perder peso' : 
                   userProfile?.goal === 'gain' ? 'Ganar músculo' : 
                   'Mantener peso'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Nivel de Actividad:</span>
                <span className="font-semibold text-gray-900 dark:text-white capitalize">
                  {userProfile?.activityLevel === 'sedentary' ? 'Sedentario' :
                   userProfile?.activityLevel === 'light' ? 'Ligero' :
                   userProfile?.activityLevel === 'moderate' ? 'Moderado' :
                   userProfile?.activityLevel === 'active' ? 'Activo' :
                   'Muy activo'}
                </span>
              </div>
            </div>
          </div>

          {/* Resumen de Registros */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              📊 Estadísticas de Registro
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Registros de Peso:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {recentWeights?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Días con Alimentos:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {activityStats.activeDays}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Adherencia (30d):</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {activityStats.adherence}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Racha Actual:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  🔥 {activityStats.streak} días
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Adherencia Calórica:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {calorieStats.adherence}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mensaje motivacional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-6 shadow-xl text-center"
        >
          <p className="text-lg font-bold mb-2">
            {weightStats.progress >= 75 ? '🎉 ¡Casi lo logras!' :
             weightStats.progress >= 50 ? '💪 ¡Vas por buen camino!' :
             weightStats.progress >= 25 ? '🚀 ¡Sigue así!' :
             activityStats.activeDays > 0 ? '🌟 ¡Gran inicio!' :
             '✨ ¡Comienza hoy tu transformación!'}
          </p>
          <p className="text-sm opacity-90">
            {weightStats.progress >= 75 ? 'Ya casi alcanzas tu meta. ¡No te rindas ahora!' :
             weightStats.progress >= 50 ? 'Estás a mitad de camino. La constancia es la clave.' :
             weightStats.progress >= 25 ? 'Cada día cuenta. Mantén el ritmo.' :
             activityStats.activeDays > 0 ? 'Has dado el primer paso. Ahora sigue adelante.' :
             'Regis tu progreso y alcanza tus metas de fitness.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Report;
