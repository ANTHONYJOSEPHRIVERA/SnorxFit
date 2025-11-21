// Script para cargar datos de prueba a Firebase
const admin = require('firebase-admin');

// Inicializar Firebase Admin (usa las credenciales del proyecto)
const serviceAccount = require('./serviceAccountKey.json'); // Necesitarás descargar esto de Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const ANTHONY_UID = "Vk6Ri01aY9Y1nAfNwzPDaJ0pEts2";

const foodLogsData = {
  '2025-10-24': {
    meals: {
      breakfast: [
        { id: 1729800001, name: 'Avena con plátano y miel', calories: 350, protein: 12, carbs: 60, fat: 6 },
        { id: 1729800002, name: 'Huevos revueltos (2 huevos)', calories: 180, protein: 14, carbs: 2, fat: 12 },
        { id: 1729800003, name: 'Pan integral (2 rebanadas)', calories: 140, protein: 6, carbs: 26, fat: 2 }
      ],
      lunch: [
        { id: 1729800004, name: 'Pollo a la plancha (200g)', calories: 330, protein: 62, carbs: 0, fat: 7 },
        { id: 1729800005, name: 'Arroz integral (1 taza)', calories: 220, protein: 5, carbs: 46, fat: 2 },
        { id: 1729800006, name: 'Ensalada verde con tomate', calories: 80, protein: 3, carbs: 12, fat: 3 }
      ],
      dinner: [
        { id: 1729800008, name: 'Pescado al horno (180g)', calories: 250, protein: 36, carbs: 0, fat: 12 },
        { id: 1729800009, name: 'Quinoa cocida (1 taza)', calories: 220, protein: 8, carbs: 39, fat: 4 }
      ],
      snacks: [
        { id: 1729800011, name: 'Yogur griego natural', calories: 150, protein: 17, carbs: 8, fat: 4 }
      ]
    },
    water: 8,
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2025-10-24T20:00:00'))
  },
  '2025-10-25': {
    meals: {
      breakfast: [
        { id: 1729900001, name: 'Smoothie de frutas y proteína', calories: 320, protein: 25, carbs: 48, fat: 5 },
        { id: 1729900002, name: 'Tostadas integrales con aguacate', calories: 280, protein: 8, carbs: 32, fat: 14 }
      ],
      lunch: [
        { id: 1729900003, name: 'Pechuga de pavo (180g)', calories: 280, protein: 54, carbs: 0, fat: 6 },
        { id: 1729900004, name: 'Camote horneado', calories: 180, protein: 3, carbs: 41, fat: 0 }
      ],
      dinner: [
        { id: 1729900007, name: 'Salmón a la plancha (150g)', calories: 310, protein: 30, carbs: 0, fat: 20 },
        { id: 1729900008, name: 'Arroz jazmín (3/4 taza)', calories: 150, protein: 3, carbs: 33, fat: 1 }
      ],
      snacks: [
        { id: 1729900010, name: 'Manzana', calories: 95, protein: 1, carbs: 25, fat: 0 }
      ]
    },
    water: 9,
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2025-10-25T21:00:00'))
  },
  '2025-10-26': {
    meals: {
      breakfast: [
        { id: 1730000001, name: 'Tortilla de claras (4 claras)', calories: 140, protein: 28, carbs: 2, fat: 0 },
        { id: 1730000002, name: 'Pan de centeno', calories: 160, protein: 6, carbs: 30, fat: 2 }
      ],
      lunch: [
        { id: 1730000004, name: 'Res magra (150g)', calories: 280, protein: 39, carbs: 0, fat: 14 },
        { id: 1730000005, name: 'Papa al horno', calories: 160, protein: 4, carbs: 37, fat: 0 }
      ],
      dinner: [
        { id: 1730000008, name: 'Pechuga de pollo al limón (180g)', calories: 300, protein: 56, carbs: 0, fat: 6 },
        { id: 1730000009, name: 'Cuscús integral', calories: 180, protein: 6, carbs: 36, fat: 1 }
      ],
      snacks: [
        { id: 1730000011, name: 'Nueces (25g)', calories: 170, protein: 4, carbs: 4, fat: 17 }
      ]
    },
    water: 7,
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2025-10-26T19:30:00'))
  },
  '2025-10-27': {
    meals: {
      breakfast: [
        { id: 1730100001, name: 'Granola casera con yogur', calories: 340, protein: 15, carbs: 52, fat: 9 }
      ],
      lunch: [
        { id: 1730100003, name: 'Atún en agua (1 lata)', calories: 120, protein: 26, carbs: 0, fat: 1 },
        { id: 1730100004, name: 'Arroz integral con vegetales', calories: 280, protein: 8, carbs: 54, fat: 4 }
      ],
      dinner: [
        { id: 1730100007, name: 'Lomo de cerdo magro (150g)', calories: 290, protein: 39, carbs: 0, fat: 14 },
        { id: 1730100008, name: 'Puré de coliflor', calories: 80, protein: 3, carbs: 12, fat: 3 }
      ],
      snacks: [
        { id: 1730100010, name: 'Batido de proteína con leche', calories: 200, protein: 30, carbs: 12, fat: 4 }
      ]
    },
    water: 10,
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2025-10-27T20:15:00'))
  },
  '2025-10-28': {
    meals: {
      breakfast: [
        { id: 1730200001, name: 'Panqueques de avena (3)', calories: 300, protein: 18, carbs: 42, fat: 8 },
        { id: 1730200002, name: 'Miel (1 cucharada)', calories: 64, protein: 0, carbs: 17, fat: 0 }
      ],
      lunch: [
        { id: 1730200004, name: 'Filete de tilapia (180g)', calories: 220, protein: 42, carbs: 0, fat: 5 },
        { id: 1730200005, name: 'Quinoa con verduras', calories: 260, protein: 10, carbs: 45, fat: 5 }
      ],
      dinner: [
        { id: 1730200008, name: 'Pechuga de pollo teriyaki (170g)', calories: 310, protein: 52, carbs: 8, fat: 8 },
        { id: 1730200009, name: 'Fideos integrales', calories: 200, protein: 8, carbs: 40, fat: 2 }
      ],
      snacks: [
        { id: 1730200011, name: 'Hummus con bastones de apio', calories: 150, protein: 6, carbs: 18, fat: 7 }
      ]
    },
    water: 8,
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2025-10-28T21:00:00'))
  },
  '2025-10-29': {
    meals: {
      breakfast: [
        { id: 1730300001, name: 'Burrito de desayuno light', calories: 380, protein: 22, carbs: 45, fat: 12 }
      ],
      lunch: [
        { id: 1730300003, name: 'Pavo molido (150g)', calories: 250, protein: 48, carbs: 0, fat: 6 },
        { id: 1730300004, name: 'Tortilla integral', calories: 140, protein: 5, carbs: 24, fat: 3 }
      ],
      dinner: [
        { id: 1730300007, name: 'Salmón al horno con hierbas (160g)', calories: 330, protein: 32, carbs: 0, fat: 22 },
        { id: 1730300008, name: 'Arroz salvaje', calories: 170, protein: 7, carbs: 35, fat: 1 }
      ],
      snacks: [
        { id: 1730300010, name: 'Proteína en polvo con agua', calories: 110, protein: 24, carbs: 2, fat: 1 }
      ]
    },
    water: 9,
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2025-10-29T20:30:00'))
  },
  '2025-10-30': {
    meals: {
      breakfast: [
        { id: 1730400001, name: 'Bowl de yogur griego con granola', calories: 320, protein: 20, carbs: 44, fat: 8 }
      ],
      lunch: [
        { id: 1730400003, name: 'Pollo al curry (180g)', calories: 340, protein: 56, carbs: 12, fat: 10 },
        { id: 1730400004, name: 'Arroz basmati', calories: 200, protein: 4, carbs: 45, fat: 0 }
      ],
      dinner: [
        { id: 1730400006, name: 'Filete de res (150g)', calories: 320, protein: 42, carbs: 0, fat: 16 },
        { id: 1730400007, name: 'Batata asada', calories: 160, protein: 3, carbs: 37, fat: 0 }
      ],
      snacks: [
        { id: 1730400009, name: 'Requesón bajo en grasa', calories: 140, protein: 20, carbs: 8, fat: 3 }
      ]
    },
    water: 8,
    updatedAt: admin.firestore.Timestamp.fromDate(new Date('2025-10-30T14:00:00'))
  }
};

async function uploadData() {
  console.log('🌱 Cargando datos para Anthony...');
  
  try {
    for (const [date, data] of Object.entries(foodLogsData)) {
      await db.collection('users')
        .doc(ANTHONY_UID)
        .collection('foodLogs')
        .doc(date)
        .set(data);
      
      const totalCals = Object.values(data.meals)
        .flat()
        .reduce((sum, food) => sum + food.calories, 0);
      
      console.log(`✅ ${date}: ${totalCals} kcal`);
    }
    
    console.log('\n🎉 ¡Datos cargados exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

uploadData();
