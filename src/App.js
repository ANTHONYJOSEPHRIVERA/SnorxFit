import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthScreen from './components/AuthScreen';
import LoadingScreen from './components/LoadingScreen';
import UserProfileForm from './components/UserProfileForm';
import Dashboard from './components/Dashboard';
import HomeOverview from './components/HomeOverview';
import WorkoutPlan from './components/WorkoutPlan';
import NutritionPlan from './components/NutritionPlan';
import ProgressTracker from './components/ProgressTracker';
import FoodSelection from './components/FoodSelection';
import Chatbot from './components/Chatbot';
import WeightTracker from './components/WeightTracker';
import MoodDiary from './components/MoodDiary';
import Report from './components/Report';
import RemindersManager from './components/RemindersManager';
import PhotoGallery from './components/PhotoGallery';
import FoodScanner from './components/FoodScanner';
import Settings from './components/Settings';
import FoodLog from './components/FoodLog';
import AdminDashboard from './components/AdminDashboard';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import testApiConnection from './utils/testApi';
import { isUserAdmin } from './config/adminConfig'; // Configuración de admins
import AppLayout from './layout/AppLayout';
import { ToastProvider } from './contexts/ToastContext';
import { flushQueue } from './utils/offlineQueue';
// import { weightApi, moodApi, reminderApi } from './services/apiService'; // REMOVIDO - Migrado a Firebase
import { calculateBMR, calculateDailyCalories, calculateMacros } from './utils/calculations';
import { validateAndFixUserProfile } from './utils/profileValidator';
import './utils/fixGoalWeight'; // Script para corregir metas de peso ilógicas
import './utils/recalculateCalories'; // Script para recalcular calorías y macros
import './utils/cleanupStorage'; // Utilidades de limpieza de localStorage
import testConnectivity from './utils/testConnectivity'; // Test de conectividad Firebase
import { doc, getDoc, setDoc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './config/firebase';

// Hacer funciones disponibles globalmente para debug
if (typeof window !== 'undefined') {
  window.testApiConnection = testApiConnection;
  window.testConnectivity = testConnectivity;
  console.log('🧪 Testing disponible:');
  console.log('  - window.testApiConnection() - Probar Gemini API');
  console.log('  - window.testConnectivity() - Probar Firebase y conectividad completa');
}

// Componente principal de la aplicación autenticada
const AuthenticatedApp = () => {
  const { user, logout, isOnline } = useAuth();
  // Sincronizar cola offline cuando volvemos online
  // TODO: Migrar a Firebase
  useEffect(()=> {
    if (!isOnline || !user) return;
    // (async () => {
    //   await flushQueue({
    //     'weight:add': async ({ weight, date }) => {
    //       const r = await weightApi.add(weight); return r.success;
    //     },
    //     'mood:add': async ({ mood, note }) => {
    //       const r = await moodApi.add(mood, note); return r.success;
    //     },
    //     'reminder:add': async ({ type, scheduledAt, message }) => {
    //       const r = await reminderApi.add(type, scheduledAt, message); return r.success;
    //     }
    //   });
    // })();
  }, [isOnline, user]);
  const [userProfile, setUserProfile] = useState(null);
  const [currentView, setCurrentView] = useState('profile');
  const [recentWeights, setRecentWeights] = useState([]);
  const [dailyMacros, setDailyMacros] = useState({ protein: 0, carbs: 0, fat: 0 });
  const [dailyCaloriesConsumed, setDailyCaloriesConsumed] = useState(0); // Calorías consumidas HOY
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Cargar preferencia de tema desde localStorage
    const savedTheme = localStorage.getItem('snorxfit_theme');
    return savedTheme === 'dark';
  });
  const [selectedFoods, setSelectedFoods] = useState({});
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    // Aplicar dark class al elemento html y guardar preferencia
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('snorxfit_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('snorxfit_theme', 'light');
    }
  }, [isDarkMode]);

  // Cargar macros y calorías consumidas del día actual desde localStorage y Firebase
  useEffect(() => {
    const loadTodayFoodData = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // 1. Intentar cargar desde localStorage primero (más rápido)
      const savedData = localStorage.getItem(`foodLog_${today}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const meals = parsed.meals || {};
        const allFoods = Object.values(meals).flat();
        
        const macros = {
          protein: allFoods.reduce((sum, food) => sum + (food.protein || 0), 0),
          carbs: allFoods.reduce((sum, food) => sum + (food.carbs || 0), 0),
          fat: allFoods.reduce((sum, food) => sum + (food.fat || 0), 0)
        };
        
        const calories = allFoods.reduce((sum, food) => sum + (food.calories || 0), 0);
        
        setDailyMacros(macros);
        setDailyCaloriesConsumed(calories);
        
        console.log('📊 Datos de hoy cargados (localStorage):', {
          fecha: today,
          calorías: calories,
          macros
        });
      }
      
      // 2. Si hay usuario y conexión, sincronizar desde Firebase
      if (user?.uid && isOnline) {
        try {
          const foodLogRef = doc(db, 'users', user.uid, 'foodLogs', today);
          const foodLogSnap = await getDoc(foodLogRef);
          
          if (foodLogSnap.exists()) {
            const firebaseData = foodLogSnap.data();
            const meals = firebaseData.meals || {};
            const allFoods = Object.values(meals).flat();
            
            const macros = {
              protein: allFoods.reduce((sum, food) => sum + (food.protein || 0), 0),
              carbs: allFoods.reduce((sum, food) => sum + (food.carbs || 0), 0),
              fat: allFoods.reduce((sum, food) => sum + (food.fat || 0), 0)
            };
            
            const calories = allFoods.reduce((sum, food) => sum + (food.calories || 0), 0);
            
            setDailyMacros(macros);
            setDailyCaloriesConsumed(calories);
            
            console.log('📊 Datos de hoy actualizados desde Firebase:', {
              fecha: today,
              calorías: calories,
              macros
            });
          }
        } catch (error) {
          console.error('❌ Error cargando datos de hoy desde Firebase:', error);
        }
      }
    };
    
    loadTodayFoodData();
    
    // Recargar cada vez que cambie la vista (para actualizar después de registrar comidas)
    const interval = setInterval(loadTodayFoodData, 5000); // Actualizar cada 5 segundos
    
    return () => clearInterval(interval);
  }, [user?.uid, isOnline, currentView]);

  // Cargar perfil del usuario desde la API
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoadingProfile(true);

        const userId = user.uid || user.id; // Firebase usa uid

        if (!isOnline) {
          // Fallback a localStorage si no hay internet
          const savedProfile = localStorage.getItem(`snorxfit_profile_${userId}`);
          if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            setUserProfile(profile);
            setCurrentView('home');
          }
          setIsLoadingProfile(false);
          return;
        }

        // ✅ Cargar perfil desde Firebase Firestore
        console.log('📊 Cargando perfil desde Firebase Firestore...');
        console.log('🔑 User ID:', userId);
        
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const profile = userDocSnap.data();
          console.log('✅ Perfil encontrado en Firebase:', {
            nombre: profile.name,
            email: profile.email,
            uid: userId
          });
          
          // 🔧 VALIDACIÓN AUTOMÁTICA DE CALORÍAS
          console.log('🔍 Validando y corrigiendo calorías del perfil...');
          const validationResult = await validateAndFixUserProfile(userId);
          
          if (validationResult.wasCorrected) {
            console.log('⚠️ CALORÍAS CORREGIDAS AUTOMÁTICAMENTE');
            console.log(`   Antes: ${validationResult.oldCalories} kcal`);
            console.log(`   Ahora: ${validationResult.newCalories} kcal`);
            console.log(`   Diferencia: ${Math.abs(validationResult.newCalories - validationResult.oldCalories)} kcal`);
            
            // Mostrar notificación al usuario
            alert(`⚠️ Actualización Importante\n\nHemos recalculado tus calorías diarias para mayor precisión:\n\nAntes: ${validationResult.oldCalories} kcal\nAhora: ${validationResult.newCalories} kcal\n\nEsto se hizo automáticamente según tus datos (peso, altura, edad, objetivo).`);
          }
          
          // Verificar si el perfil está COMPLETO (tiene los campos necesarios)
          const isProfileComplete = profile.weight && profile.height && profile.age && profile.goal;
          
          console.log('🔍 Verificación de perfil:', {
            weight: profile.weight,
            weightType: typeof profile.weight,
            height: profile.height,
            heightType: typeof profile.height,
            age: profile.age,
            ageType: typeof profile.age,
            goal: profile.goal,
            goalWeight: profile.goalWeight,
            isProfileComplete: isProfileComplete
          });
          
          console.log('📋 PERFIL COMPLETO DE FIREBASE:', JSON.stringify(profile, null, 2));
          
          if (isProfileComplete) {
            console.log('✅ Perfil completo, cargando dashboard...');
            
            // 🔥 ACTUALIZAR RACHA AL CARGAR PERFIL
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let currentStreak = profile.currentStreak || 0;
            let longestStreak = profile.longestStreak || 0;
            let lastLoginDate = profile.lastLoginDate ? new Date(profile.lastLoginDate) : null;
            let streakUpdated = false;
            
            // Corregir racha en 0
            if (currentStreak === 0) {
              console.log('🔧 Racha en 0, corrigiendo a 1');
              currentStreak = 1;
              longestStreak = Math.max(longestStreak, 1);
              streakUpdated = true;
            }
            
            // Actualizar racha según último login
            if (lastLoginDate) {
              lastLoginDate.setHours(0, 0, 0, 0);
              const diffTime = today.getTime() - lastLoginDate.getTime();
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays === 0) {
                // Mismo día, solo actualizar si estaba en 0
                if (profile.currentStreak === 0) {
                  console.log('🔧 Mismo día pero racha estaba en 0, corrigiendo');
                  streakUpdated = true;
                }
              } else if (diffDays === 1) {
                // Día consecutivo
                currentStreak += 1;
                if (currentStreak > longestStreak) {
                  longestStreak = currentStreak;
                }
                console.log('🔥 Racha incrementada:', currentStreak);
                streakUpdated = true;
              } else if (diffDays > 1) {
                // Racha rota
                console.log('💔 Racha rota, reiniciando');
                currentStreak = 1;
                streakUpdated = true;
              }
            }
            
            // Guardar racha actualizada en Firebase
            if (streakUpdated) {
              profile.currentStreak = currentStreak;
              profile.longestStreak = longestStreak;
              profile.lastLoginDate = today.toISOString().split('T')[0];
              
              try {
                await updateDoc(userDocRef, {
                  currentStreak: currentStreak,
                  longestStreak: longestStreak,
                  lastLoginDate: today.toISOString().split('T')[0],
                  lastLogin: new Date().toISOString()
                });
                console.log('✅ Racha actualizada:', currentStreak, 'días | Récord:', longestStreak);
              } catch (error) {
                console.error('❌ Error actualizando racha:', error);
              }
            }
            
            // ⚠️ VALIDACIÓN: Si no tiene dailyCalories, calcularlos y guardar
            if (!profile.dailyCalories || !profile.dailyMacros) {
              console.log('⚠️ Perfil sin calorías/macros, recalculando...');
              
              const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
              const dailyCalories = calculateDailyCalories(bmr, profile.activityLevel, profile.goal);
              const macros = calculateMacros(dailyCalories, profile.weight, profile.goal);
              
              // Actualizar perfil con valores calculados
              profile.dailyCalories = dailyCalories;
              profile.dailyMacros = macros;
              
              // Guardar en Firebase
              try {
                await setDoc(userDocRef, {
                  dailyCalories: dailyCalories,
                  dailyMacros: macros,
                  updatedAt: new Date().toISOString()
                }, { merge: true });
                
                console.log('✅ Calorías y macros calculados y guardados:', {
                  dailyCalories,
                  macros
                });
              } catch (error) {
                console.error('❌ Error guardando calorías:', error);
              }
            }
            
            setUserProfile(profile);
            
            // Guardar en localStorage como caché
            localStorage.setItem(`snorxfit_profile_${userId}`, JSON.stringify(profile));
            
            setCurrentView('home');
          } else {
            console.log('⚠️ Perfil incompleto, mostrando formulario...');
            console.log('❌ Campos faltantes:', {
              weight: !profile.weight ? 'FALTA' : 'OK',
              height: !profile.height ? 'FALTA' : 'OK',
              age: !profile.age ? 'FALTA' : 'OK',
              goal: !profile.goal ? 'FALTA' : 'OK'
            });
            setUserProfile(profile); // Guardar lo que hay para pre-llenar el form
            setCurrentView('profile');
          }
        } else {
          // Si no existe en Firebase, intentar cargar desde localStorage (usuario antiguo)
          const savedProfile = localStorage.getItem(`snorxfit_profile_${userId}`);
          if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            const isProfileComplete = profile.weight && profile.height && profile.age && profile.goal;
            
            if (isProfileComplete) {
              setUserProfile(profile);
              setCurrentView('home');
              console.log('📱 Perfil completo cargado desde localStorage');
            } else {
              setUserProfile(profile);
              setCurrentView('profile');
              console.log('📱 Perfil incompleto en localStorage, mostrando formulario');
            }
          } else {
            console.log('📝 No hay perfil, mostrando formulario de creación');
            setCurrentView('profile');
          }
        }

      } catch (error) {
        console.error('Error cargando perfil:', error);
        // Fallback a localStorage en caso de error
        const userId = user.uid || user.id;
        const savedProfile = localStorage.getItem(`snorxfit_profile_${userId}`);
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setUserProfile(profile);
          setCurrentView('home');
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user, isOnline]);

  // Cargar pesos para HomeOverview desde Firebase
  useEffect(()=>{
    const loadWeights = async () => {
      if (!user?.uid) return;
      
      try {
        console.log('📊 Cargando pesos desde Firebase...');
        
        // 1. Intentar cargar desde localStorage primero (cache)
        const cachedWeights = localStorage.getItem(`snorxfit_weights_${user.uid}`);
        if (cachedWeights) {
          const parsed = JSON.parse(cachedWeights);
          setRecentWeights(parsed);
          console.log('📥 Pesos cargados desde cache:', parsed.length);
        }
        
        // 2. Si estamos online, sincronizar desde Firebase
        if (isOnline) {
          const weightsRef = collection(db, 'users', user.uid, 'weights');
          const q = query(weightsRef, orderBy('date', 'desc'), limit(60));
          const querySnapshot = await getDocs(q);
          
          const firebaseWeights = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            firebaseWeights.push({
              id: doc.id,
              date: data.date,
              weight: data.weight
            });
          });
          
          // Ordenar por fecha ascendente
          const sortedWeights = firebaseWeights.reverse();
          console.log('✅ Pesos cargados desde Firebase:', sortedWeights.length);
          
          setRecentWeights(sortedWeights);
          localStorage.setItem(`snorxfit_weights_${user.uid}`, JSON.stringify(sortedWeights));
        }
      } catch (error) {
        console.error('❌ Error cargando pesos:', error);
      }
    };
    
    loadWeights();
    
    // 🔄 Escuchar evento de actualización de peso
    const handleWeightUpdate = (event) => {
      console.log('🔄 Evento weightUpdated recibido:', event.detail);
      loadWeights(); // Recargar pesos
    };
    
    window.addEventListener('weightUpdated', handleWeightUpdate);
    
    return () => {
      window.removeEventListener('weightUpdated', handleWeightUpdate);
    };
  }, [user?.uid, isOnline]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleProfileSubmit = async (profileData) => {
    try {
      setIsLoadingProfile(true);

      const userId = user.uid || user.id; // Firebase usa uid

      console.log('🚀 handleProfileSubmit iniciado');
      console.log('👤 User ID:', userId);
      console.log('🌐 isOnline:', isOnline);
      console.log('📝 profileData recibido:', profileData);

      // Calcular calorías diarias basadas en BMR, actividad y objetivo
      const bmr = calculateBMR(profileData.weight, profileData.height, profileData.age, profileData.gender);
      const dailyCalories = calculateDailyCalories(bmr, profileData.activityLevel, profileData.goal);
      const macros = calculateMacros(dailyCalories, profileData.weight, profileData.goal);

      console.log('🧮 CÁLCULOS REALIZADOS:');
      console.log('  BMR (Metabolismo Basal):', bmr, 'kcal');
      console.log('  Calorías Diarias (TDEE ajustado):', dailyCalories, 'kcal');
      console.log('  Macros:', macros);

      const profileWithUserId = {
        ...profileData, // Todos los datos del formulario
        uid: userId,
        email: user.email,
        dailyCalories: dailyCalories, // Calorías calculadas
        dailyMacros: macros, // Macros calculados { protein, carbs, fat }
        createdAt: profileData.createdAt || new Date().toISOString(), // Preservar fecha de creación si existe
        updatedAt: new Date().toISOString(),
        // Asegurar que existan rachas (solo si es perfil nuevo)
        currentStreak: profileData.currentStreak !== undefined ? profileData.currentStreak : 1,
        longestStreak: profileData.longestStreak !== undefined ? profileData.longestStreak : 1,
        lastLoginDate: profileData.lastLoginDate || new Date().toISOString().split('T')[0]
      };
      
      console.log('📦 PERFIL COMPLETO A GUARDAR:', {
        nombre: profileWithUserId.name,
        peso: profileWithUserId.weight + ' kg',
        altura: profileWithUserId.height + ' cm',
        edad: profileWithUserId.age + ' años',
        genero: profileWithUserId.gender,
        objetivo: profileWithUserId.goal,
        actividad: profileWithUserId.activityLevel,
        calorias: profileWithUserId.dailyCalories + ' kcal',
        macros: profileWithUserId.dailyMacros,
        alimentosFavoritos: profileWithUserId.selectedFoods ? 'Sí' : 'No'
      });

      if (isOnline) {
        // ✅ Guardar en Firebase Firestore
        console.log('💾 Guardando perfil en Firebase Firestore...');
        console.log('📦 Datos a guardar:', profileWithUserId);
        
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, profileWithUserId, { merge: true });
        
        console.log('✅ Perfil guardado exitosamente en Firebase:', {
          nombre: profileWithUserId.name,
          email: profileWithUserId.email,
          peso: profileWithUserId.weight,
          altura: profileWithUserId.height,
          objetivo: profileWithUserId.goal,
          metaPeso: profileWithUserId.goalWeight
        });
        
        setUserProfile(profileWithUserId);
        
        // También guardar en localStorage como caché
        localStorage.setItem(`snorxfit_profile_${userId}`, JSON.stringify(profileWithUserId));
        
      } else {
        // Guardar solo en localStorage si no hay internet
        console.log('📱 Guardando perfil en localStorage (sin internet)');
        setUserProfile(profileWithUserId);
        localStorage.setItem(`snorxfit_profile_${userId}`, JSON.stringify(profileWithUserId));
      }

      setCurrentView('foodSelection');

    } catch (error) {
      console.error('❌❌❌ ERROR CRÍTICO guardando perfil:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      const userId = user.uid || user.id;
      // Fallback a localStorage en caso de error
      const fallbackProfile = {
        ...profileData,
        uid: userId,
        email: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('📱 Guardando en localStorage como fallback');
      setUserProfile(fallbackProfile);
      localStorage.setItem(`snorxfit_profile_${userId}`, JSON.stringify(fallbackProfile));
      setCurrentView('foodSelection');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Función para actualizar perfil (usado en Settings)
  const handleUpdateProfile = async (updatedProfile) => {
    try {
      const userId = user.uid || user.id;
      
      // Recalcular calorías diarias si cambió peso, altura, edad o objetivo
      const bmr = calculateBMR(
        updatedProfile.weight, 
        updatedProfile.height, 
        updatedProfile.age, 
        updatedProfile.gender
      );
      const dailyCalories = calculateDailyCalories(
        bmr, 
        updatedProfile.activityLevel, 
        updatedProfile.goal
      );
      const macros = calculateMacros(dailyCalories, updatedProfile.weight, updatedProfile.goal);
      
      const profileWithUpdates = {
        ...updatedProfile,
        uid: userId,
        email: user.email,
        dailyCalories: dailyCalories, // Actualizar calorías
        dailyMacros: macros, // Actualizar macros
        updatedAt: new Date().toISOString()
      };

      // Actualizar en Firebase
      if (isOnline) {
        console.log('💾 Actualizando perfil en Firebase...');
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, profileWithUpdates, { merge: true });
        console.log('✅ Perfil actualizado en Firebase');
      }

      // Actualizar en memoria y localStorage
      setUserProfile(profileWithUpdates);
      localStorage.setItem(`snorxfit_profile_${userId}`, JSON.stringify(profileWithUpdates));
      
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      // Fallback a localStorage
      const userId = user.uid || user.id;
      setUserProfile(updatedProfile);
      localStorage.setItem(`snorxfit_profile_${userId}`, JSON.stringify(updatedProfile));
    }
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const handleBackToDashboard = () => {
  setCurrentView('home');
  };

  const handleFoodSelectionComplete = async (foods) => {
    console.log('🍎 Alimentos seleccionados:', foods);
    setSelectedFoods(foods);
    
    // GUARDAR alimentos seleccionados en Firebase
    if (user?.uid) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          selectedFoods: foods,
          updatedAt: new Date().toISOString()
        });
        console.log('✅ Alimentos favoritos guardados en Firebase');
      } catch (error) {
        console.error('❌ Error guardando alimentos favoritos:', error);
      }
    }
    
    setCurrentView('home');
  };

  // Mostrar loading mientras se carga el perfil
  if (isLoadingProfile) {
    return <LoadingScreen />;
  }

  // Si el usuario es admin (verificar por email), mostrar panel de administrador
  if (isUserAdmin(user)) {
    return (
      <AdminDashboard 
        userProfile={userProfile}
        onLogout={logout}
      />
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'profile':
        return (
          <UserProfileForm 
            onSubmit={handleProfileSubmit} 
            initialData={userProfile}
          />
        );
      case 'home': {
        // Usar calorías META del perfil y calorías CONSUMIDAS del día
        const dcal = userProfile?.dailyCalories || 2000; // Meta diaria
        const macros = userProfile?.dailyMacros || { protein: 0, carbs: 0, fat: 0 };
        
        return (
          <HomeOverview
            userProfile={userProfile}
            recentWeights={recentWeights}
            dailyCalories={dcal} // ✅ Calorías OBJETIVO (meta diaria)
            dailyCaloriesConsumed={dailyCaloriesConsumed} // Calorías CONSUMIDAS hoy
            dailyMacros={macros} // ✅ Macros OBJETIVO (meta diaria)
            dailyMacrosConsumed={dailyMacros} // Macros CONSUMIDOS hoy
            onNavigate={handleNavigation}
            onQuickAddWeight={() => handleNavigation('weightTracker')}
            onOpenScanner={() => handleNavigation('foodScanner')}
            onRecalculatePlan={() => handleNavigation('nutrition')}
          />
        );
      }
      case 'workout':
        return <WorkoutPlan userProfile={userProfile} onBack={handleBackToDashboard} />;
      case 'nutrition':
        return <NutritionPlan userProfile={userProfile} onBack={handleBackToDashboard} selectedFoods={selectedFoods} />;
      case 'chatbot':
        return <Chatbot onBack={handleBackToDashboard} userProfile={userProfile} />;
      case 'foodLog':
        return <FoodLog userProfile={userProfile} onBack={handleBackToDashboard} onMacrosUpdate={setDailyMacros} />;
      case 'report':
        return <Report userProfile={userProfile} recentWeights={recentWeights} />;
      case 'progress':
        return <ProgressTracker userProfile={userProfile} onBack={handleBackToDashboard} />;
      case 'foodSelection':
        return <FoodSelection onBack={handleBackToDashboard} onSelectFoods={handleFoodSelectionComplete} />;
      case 'weightTracker':
        return <WeightTracker userProfile={userProfile} onBack={handleBackToDashboard} />;
      case 'settings':
        return <Settings userProfile={userProfile} onBack={handleBackToDashboard} onSaveProfile={handleUpdateProfile} />;
      case 'moodDiary':
        return <MoodDiary />;
      case 'photos':
        return <PhotoGallery />;
      case 'reminders':
        return <RemindersManager />;
      case 'foodScanner':
        return <FoodScanner />;
      default:
        return <UserProfileForm onSubmit={handleProfileSubmit} />;
    }
  };

  // Animación de transición entre vistas
  const content = (
    <AnimatePresence mode="wait">
      <motion.div key={currentView} initial={{ opacity:0, x:10}} animate={{ opacity:1, x:0}} exit={{ opacity:0, x:-10}} transition={{ duration:.25}}>
        {renderCurrentView()}
      </motion.div>
    </AnimatePresence>
  );

  // Sin layout durante creación inicial de perfil
  if (currentView === 'profile') return content;

  return (
    <AppLayout
      currentView={currentView}
      onSelectView={handleNavigation}
      onLogout={logout}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
    >
      {content}
      <div className={`fixed top-2 right-2 text-xs px-3 py-1 rounded-full font-medium ${isOnline ? 'bg-green-500 text-white':'bg-yellow-400 text-black'}`}>{isOnline ? 'Online' : 'Offline'}</div>
    </AppLayout>
  );
};

// Componente contenedor que gestiona autenticación y loading global
const App = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  // Forzar splash mínimo
  useEffect(() => {
    const timer = setTimeout(()=> setShowLoadingScreen(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (showLoadingScreen || isLoading) return <LoadingScreen />;
  return isAuthenticated ? <AuthenticatedApp /> : <AuthScreen />;
};

// Envolver con AuthProvider en el punto de entrada real (index.js) o aquí si se desea
const RootApp = () => (
  <AuthProvider>
    <ToastProvider>
      <App />
      <PWAInstallPrompt />
    </ToastProvider>
  </AuthProvider>
);

export default RootApp;
