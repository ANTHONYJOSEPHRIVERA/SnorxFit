// Script para agregar datos de prueba al usuario Anthony
// Ejecutar con: node src/scripts/seedAnthonyData.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDMDmE_zPL2mzJuHXLGvBmBKe3o9VcAVaw",
  authDomain: "fictia-dc859.firebaseapp.com",
  projectId: "fictia-dc859",
  storageBucket: "fictia-dc859.firebasestorage.app",
  messagingSenderId: "1030820698334",
  appId: "1:1030820698334:web:4e98e07aae80784e0f4701"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID del usuario Anthony (obtenlo de Firebase Auth)
const ANTHONY_UID = "REEMPLAZA_CON_UID_DE_ANTHONY"; // Necesitas obtener esto de Firebase Console

// Perfil de Anthony: pérdida de peso
// Meta: 2913 kcal (según tu screenshot)
// Objetivo: déficit calórico moderado (consumir ~2400-2500 kcal)

const generateMealData = (date, totalCalories) => {
  // Distribución típica de calorías
  const breakfast = Math.floor(totalCalories * 0.25); // 25%
  const lunch = Math.floor(totalCalories * 0.40);     // 40%
  const dinner = Math.floor(totalCalories * 0.30);    // 30%
  const snacks = totalCalories - breakfast - lunch - dinner; // Resto
  
  return {
    meals: {
      breakfast: [
        { id: Date.now() + 1, name: 'Avena con plátano', calories: breakfast * 0.5, protein: 12, carbs: 40, fat: 5 },
        { id: Date.now() + 2, name: 'Huevos revueltos', calories: breakfast * 0.3, protein: 15, carbs: 2, fat: 10 },
        { id: Date.now() + 3, name: 'Pan integral', calories: breakfast * 0.2, protein: 5, carbs: 20, fat: 2 }
      ],
      lunch: [
        { id: Date.now() + 4, name: 'Pollo a la plancha', calories: lunch * 0.4, protein: 35, carbs: 0, fat: 8 },
        { id: Date.now() + 5, name: 'Arroz integral', calories: lunch * 0.3, protein: 5, carbs: 45, fat: 2 },
        { id: Date.now() + 6, name: 'Ensalada mixta', calories: lunch * 0.2, protein: 3, carbs: 8, fat: 5 },
        { id: Date.now() + 7, name: 'Brócoli al vapor', calories: lunch * 0.1, protein: 4, carbs: 6, fat: 1 }
      ],
      dinner: [
        { id: Date.now() + 8, name: 'Pescado al horno', calories: dinner * 0.5, protein: 30, carbs: 0, fat: 10 },
        { id: Date.now() + 9, name: 'Quinoa', calories: dinner * 0.3, protein: 8, carbs: 35, fat: 4 },
        { id: Date.now() + 10, name: 'Espárragos', calories: dinner * 0.2, protein: 3, carbs: 5, fat: 1 }
      ],
      snacks: [
        { id: Date.now() + 11, name: 'Yogur griego', calories: snacks * 0.6, protein: 15, carbs: 10, fat: 3 },
        { id: Date.now() + 12, name: 'Almendras', calories: snacks * 0.4, protein: 6, carbs: 5, fat: 14 }
      ]
    },
    water: 8, // 8 vasos de agua
    updatedAt: new Date()
  };
};

const seedData = async () => {
  console.log('🌱 Generando datos de prueba para Anthony...');
  
  try {
    // Generar datos para los últimos 7 días
    const today = new Date();
    const caloriesPerDay = [2450, 2520, 2380, 2600, 2410, 2490, 2530]; // Variación realista
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      const mealData = generateMealData(dateString, caloriesPerDay[6 - i]);
      
      const foodLogRef = doc(db, 'users', ANTHONY_UID, 'foodLogs', dateString);
      await setDoc(foodLogRef, mealData);
      
      console.log(`✅ Datos agregados para ${dateString} (${caloriesPerDay[6 - i]} kcal)`);
    }
    
    console.log('🎉 ¡Datos de prueba generados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log('- 7 días de datos de alimentación');
    console.log('- Promedio: ~2480 kcal/día');
    console.log('- Objetivo: Pérdida de peso moderada');
    console.log('- Consumo de agua: 8 vasos/día');
    
  } catch (error) {
    console.error('❌ Error al generar datos:', error);
  }
};

// Ejecutar
seedData();
