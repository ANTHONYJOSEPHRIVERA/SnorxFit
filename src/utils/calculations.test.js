/**
 * PRUEBAS UNITARIAS - calculations.js
 * Evidencia para sección 8.3.a) Pruebas unitarias
 */

import { calculateBMI, calculateBMR, calculateDailyCalories, getBMICategory } from './calculations';

describe('8.3.a - Pruebas Unitarias de Cálculos', () => {
  
  // Test 1: Cálculo de IMC (BMI)
  test('Debe calcular el IMC correctamente', () => {
    const bmi = calculateBMI(70, 175); // peso en kg, altura en cm
    expect(parseFloat(bmi)).toBeCloseTo(22.86, 1);
  });

  test('Debe calcular el IMC para persona con sobrepeso', () => {
    const bmi = calculateBMI(90, 170);
    expect(parseFloat(bmi)).toBeCloseTo(31.14, 1);
  });

  test('Debe manejar valores inválidos en BMI', () => {
    const bmi1 = calculateBMI(0, 170);
    const bmi2 = calculateBMI(70, 0);
    const bmi3 = calculateBMI('abc', 170);
    
    expect(bmi1).toBe('0.0');
    expect(bmi2).toBe('0.0');
    expect(bmi3).toBe('0.0');
  });

  // Test 2: Categorías de IMC
  test('Debe categorizar IMC correctamente', () => {
    const cat1 = getBMICategory(17);
    const cat2 = getBMICategory(22);
    const cat3 = getBMICategory(27);
    const cat4 = getBMICategory(32);
    
    expect(cat1.category).toBe('Bajo peso');
    expect(cat2.category).toBe('Peso normal');
    expect(cat3.category).toBe('Sobrepeso');
    expect(cat4.category).toBe('Obesidad');
    
    console.log('✅ Categorías de IMC validadas');
  });

  // Test 3: Cálculo de TMB (BMR) - Metabolismo Basal
  test('Debe calcular TMB para hombre correctamente', () => {
    const bmr = calculateBMR(70, 175, 25, 'male');
    expect(bmr).toBeGreaterThan(1500);
    expect(bmr).toBeLessThan(2000);
    console.log(`📊 TMB hombre (70kg, 175cm, 25 años): ${bmr} kcal`);
  });

  test('Debe calcular TMB para mujer correctamente', () => {
    const bmr = calculateBMR(60, 165, 25, 'female');
    expect(bmr).toBeGreaterThan(1200);
    expect(bmr).toBeLessThan(1600);
    console.log(`📊 TMB mujer (60kg, 165cm, 25 años): ${bmr} kcal`);
  });

  // Test 4: Cálculo de TDEE (gasto calórico diario)
  test('Debe calcular calorías diarias con actividad sedentaria', () => {
    const bmr = 1500;
    const tdee = calculateDailyCalories(bmr, 'sedentary', 'maintain');
    expect(tdee).toBeCloseTo(1800, 0);
    console.log(`📊 TDEE sedentario: ${tdee} kcal`);
  });

  test('Debe calcular calorías diarias con actividad moderada', () => {
    const bmr = 1500;
    const tdee = calculateDailyCalories(bmr, 'moderate', 'maintain');
    expect(tdee).toBeCloseTo(2325, 0);
    console.log(`📊 TDEE moderado: ${tdee} kcal`);
  });

  test('Debe ajustar calorías para pérdida de peso', () => {
    const bmr = 1500;
    const maintain = calculateDailyCalories(bmr, 'moderate', 'maintain');
    const lose = calculateDailyCalories(bmr, 'moderate', 'lose');
    
    expect(lose).toBeLessThan(maintain);
    expect(maintain - lose).toBeGreaterThan(200); // Déficit mínimo de 200 kcal
    
    console.log(`📊 Mantenimiento: ${maintain} kcal`);
    console.log(`📉 Pérdida: ${lose} kcal (déficit: ${maintain - lose} kcal)`);
  });

  test('Debe ajustar calorías para ganancia de peso', () => {
    const bmr = 1500;
    const maintain = calculateDailyCalories(bmr, 'moderate', 'maintain');
    const gain = calculateDailyCalories(bmr, 'moderate', 'gain');
    
    expect(gain).toBeGreaterThan(maintain);
    expect(gain - maintain).toBeGreaterThan(200); // Superávit mínimo de 200 kcal
    
    console.log(`📊 Mantenimiento: ${maintain} kcal`);
    console.log(`📈 Ganancia: ${gain} kcal (superávit: ${gain - maintain} kcal)`);
  });

  // Test 5: Validación de entradas
  test('Debe manejar BMR con valores inválidos', () => {
    const bmr1 = calculateBMR(0, 170, 25, 'male');
    const bmr2 = calculateBMR(70, 0, 25, 'male');
    const bmr3 = calculateBMR(70, 170, 0, 'male');
    
    expect(bmr1).toBe(0);
    expect(bmr2).toBe(0);
    expect(bmr3).toBe(0);
    
    console.log('✅ Validación de entradas inválidas pasada');
  });

  test('Debe manejar calorías diarias con BMR inválido', () => {
    const tdee = calculateDailyCalories(0, 'moderate', 'maintain');
    expect(tdee).toBe(0);
  });

  // Test 6: Casos extremos
  test('Debe manejar persona muy alta', () => {
    const bmi = calculateBMI(100, 200); // 100kg, 2m
    expect(parseFloat(bmi)).toBeCloseTo(25.0, 1);
  });

  test('Debe manejar persona muy baja', () => {
    const bmi = calculateBMI(40, 140); // 40kg, 1.4m
    expect(parseFloat(bmi)).toBeCloseTo(20.4, 1);
  });
});
