# Sistema de Recomendaciones Nutricionales Variadas 🍎🥗

## Descripción General

El sistema de recomendaciones nutricionales variadas está diseñado para ofrecer **múltiples opciones alimentarias** según las preferencias del usuario, evitando la monotonía en las dietas y permitiendo que cada persona encuentre alimentos que realmente le gusten.

### Características Principales ✨

- **🔄 Variedad Infinita**: Múltiples opciones para cada grupo de alimentos
- **👎 "No me gusta"**: Sistema de rechazo que ofrece alternativas automáticamente
- **🎯 Objetivos Personalizados**: Recomendaciones según metas nutricionales
- **🍽️ Por Momento del Día**: Diferentes alimentos para desayuno, almuerzo, cena y snacks
- **📊 Información Nutricional**: Macros detallados (calorías, proteínas, carbohidratos, grasas)
- **🌟 Interfaz Visual**: Tarjetas atractivas con colores según perfil nutricional

## Cómo Funciona el Sistema 🔧

### 1. Grupos de Alimentos
Los alimentos se organizan en grupos funcionales:

- **Proteínas Magras** 🍗: Pollo, pescado, atún, claras de huevo
- **Proteínas Completas** 🥩: Res, cerdo, huevos, lácteos
- **Carbohidratos Complejos** 🌾: Arroz integral, avena, quinoa, camote
- **Frutas Energéticas** 🍌: Plátano, manzana, naranja, mango
- **Verduras Verdes** 🥬: Espinaca, brócoli, lechuga, acelga
- **Verduras Coloridas** 🥕: Zanahoria, pimiento, tomate, remolacha
- **Grasas Saludables** 🥑: Aguacate, nueces, aceite de oliva, semillas
- **Snacks Saludables** 🥨: Yogurt griego, frutos secos, frutas

### 2. Objetivos Nutricionales
El sistema adapta las recomendaciones según tu meta:

- **🎯 Pérdida de Peso**: Prioriza proteínas magras y verduras
- **💪 Ganancia Muscular**: Enfoque en proteínas completas y carbohidratos
- **⚖️ Mantenimiento**: Dieta balanceada con todos los grupos
- **⚡ Energía Deportiva**: Carbohidratos y proteínas para rendimiento

### 3. Momentos del Día
Cada comida tiene prioridades específicas:

- **🌅 Desayuno**: Carbohidratos complejos + proteínas + frutas
- **🍽️ Almuerzo**: Proteínas + carbohidratos + verduras + grasas saludables
- **🌙 Cena**: Proteínas magras + verduras (menos carbohidratos)
- **🍎 Snacks**: Opciones ligeras y energéticas

## Funciones Principales 🛠️

### `generateVariedRecommendations(mealType, goal, excludedFoods, optionsPerGroup)`
Genera recomendaciones personalizadas.

```javascript
const recommendations = await generateVariedRecommendations(
  'almuerzo',           // Tipo de comida
  'perdida_peso',       // Objetivo nutricional
  [rejectedFoods],      // Alimentos que no quiere
  3                     // Opciones por grupo
);
```

### `getAlternatives(rejectedFood, mealType, limit)`
Encuentra alternativas cuando el usuario rechaza un alimento.

```javascript
const alternatives = await getAlternatives(
  rejectedFood,         // Alimento rechazado
  'desayuno',          // Momento del día
  5                    // Número de alternativas
);
```

### `generateMealPlanWithAlternatives(userProfile, goal, preferences, restrictions)`
Crea un plan completo de comidas con múltiples opciones.

## Interfaz de Usuario 🎨

### Componente Principal: `NutritionPlan`
- Selectores para tipo de comida y objetivo nutricional
- Botón "Generar Recomendaciones" 
- Grid de tarjetas organizadas por grupos de alimentos
- Sección de alimentos rechazados
- Botón "Nuevas Ideas" para refrescar recomendaciones

### Componente de Tarjeta: `FoodRecommendationCard`
- **Color por Macro**: Rojo (proteínas), amarillo (carbohidratos), verde (grasas)
- **Información Nutricional**: Calorías, proteínas, carbohidratos, grasas
- **Botón de Rechazo** 👎: "No me gusta" para mostrar alternativas
- **Botón de Agregar** ➕: "Agregar al Plan" para incluir en la dieta

## Flujo de Uso del Usuario 👤

1. **Seleccionar momento**: Desayuno, almuerzo, cena o snack
2. **Elegir objetivo**: Pérdida de peso, ganancia muscular, etc.
3. **Generar recomendaciones**: El sistema muestra opciones organizadas por grupos
4. **Explorar opciones**: Ver múltiples alimentos con información nutricional
5. **Rechazar lo que no gusta**: Hacer clic en 👎 para ver alternativas
6. **Agregar favoritos**: Usar ➕ para añadir alimentos al plan
7. **Repetir proceso**: Usar "Nuevas Ideas" para más variedad

## Ejemplo de Uso 📝

```javascript
// Usuario quiere recomendaciones para almuerzo con objetivo de pérdida de peso
const user = {
  mealType: 'almuerzo',
  goal: 'perdida_peso',
  rejectedFoods: [] // Inicialmente vacío
};

// 1. Generar recomendaciones iniciales
const recs = await generateVariedRecommendations(
  user.mealType, 
  user.goal, 
  user.rejectedFoods, 
  3
);

// 2. Usuario rechaza el brócoli
const broccoli = recs.recommendations.verduras_verdes.options[0];
user.rejectedFoods.push(broccoli);

// 3. Obtener alternativas al brócoli
const alternatives = await getAlternatives(broccoli, user.mealType, 3);
// Resultado: [espinaca, acelga, lechuga]

// 4. Usuario agrega pollo y espinaca a su plan
const selectedFoods = [chicken, spinach];
```

## Beneficios del Sistema 🌟

### Para el Usuario
- **Variedad**: Nunca se aburre con las mismas comidas
- **Personalización**: Recomendaciones según sus gustos y objetivos
- **Flexibilidad**: Puede rechazar alimentos y ver alternativas
- **Educación**: Aprende sobre macronutrientes de diferentes alimentos
- **Motivación**: Sistema visual atractivo que hace la nutrición divertida

### Para el Desarrollador
- **Modular**: Componentes reutilizables y bien organizados
- **Escalable**: Fácil agregar nuevos grupos de alimentos u objetivos
- **Mantenible**: Código limpio con responsabilidades separadas
- **Extensible**: Se puede integrar con APIs de nutrición externas
- **Testeable**: Funciones puras con datos de ejemplo incluidos

## Archivos del Sistema 📁

```
src/
├── utils/
│   ├── nutritionRecommendations.js  # Lógica principal del sistema
│   └── nutritionDemo.js            # Ejemplos y datos de prueba
├── components/
│   ├── NutritionPlan.js           # Componente principal con UI
│   └── FoodRecommendationCard.js  # Tarjeta individual de alimento
└── data/
    └── nutritionIndex.js          # Búsqueda y carga de datos CSV
```

## Próximas Mejoras 🚀

- **🤖 IA Mejorada**: Aprendizaje de preferencias del usuario
- **📱 Integración con Apps**: Sincronización con apps de fitness
- **🛒 Lista de Compras**: Generar lista automática de ingredientes
- **👥 Recomendaciones Sociales**: "Usuarios similares también eligieron..."
- **📈 Análisis Nutricional**: Seguimiento de macros a lo largo del tiempo
- **🌍 Alimentos Locales**: Integración con productos disponibles por región

---

**¡El sistema está listo para usar!** 🎉 
Navega a la sección "Plan Nutricional" en la app y haz clic en "Recomendaciones" para empezar a explorar todas las opciones variadas que el sistema tiene para ofrecerte.