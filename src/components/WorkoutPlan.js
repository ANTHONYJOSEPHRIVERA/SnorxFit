import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Clock, Flame, Star, CheckCircle, RotateCcw } from 'lucide-react';
import { exerciseDatabase } from '../data/exercises';
import { generateWorkoutPlan } from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Helper: Obtener fecha local en formato YYYY-MM-DD (SIN conversión a UTC)
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const WorkoutPlan = ({ userProfile, onBack = () => {} }) => {
  const { user, isOnline } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const today = getLocalDateString();

  const workoutIds = generateWorkoutPlan(userProfile.fitnessLevel, userProfile.goal, 30);
  const todayWorkout = exerciseDatabase.filter(exercise => workoutIds.includes(exercise.id));

  // Cargar ejercicios completados del día desde Firebase
  useEffect(() => {
    const loadCompletedExercises = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // 1. Cargar desde localStorage (cache)
        const cached = localStorage.getItem(`workout_${today}`);
        if (cached) {
          const completed = JSON.parse(cached);
          setCompletedExercises(new Set(completed));
        }
        
        // 2. Cargar desde Firebase si estamos online
        if (isOnline) {
          const workoutRef = doc(db, 'users', user.uid, 'workouts', today);
          const workoutSnap = await getDoc(workoutRef);
          
          if (workoutSnap.exists()) {
            const data = workoutSnap.data();
            const completedIds = data.exercises
              .filter(ex => ex.completed)
              .map(ex => ex.id);
            
            console.log('📥 Workout cargado desde Firebase:', completedIds.length, 'completados');
            setCompletedExercises(new Set(completedIds));
            
            // Actualizar cache
            localStorage.setItem(`workout_${today}`, JSON.stringify(completedIds));
          }
        }
      } catch (error) {
        console.error('❌ Error al cargar workout:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCompletedExercises();
  }, [user, isOnline, today]);

  const handleCompleteExercise = async (exerciseId) => {
    if (!user) return;
    
    // 1. Actualizar estado local inmediatamente
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      
      // 2. Guardar en localStorage (instantáneo)
      localStorage.setItem(`workout_${today}`, JSON.stringify([...newSet]));
      
      // 3. Guardar en Firebase si estamos online (async)
      if (isOnline) {
        saveWorkoutToFirebase(newSet);
      }
      
      return newSet;
    });
  };

  const saveWorkoutToFirebase = async (completedSet) => {
    if (!user || !isOnline) return;
    
    try {
      const exercises = todayWorkout.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        duration: exercise.duration,
        calories: exercise.calories,
        completed: completedSet.has(exercise.id),
        completedAt: completedSet.has(exercise.id) ? new Date() : null
      }));
      
      const totalDuration = todayWorkout
        .filter(ex => completedSet.has(ex.id))
        .reduce((sum, ex) => sum + ex.duration, 0);
      
      const totalCalories = todayWorkout
        .filter(ex => completedSet.has(ex.id))
        .reduce((sum, ex) => sum + ex.calories, 0);
      
      const workoutData = {
        date: today,
        exercises,
        totalDuration,
        totalCalories,
        completedCount: completedSet.size,
        totalExercises: todayWorkout.length,
        updatedAt: new Date()
      };
      
      const workoutRef = doc(db, 'users', user.uid, 'workouts', today);
      await setDoc(workoutRef, workoutData, { merge: true });
      
      console.log('💾 Workout guardado en Firebase:', completedSet.size, '/', todayWorkout.length);
    } catch (error) {
      console.error('❌ Error al guardar workout en Firebase:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-emerald-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'hard': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'cardio': return '🏃‍♂️';
      case 'strength': return '💪';
      case 'flexibility': return '🧘‍♀️';
      default: return '🏋️‍♂️';
    }
  };

  const totalCalories = todayWorkout.reduce((sum, exercise) => sum + exercise.calories, 0);
  const totalDuration = todayWorkout.reduce((sum, exercise) => sum + exercise.duration, 0);
  const completedCount = completedExercises.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-8 shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onBack}
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tu Plan de Ejercicios</h1>
                <p className="text-gray-600">Rutina personalizada para {userProfile.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Progreso de hoy</p>
              <p className="text-2xl font-bold text-indigo-600">{completedCount}/{todayWorkout.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Workout Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600 font-medium">Duración Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalDuration} min</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span className="text-gray-600 font-medium">Calorías Estimadas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalCalories} kcal</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-purple-600" />
              <span className="text-gray-600 font-medium">Nivel</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 capitalize">{userProfile.fitnessLevel}</p>
          </div>
        </motion.div>

        {/* Exercise List */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {todayWorkout.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              className={`bg-white/90 backdrop-blur-xl border-2 rounded-2xl p-6 shadow-lg transition-all duration-300 ${
                completedExercises.has(exercise.id)
                  ? 'border-green-300 bg-green-50/50'
                  : 'border-gray-200/50 hover:border-indigo-300'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl">{getCategoryIcon(exercise.category)}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{exercise.name}</h3>
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(exercise.difficulty)} text-white text-xs font-semibold uppercase`}>
                        {exercise.difficulty}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{exercise.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{exercise.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        <span>{exercise.calories} kcal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🏋️‍♂️</span>
                        <span>{exercise.equipment}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => setSelectedExercise(exercise)}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-4 h-4 inline mr-2" />
                    Ver Detalles
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleCompleteExercise(exercise.id)}
                    className={`p-3 rounded-xl transition-all ${
                      completedExercises.has(exercise.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {completedExercises.has(exercise.id) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <RotateCcw className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Exercise Detail Modal */}
        <AnimatePresence>
          {selectedExercise && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExercise(null)}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedExercise.name}</h2>
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                    <p className="text-gray-600">{selectedExercise.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Instrucciones</h3>
                    <ol className="space-y-2">
                      {selectedExercise.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-600">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">Duración</p>
                      <p className="text-xl font-bold text-gray-900">{selectedExercise.duration} min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">Calorías</p>
                      <p className="text-xl font-bold text-gray-900">{selectedExercise.calories} kcal</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkoutPlan;