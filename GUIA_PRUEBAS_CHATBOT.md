# 🧪 GUÍA DE PRUEBAS - Chatbot Personalizado

**Fecha:** 5 de Noviembre, 2025  
**Objetivo:** Verificar que el chatbot recuerde TODA la información del usuario

---

## 📋 PREPARACIÓN ANTES DE PROBAR

### **Opción 1: Usuario Nuevo (Recomendado)**
1. Abre la app
2. Si ya tienes cuenta, cierra sesión
3. Regístrate con un email nuevo (ej: `prueba123@gmail.com`)

### **Opción 2: Limpiar Usuario Existente**
1. Ve a **Firebase Console**: https://console.firebase.google.com
2. Selecciona tu proyecto
3. Ve a **Firestore Database**
4. Busca tu usuario en `users/{tu-uid}`
5. Elimina el documento completo
6. Cierra sesión en la app y vuelve a iniciar

---

## ✅ PASO 1: COMPLETAR PERFIL INICIAL

### **Datos a ingresar:**
```
Nombre: Juan Pérez
Fecha de nacimiento: 01/01/2000 (25 años)
Peso: 80 kg
Altura: 175 cm
Género: Hombre
Objetivo: PERDER PESO ⬅️ IMPORTANTE
Nivel de actividad: MODERADO (ejercicio 3-5 días/semana) ⬅️ IMPORTANTE
Alergias: Ninguna
Enfermedades crónicas: Ninguna
```

### **Valores que se DEBEN calcular automáticamente:**
- IMC: ~26.1 (Sobrepeso)
- Calorías diarias: ~2,125 kcal
- Macros: P:176g | C:160g | G:59g

### **✅ VERIFICACIÓN:**
Abre la consola del navegador (F12) y busca:
```
✅ Perfil guardado exitosamente en Firebase
```

---

## ✅ PASO 2: SELECCIONAR ALIMENTOS FAVORITOS

### **Alimentos a seleccionar (mínimo 10):**

**Frutas:**
- ✅ Manzana
- ✅ Plátano
- ✅ Naranja

**Carnes:**
- ✅ Pollo
- ✅ Pescado
- ✅ Carne de res

**Verduras:**
- ✅ Brócoli
- ✅ Espinaca
- ✅ Zanahoria

**Lácteos:**
- ✅ Yogurt griego

### **✅ VERIFICACIÓN:**
Abre la consola y busca:
```
🍎 Alimentos seleccionados: {...}
✅ Alimentos favoritos guardados en Firebase
```

---

## ✅ PASO 3: REGISTRAR COMIDA DEL DÍA

1. Ve a **"Registro de Alimentos"**
2. Agrega al menos 3 comidas:
   - Desayuno: Avena + Plátano
   - Almuerzo: Pollo + Arroz + Brócoli
   - Cena: Pescado + Ensalada

3. Presiona **"Guardar Todo"**

### **✅ VERIFICACIÓN:**
```
✅ Registro guardado en Firebase
```

---

## 🤖 PASO 4: PROBAR CHATBOT CON PREGUNTAS ESPECÍFICAS

### **PRUEBA 1: Pregunta sobre objetivo**
```
PREGUNTA: "¿Qué me recomiendas para perder peso?"

✅ RESPUESTA CORRECTA debe mencionar:
- "Como tu objetivo es PERDER PESO..."
- Déficit calórico de 500 kcal
- Tu meta de ~2,125 kcal diarias
- Proteína alta para preservar músculo

❌ RESPUESTA INCORRECTA:
- Respuesta genérica sin mencionar tu objetivo
- No menciona tus calorías específicas
```

### **PRUEBA 2: Pregunta sobre actividad**
```
PREGUNTA: "¿Cuánto cardio debo hacer?"

✅ RESPUESTA CORRECTA debe considerar:
- "Como eres MODERADAMENTE activo..."
- Ya haces ejercicio 3-5 días/semana
- Sugerencias acordes a tu nivel

❌ RESPUESTA INCORRECTA:
- No menciona tu nivel de actividad actual
- Respuesta genérica para todos
```

### **PRUEBA 3: Pregunta sobre desayuno**
```
PREGUNTA: "¿Qué puedo desayunar?"

✅ RESPUESTA CORRECTA debe incluir:
- Alimentos de TUS FAVORITOS (manzana, plátano, yogurt)
- "Basado en tus preferencias..."
- Opciones que seleccionaste

❌ RESPUESTA INCORRECTA:
- Sugiere alimentos que NO seleccionaste
- No menciona tus favoritos
```

### **PRUEBA 4: Pregunta sobre progreso**
```
PREGUNTA: "¿Cómo voy con mi alimentación de hoy?"

✅ RESPUESTA CORRECTA debe mostrar:
- Lo que comiste HOY (Avena, Pollo, Pescado, etc.)
- Total de calorías consumidas
- Comparación con tu meta de 2,125 kcal
- Si llevas déficit o superávit

❌ RESPUESTA INCORRECTA:
- "No has registrado nada hoy"
- No compara con tu meta específica
```

### **PRUEBA 5: Pregunta sobre macros**
```
PREGUNTA: "¿Estoy comiendo suficiente proteína?"

✅ RESPUESTA CORRECTA debe mencionar:
- Tu objetivo de ~176g de proteína
- Cuánto has consumido hoy
- Si necesitas ajustar

❌ RESPUESTA INCORRECTA:
- No sabe tu meta de proteína
- Respuesta genérica sin números
```

---

## 🔍 VERIFICACIÓN EN CONSOLA

### **Cada vez que envíes un mensaje, la consola debe mostrar:**

```javascript
📋 Perfil del usuario: {
  nombre: "Juan Pérez",
  objetivo: "lose",
  peso: 80,
  altura: 175,
  edad: 25,
  actividad: "moderate",
  calorias: 2125,
  alimentosFavoritos: 10
}

✨ Contexto personalizado agregado (primeros 400 caracteres):

=== PERFIL PERSONALIZADO DEL USUARIO ===

📋 DATOS PERSONALES:
Nombre: Juan Pérez
Edad: 25 años
Género: Hombre
Peso actual: 80 kg
Altura: 175 cm
IMC: 26.1 (Sobrepeso)

🎯 OBJETIVO Y PLAN:
Objetivo: PÉRDIDA DE PESO
Nivel de actividad: MODERADO (ejercicio 3-5 días/semana)
Meta calórica diaria: 2125 kcal
Macros objetivo: P:176g | C:160g | G:59g

🍎 ALIMENTOS QUE LE GUSTAN:
Total de alimentos favoritos: 10
Categorías preferidas: fruits, meats, vegetables, dairy

...

📤 Prompt completo enviado a Gemini (primeros 300 caracteres):
¿Qué me recomiendas para perder peso?

=== PERFIL PERSONALIZADO DEL USUARIO ===
...
```

### **Si NO ves esto en la consola:**
❌ **PROBLEMA**: El contexto NO se está enviando
⚠️ **SOLUCIÓN**: Revisa el paso anterior

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### **PROBLEMA 1: Chatbot no sabe mi objetivo**
```
Síntoma: Da respuestas genéricas sin mencionar "perder peso"

✅ SOLUCIÓN:
1. Verifica en consola que aparezca: "Objetivo: PÉRDIDA DE PESO"
2. Si no aparece, el perfil no se guardó correctamente
3. Vuelve a completar el formulario inicial
```

### **PROBLEMA 2: Chatbot no recuerda mis alimentos favoritos**
```
Síntoma: Sugiere alimentos que NO seleccionaste

✅ SOLUCIÓN:
1. Ve a Firebase Console
2. Abre: users/{tu-uid}
3. Verifica que existe el campo "selectedFoods"
4. Si no existe, vuelve a "Selección de Alimentos"
```

### **PROBLEMA 3: Chatbot no sabe lo que comí hoy**
```
Síntoma: Dice "No has registrado nada hoy"

✅ SOLUCIÓN:
1. Ve a "Registro de Alimentos"
2. Agrega comidas
3. Presiona "Guardar Todo"
4. Espera confirmación en consola
5. Vuelve al chatbot y pregunta de nuevo
```

### **PROBLEMA 4: Macros aparecen como "?"**
```
Síntoma: "Macros objetivo: P:?g | C:?g | G:?g"

✅ SOLUCIÓN:
1. El perfil se guardó con "dailyMacros" en vez de "macros"
2. Esto ya está corregido en el código
3. Vuelve a completar el perfil inicial
```

---

## 📊 CHECKLIST DE VERIFICACIÓN FINAL

Marca cada item cuando funcione correctamente:

### **Datos Personales:**
- [ ] Chatbot sabe mi nombre
- [ ] Chatbot sabe mi edad
- [ ] Chatbot sabe mi peso actual
- [ ] Chatbot sabe mi IMC

### **Objetivo y Plan:**
- [ ] Chatbot recuerda si quiero perder/ganar/mantener
- [ ] Chatbot conoce mi nivel de actividad
- [ ] Chatbot sabe mis calorías diarias
- [ ] Chatbot sabe mis macros objetivo

### **Alimentos Favoritos:**
- [ ] Chatbot sugiere mis alimentos seleccionados
- [ ] Chatbot NO sugiere cosas que no me gustan
- [ ] Chatbot menciona "basado en tus preferencias"

### **Registro Diario:**
- [ ] Chatbot sabe lo que comí hoy
- [ ] Chatbot calcula total de calorías consumidas
- [ ] Chatbot compara con mi meta
- [ ] Chatbot me dice si estoy en déficit/superávit

### **Personalización:**
- [ ] Chatbot habla en segunda persona (tú)
- [ ] Chatbot adapta respuestas a mi objetivo
- [ ] Chatbot considera mi nivel de actividad
- [ ] Chatbot usa mis datos reales en respuestas

---

## ✅ RESULTADO ESPERADO

Si **TODOS** los checks están marcados:
🎉 **¡SISTEMA FUNCIONANDO PERFECTAMENTE!**

Si **fallan 1-2** checks:
⚠️ **Revisar problemas comunes arriba**

Si **fallan 3+ checks**:
🚨 **PROBLEMA CRÍTICO - Avisar de inmediato**

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE VERIFICAR

1. ✅ Si todo funciona → Documentar en tesis
2. ✅ Probar con 2-3 usuarios reales
3. ✅ Recopilar feedback
4. ✅ Ajustar si es necesario
5. ✅ Listo para estudio piloto

---

**IMPORTANTE:** Guarda capturas de pantalla de las respuestas del chatbot para evidencia en la tesis.

---

**Fecha de prueba:** _______________  
**Resultado:** [ ] ✅ APROBADO  [ ] ❌ FALLÓ  [ ] ⚠️ PARCIAL  
**Notas adicionales:**
```
