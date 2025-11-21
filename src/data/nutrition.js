export const nutritionDatabase = {
  mealPlans: {
    weightLoss: {
      name: 'Plan para Pérdida de Peso',
      dailyCalories: 1500,
      meals: [
        {
          type: 'breakfast',
          name: 'Desayuno Energético',
          calories: 350,
          foods: ['Avena con frutas', 'Yogur griego', 'Almendras'],
          description: 'Rico en fibra y proteínas'
        },
        {
          type: 'lunch',
          name: 'Almuerzo Balanceado',
          calories: 450,
          foods: ['Ensalada de pollo', 'Quinoa', 'Vegetales mixtos'],
          description: 'Proteína magra con carbohidratos complejos'
        },
        {
          type: 'snack',
          name: 'Merienda Saludable',
          calories: 200,
          foods: ['Manzana', 'Mantequilla de almendra'],
          description: 'Snack nutritivo y saciante'
        },
        {
          type: 'dinner',
          name: 'Cena Ligera',
          calories: 400,
          foods: ['Salmón a la plancha', 'Brócoli', 'Batata'],
          description: 'Rica en omega-3 y antioxidantes'
        }
      ]
    },
    muscleGain: {
      name: 'Plan para Ganar Músculo',
      dailyCalories: 2200,
      meals: [
        {
          type: 'breakfast',
          name: 'Desayuno Proteico',
          calories: 500,
          foods: ['Huevos revueltos', 'Tostadas integrales', 'Aguacate'],
          description: 'Alto en proteínas y grasas saludables'
        },
        {
          type: 'lunch',
          name: 'Almuerzo Completo',
          calories: 650,
          foods: ['Pechuga de pollo', 'Arroz integral', 'Vegetales'],
          description: 'Proteína completa con carbohidratos'
        },
        {
          type: 'snack',
          name: 'Batido Post-Entreno',
          calories: 300,
          foods: ['Proteína en polvo', 'Plátano', 'Leche de almendra'],
          description: 'Recuperación muscular'
        },
        {
          type: 'dinner',
          name: 'Cena Nutritiva',
          calories: 550,
          foods: ['Carne magra', 'Pasta integral', 'Ensalada'],
          description: 'Proteínas y carbohidratos para recuperación'
        }
      ]
    },
    maintenance: {
      name: 'Plan de Mantenimiento',
      dailyCalories: 1800,
      meals: [
        {
          type: 'breakfast',
          name: 'Desayuno Equilibrado',
          calories: 400,
          foods: ['Smoothie verde', 'Granola', 'Frutas del bosque'],
          description: 'Balance perfecto de nutrientes'
        },
        {
          type: 'lunch',
          name: 'Almuerzo Mediterráneo',
          calories: 500,
          foods: ['Pescado', 'Vegetales asados', 'Aceite de oliva'],
          description: 'Dieta mediterránea saludable'
        },
        {
          type: 'snack',
          name: 'Snack Natural',
          calories: 250,
          foods: ['Nueces mixtas', 'Yogur natural'],
          description: 'Grasas saludables y probióticos'
        },
        {
          type: 'dinner',
          name: 'Cena Balanceada',
          calories: 450,
          foods: ['Tofu', 'Vegetales salteados', 'Arroz'],
          description: 'Opción vegetariana completa'
        }
      ]
    }
  },
  customMealPlans: {} // To store user-selected food preferences
};