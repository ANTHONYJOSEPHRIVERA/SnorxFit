# ✅ Sistema de Calorías y Macros Unificado

## Cambios Realizados

### 1. **Función `calculateDailyCalories` mejorada**
Ahora calcula calorías según el objetivo del usuario:

```javascript
// PERDER PESO (lose)
Calorías = (BMR × nivel_actividad) - 500 kcal
// Déficit para perder ~0.5kg por semana

// GANAR MÚSCULO (gain)
Calorías = (BMR × nivel_actividad) + 300 kcal
// Superávit controlado para ganar masa muscular

// MANTENER (maintain)
Calorías = BMR × nivel_actividad
// Calorías de mantenimiento (TDEE)
```

### 2. **Nueva función `calculateMacros`**
Calcula distribución de macronutrientes según objetivo:

#### **Perder Peso (lose):**
- **Proteína**: 2.2g/kg de peso (35% calorías)
  - Para preservar masa muscular
- **Grasa**: 25% calorías
- **Carbohidratos**: 40% calorías

#### **Ganar Músculo (gain):**
- **Proteína**: 2.0g/kg de peso (30% calorías)
  - Para construcción muscular
- **Grasa**: 25% calorías
- **Carbohidratos**: 45% calorías
  - Mayor energía para entrenamientos

#### **Mantener (maintain):**
- **Proteína**: 1.8g/kg de peso (30% calorías)
- **Grasa**: 30% calorías
- **Carbohidratos**: 40% calorías

### 3. **Guardado en Firebase**
Al crear o actualizar perfil, se guardan:
```javascript
{
  dailyCalories: 2058,  // Calculado según objetivo
  dailyMacros: {
    protein: 150,  // gramos
    carbs: 206,    // gramos
    fat: 57        // gramos
  }
}
```

### 4. **Uso Consistente en Toda la App**

#### **Dashboard / HomeOverview:**
```javascript
// Usa valores guardados en perfil
const dcal = userProfile?.dailyCalories || 0;
const macros = userProfile?.dailyMacros || { protein: 0, carbs: 0, fat: 0 };
```

#### **Report.js (Progreso):**
```javascript
// Usa calorías del perfil como meta
const targetCalories = userProfile?.dailyCalories || 2000;
```

#### **FoodLog / Registro de Alimentos:**
- Compara alimentos registrados vs. `userProfile.dailyCalories`
- Muestra progreso de macros vs. `userProfile.dailyMacros`

## Ejemplo Práctico

### Usuario:
- Peso: 68 kg
- Altura: 175 cm
- Edad: 25 años
- Género: Masculino
- Actividad: Moderada (1.55)

### Cálculos:

**1. BMR (Metabolismo Basal):**
```
BMR = 88.362 + (13.397 × 68) + (4.799 × 175) - (5.677 × 25)
BMR ≈ 1,650 kcal
```

**2. TDEE (Calorías de Mantenimiento):**
```
TDEE = 1,650 × 1.55 = 2,558 kcal
```

**3. Según Objetivo:**

#### **PERDER PESO:**
```
Calorías: 2,558 - 500 = 2,058 kcal
Proteína: 68 × 2.2 = 150g (600 kcal = 29%)
Grasa: 2,058 × 0.25 / 9 = 57g (513 kcal = 25%)
Carbohidratos: (2,058 - 600 - 513) / 4 = 236g (946 kcal = 46%)
```

#### **GANAR MÚSCULO:**
```
Calorías: 2,558 + 300 = 2,858 kcal
Proteína: 68 × 2.0 = 136g (544 kcal = 19%)
Grasa: 2,858 × 0.25 / 9 = 79g (714 kcal = 25%)
Carbohidratos: (2,858 - 544 - 714) / 4 = 400g (1,600 kcal = 56%)
```

#### **MANTENER:**
```
Calorías: 2,558 kcal
Proteína: 68 × 1.8 = 122g (489 kcal = 19%)
Grasa: 2,558 × 0.30 / 9 = 85g (767 kcal = 30%)
Carbohidratos: (2,558 - 489 - 767) / 4 = 326g (1,302 kcal = 51%)
```

## Beneficios

✅ **Consistencia**: Mismo valor en Dashboard, Progreso y Registro de Alimentos
✅ **Precisión**: Calculado científicamente según objetivo
✅ **Personalizado**: Basado en datos reales del usuario
✅ **Flexible**: Se recalcula al cambiar peso u objetivo
✅ **Sin confusión**: Un solo valor de referencia

## Cómo Verificar

1. **Ir a Dashboard**: Ver calorías mostradas
2. **Ir a Progreso**: Debe mostrar la misma meta
3. **Ir a Registro de Alimentos**: Debe usar la misma meta
4. **Cambiar objetivo en Settings**: Todo se recalcula automáticamente

## Recalculo Automático

El sistema recalcula calorías y macros cuando:
- ✅ Se crea el perfil por primera vez
- ✅ Se actualiza el peso en Settings
- ✅ Se cambia el objetivo (perder/ganar/mantener)
- ✅ Se modifica el nivel de actividad
- ✅ Se actualiza la edad o altura
