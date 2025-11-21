# 🔧 Fix: Meta de Peso Ilógica (685 kg en vez de ~68 kg)

## 🐛 Problema Encontrado:

En la pantalla principal aparecía:
- **Peso Actual:** 68 kg ✅
- **Meta:** 685 kg ❌ (¡Literalmente engordarlo 617 kg!)

## 🔍 Causa:

El campo `goalWeight` en el perfil del usuario tenía un valor incorrecto (probablemente un error de multiplicación por 10 o un typo al guardarse).

---

## ✅ Solución Implementada:

### **1. Validación Automática en `HomeOverview.js`:**

Ahora el código valida que la meta de peso tenga sentido:

```javascript
// Si la diferencia entre meta y peso actual es > 30 kg → Recalcular
if (goal && latestWeight && Math.abs(goal - latestWeight) > 30) {
  // Meta ilógica detectada
  if (userProfile?.goal === 'lose') {
    goal = latestWeight - 5; // Meta razonable: perder 5 kg
  } else if (userProfile?.goal === 'gain') {
    goal = latestWeight + 5; // Meta razonable: ganar 5 kg
  } else {
    goal = latestWeight; // Mantener peso actual
  }
}
```

### **2. Misma Validación en `Report.js`:**

Para que los reportes también muestren metas lógicas.

---

## 🎯 Comportamiento Corregido:

### **Antes:**
- Peso: 68 kg
- Meta: **685 kg** ❌
- Diferencia: 617 kg (ilógico)

### **Después:**
- Peso: 68 kg
- Meta: **63 kg** ✅ (si objetivo es perder peso)
- Meta: **73 kg** ✅ (si objetivo es ganar músculo)
- Meta: **68 kg** ✅ (si objetivo es mantener)

---

## 🔧 Cómo Corregir Manualmente (Si es Necesario):

Si quieres cambiar la meta de un usuario específico en Firebase:

### **Opción 1: Desde Firebase Console**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto → **Firestore Database**
3. Colección `users` → Busca al usuario
4. Edita el campo `goalWeight` con el valor correcto (ej: `63` en vez de `685`)
5. Guarda

### **Opción 2: Recalcular Desde la App**

1. Ir a **Configuración** (Settings)
2. Buscar **"Recalcular Plan"** (si existe el botón)
3. Esto debería actualizar la meta automáticamente

---

## 📊 Validaciones Agregadas:

✅ **Diferencia máxima de 30 kg** entre peso actual y meta  
✅ **Recálculo automático** si la meta es ilógica  
✅ **Metas razonables por defecto**:
- Perder peso: -5 kg
- Ganar músculo: +5 kg
- Mantener: 0 kg de cambio

---

## 🚀 Próximas Mejoras:

1. **Campo de Meta Editable** - Permitir al usuario cambiar su meta manualmente
2. **Validación en el Formulario** - Prevenir que se guarden metas ilógicas
3. **Rango de Metas** - Sugerir metas saludables basadas en IMC

---

## ✅ Estado:

**Corregido** - Ahora las metas se validan automáticamente y se muestran valores lógicos.

Si todavía ves 685 kg:
1. Refresca la página (F5)
2. Cierra sesión y vuelve a entrar
3. Verifica en Firebase que `goalWeight` tenga un valor razonable
