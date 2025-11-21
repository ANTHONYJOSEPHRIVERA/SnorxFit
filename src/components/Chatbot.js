import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, ArrowLeft, Sparkles, Plus, Trash2, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatWithGemini, logChatMetric } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, collection, addDoc, query, orderBy, limit, getDocs, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ALIMENTOS_DB } from '../data/foodDatabase';
import { foodCategories } from '../data/foodGallery';
import { getUserPreferences, generatePersonalizedContext, analyzeUserPreferences } from '../utils/userAnalytics';

// 🍎 FUNCIÓN: Buscar alimentos en la galería local
const searchFoodInLocal = (searchTerm) => {
  const term = searchTerm.toLowerCase().trim();
  const results = [];
  
  foodCategories.forEach(category => {
    category.items.forEach(food => {
      // Buscar por nombre, aliases o tags
      const matchesName = food.name.toLowerCase().includes(term);
      const matchesAlias = food.aliases?.some(alias => alias.toLowerCase().includes(term));
      const matchesTag = food.tags?.some(tag => tag.toLowerCase().includes(term));
      
      if (matchesName || matchesAlias || matchesTag) {
        results.push({
          ...food,
          categoryName: category.name
        });
      }
    });
  });
  
  return results;
};

// 🍽️ FUNCIÓN: Generar respuesta nutricional desde base de datos local
const getFoodNutritionFromLocal = (userInput) => {
  const input = userInput.toLowerCase().trim();
  
  // Extraer posible nombre de alimento
  let searchTerm = input;
  
  // Remover palabras comunes de preguntas
  searchTerm = searchTerm
    .replace(/cuánto|cuanto|tiene|contiene|información|info|dame|dime|sobre|del|de|la|el|un|una|nutrición|nutricional|calorías|calorias|proteínas|proteinas|carbohidratos|grasas/g, '')
    .trim();
  
  if (!searchTerm || searchTerm.length < 3) {
    return null; // Muy corto para buscar
  }
  
  const results = searchFoodInLocal(searchTerm);
  
  if (results.length === 0) {
    return null; // No encontrado, dejar que Gemini responda
  }
  
  // Si encontramos resultados
  if (results.length === 1) {
    const food = results[0];
    return `${food.icon} **${food.name}** (${food.categoryName})

📊 **Información nutricional** (por 100g):
• 🔥 Calorías: ${food.calories} kcal
• 💪 Proteínas: ${food.protein}g
• 🍞 Carbohidratos: ${food.carbs}g
• 🥑 Grasas: ${food.fat}g

✅ Esta información viene de nuestra base de datos local.`;
  }
  
  // Múltiples resultados
  let response = `🔍 Encontré **${results.length} alimentos** que coinciden:\n\n`;
  results.slice(0, 5).forEach(food => {
    response += `${food.icon} **${food.name}** - ${food.calories} kcal | P:${food.protein}g C:${food.carbs}g G:${food.fat}g\n`;
  });
  
  if (results.length > 5) {
    response += `\n...y ${results.length - 5} más. Sé más específico para ver detalles.`;
  }
  
  return response;
};

// Función helper para obtener fecha local
const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 🛡️ SISTEMA DE DETECCIÓN DE PREGUNTAS DE RIESGO
const detectRiskQuestion = (userInput) => {
  const input = userInput.toLowerCase().trim();
  
  // Patrones de riesgo extremo
  const riskPatterns = {
    pesoRapido: /(?:bajar|perder|adelgazar|quemar)\s*(?:rápido|rapido|rápidamente|rapidamente)?\s*(?:\d+\s*kg|\d+\s*kilos?)\s*(?:en|por)\s*(?:una?\s*semana|días?|dia)/i,
    pesoExtremo: /(?:bajar|perder)\s*(?:10|15|20|\d{2})\s*(?:kg|kilos?)\s*(?:rápido|rapido|en\s*\d+\s*(?:semana|día|mes))/i,
    eliminarGrupo: /(?:dejar|eliminar|quitar|no\s*comer|sin)\s*(?:de\s*comer\s*)?(?:carbohidratos?|carbs|pan|arroz|grasas?|proteínas?|comida)/i,
    ayunoExtremo: /(?:no\s*comer|dejar\s*de\s*comer|ayunar)\s*(?:nada|todo\s*el\s*día|varios?\s*días?|una?\s*semana)/i,
    caloriasExtremas: /(?:comer|consumir)?\s*(?:solo|menos\s*de|máximo)?\s*(?:500|600|700|800|900|1000)\s*(?:kcal|calorías?|calorias?)/i,
    ejercicioExtremo: /(?:hacer|entrenar)\s*(?:mucho|demasiado|todo\s*el\s*día|\d+\s*horas?)\s*(?:ejercicio|cardio|gym)/i,
    laxantesSupresores: /(?:pastillas?|suplementos?|medicamentos?)\s*(?:para|de)?\s*(?:adelgazar|bajar|perder|quemar)/i,
    saltarComidas: /(?:saltar|no\s*comer|omitir)\s*(?:el\s*)?(?:desayuno|almuerzo|cena|comidas?)/i,
    vomito: /(?:vomitar|purgar|laxantes?)\s*(?:después|para)/i,
    trastorno: /(?:anorexia|bulimia|atracón|trastorno\s*alimenticio)/i
  };
  
  // Verificar cada patrón
  for (const [tipo, pattern] of Object.entries(riskPatterns)) {
    if (pattern.test(input)) {
      console.log('🚨 ALERTA DE RIESGO DETECTADA:', tipo);
      return { hasRisk: true, riskType: tipo, pattern: input };
    }
  }
  
  return { hasRisk: false };
};

// 🚨 RESPUESTA PARA PREGUNTAS DE RIESGO
const getRiskWarningResponse = (riskType, userInput) => {
  let warning = `🚨 **Ey, para el carro un momento...**\n\n`;
  
  if (riskType === 'pesoRapido' || riskType === 'pesoExtremo') {
    warning += `Hermano/a, lo que estás preguntando es **peligroso** para tu salud. Déjame explicarte por qué:\n\n`;
    warning += `**❌ Bajar mucho peso muy rápido causa:**\n`;
    warning += `• Pierdes MÚSCULO, no solo grasa 💀\n`;
    warning += `• Tu metabolismo se jode permanentemente 🔥\n`;
    warning += `• Te vas a sentir horrible: cansancio, mareos, mal humor\n`;
    warning += `• Efecto rebote SEGURO: recuperas todo + kilos extra 📈\n\n`;
    warning += `**✅ Mejor hagámoslo bien:**\n`;
    warning += `• 0.5-1 kg por semana (es lo saludable) 📊\n`;
    warning += `• Déficit suave: -300 a -500 kcal al día\n`;
    warning += `• Mete harta proteína para mantener músculo 💪\n`;
    warning += `• Entrena con pesas 3-4 veces/semana\n\n`;
    warning += `💡 **La neta:** Bajar rápido = recuperar TODO más rápido. Mejor lento y seguro, ¿va?\n\n`;
    warning += `¿Quieres que te arme un plan **sostenible** en lugar de algo extremo? 🎯`;
  }
  
  else if (riskType === 'eliminarGrupo') {
    warning += `Mira bro/sis, entiendo que quieras resultados rápidos, pero **eliminar grupos alimenticios completos es mala idea**. Te explico:\n\n`;
    warning += `**❌ Por qué NO eliminarlos:**\n\n`;
    warning += `🍞 **Carbohidratos:**\n`;
    warning += `• Tu cerebro y músculos los NECESITAN para energía\n`;
    warning += `• Sin ellos: cansancio, mal humor, cero fuerza en el gym\n`;
    warning += `• Mejor: modera el arroz blanco, pero no lo elimines\n\n`;
    warning += `🥑 **Grasas:**\n`;
    warning += `• Esenciales para tus hormonas (incluyendo testosterona)\n`;
    warning += `• Ayudan a absorber vitaminas\n`;
    warning += `• Mejor: palta, aceite de oliva, frutos secos\n\n`;
    warning += `🥩 **Proteínas:**\n`;
    warning += `• Son TU MÚSCULO literal\n`;
    warning += `• Sin ellas pierdes músculo, no grasa\n\n`;
    warning += `**✅ El truco real:**\n`;
    warning += `• Come TODO pero en las cantidades correctas 📏\n`;
    warning += `• Proteína alta, carbos moderados, grasas necesarias\n`;
    warning += `• Así mantienes músculo y quemas grasa 🔥\n\n`;
    warning += `� ¿Te ayudo a balancear tu alimentación sin restricciones locas?`;
  }
  
  else if (riskType === 'ayunoExtremo' || riskType === 'saltarComidas') {
    warning += `Bro/sis, lo que estás pensando hacer va a **joder tu metabolismo** mal. Te cuento por qué:\n\n`;
    warning += `**❌ No comer = NO es la solución:**\n`;
    warning += `• Tu cuerpo entra en "modo ahorro" = quema MENOS calorías 🐌\n`;
    warning += `• Pierdes músculo (que es lo que quema grasa)\n`;
    warning += `• Te sientes de la ver**: fatiga, irritabilidad, cero concentración\n`;
    warning += `• Terminas con atracones después (pregúntale a cualquiera)\n\n`;
    warning += `**✅ Lo que realmente funciona:**\n`;
    warning += `• Come 3-4 veces al día, comidas normales ✅\n`;
    warning += `• Mínimo: 1200 kcal mujeres / 1500 kcal hombres\n`;
    warning += `• Desayuna bien = energía para todo el día 🌅\n`;
    warning += `• Proteína en cada comida = no tienes hambre\n\n`;
    warning += `💡 **Real talk:** No comer no te hace bajar de peso. Comer BIEN sí.\n\n`;
    warning += `¿Armamos un plan de comidas que realmente funcione? 🍽️`;
  }
  
  else if (riskType === 'caloriasExtremas') {
    warning += `Ey ey ey, **esas calorías son DEMASIADO bajas** para cualquier persona. Así no se hace, hermano/a:\n\n`;
    warning += `**❌ Menos de 1200 kcal es peligroso porque:**\n`;
    warning += `• No cubres ni lo BÁSICO que tu cuerpo necesita para funcionar 🫀\n`;
    warning += `• Tu músculo se va a la mie*** (literal)\n`;
    warning += `• Cansancio extremo, frío todo el tiempo\n`;
    warning += `• Tu sistema inmune se debilita = te enfermas más\n`;
    warning += `• Las chicas pueden perder su período 😰\n\n`;
    warning += `**✅ Calorías mínimas saludables:**\n`;
    warning += `• Mujeres: 1200-1500 kcal (mínimo)\n`;
    warning += `• Hombres: 1500-1800 kcal (mínimo)\n`;
    warning += `• Si entrenas: suma 300-500 kcal más\n\n`;
    warning += `💡 Tu cuerpo no es tu enemigo. Dale lo que necesita y verás resultados REALES.\n\n`;
    warning += `¿Calculamos TUS calorías correctas? 📊`;
  }
  
  else if (riskType === 'ejercicioExtremo') {
    warning += `Tranqui campeón/a, **entrenar de más es TAN malo como no entrenar**. Te cuento:\n\n`;
    warning += `**❌ Sobreentrenamiento causa:**\n`;
    warning += `• Lesiones por fatiga crónica 🤕\n`;
    warning += `• Pierdes músculo en lugar de ganarlo\n`;
    warning += `• Sistema inmune débil = te enfermas\n`;
    warning += `• Insomnio, ansiedad, mal humor 😴\n`;
    warning += `• Cero progreso (estancamiento total)\n\n`;
    warning += `**✅ Volumen ÓPTIMO (probado):**\n`;
    warning += `• Pesas: 3-5 días/semana, 45-60 minutos\n`;
    warning += `• Cardio: 2-3 días/semana, 30-40 minutos\n`;
    warning += `• Descanso: 1-2 días OBLIGATORIOS\n`;
    warning += `• Dormir: 7-9 horas (ahí crece el músculo) 😴\n\n`;
    warning += `💡 **Real:** El músculo crece cuando descansas, no cuando entrenas.\n\n`;
    warning += `¿Quieres un plan de entreno balanceado que funcione? 💪`;
  }
  
  else if (riskType === 'laxantesSupresores' || riskType === 'vomito' || riskType === 'trastorno') {
    warning += `🆘 **Hermano/a, esto es SERIO. Necesito que me escuches:**\n\n`;
    warning += `Lo que estás preguntando es **extremadamente peligroso** y puede:\n\n`;
    warning += `❌ Dañar tu sistema digestivo de forma PERMANENTE\n`;
    warning += `❌ Causarte problemas cardíacos (desbalance electrolítico)\n`;
    warning += `❌ Arruinar tus dientes para siempre\n`;
    warning += `❌ Desarrollar trastornos alimenticios serios\n`;
    warning += `❌ Afectar tu salud mental gravemente\n\n`;
    warning += `**🆘 Por favor, busca ayuda profesional:**\n\n`;
    warning += `Esto suena más serio de lo que yo puedo manejar. Necesitas hablar con:\n`;
    warning += `• Un nutricionista certificado\n`;
    warning += `• Un psicólogo especializado\n`;
    warning += `• Tu médico de cabecera\n\n`;
    warning += `📞 **Líneas de ayuda en Perú (confidencial):**\n`;
    warning += `• EsSalud: **107** (gratis, 24/7)\n`;
    warning += `• MINSA Salud Mental: **(01) 284-1349**\n\n`;
    warning += `💙 **Te lo digo en serio:** Tu salud vale MIL VECES más que cualquier número en la balanza.\n\n`;
    warning += `No estás solo/a en esto. Hay profesionales que pueden ayudarte de verdad. 🤝`;
    return warning;
  }
  
  warning += `\n\n⚠️ Ojo: Esto es orientación general. Si tienes dudas médicas serias, siempre consulta con un profesional.\n`;
  
  return warning;
};

// 🧠 SISTEMA DE RESPUESTAS INTELIGENTES LOCALES
const getLocalResponse = (userInput, userFoodData, userProfile) => {
  const input = userInput.toLowerCase().trim();
  
  console.log('🔍 Analizando mensaje:', input);
  
  // ===== 0. VERIFICAR PREGUNTAS DE RIESGO PRIMERO =====
  const riskCheck = detectRiskQuestion(input);
  if (riskCheck.hasRisk) {
    console.log('🚨 Pregunta de RIESGO detectada:', riskCheck.riskType);
    return getRiskWarningResponse(riskCheck.riskType, input);
  }
  
  // ===== 1. ANÁLISIS DE ALIMENTACIÓN =====
  const preguntaSobreComida = 
    input.includes('comí') || input.includes('comi') || 
    input.includes('está bien') || input.includes('esta bien') ||
    input.includes('cómo voy') || input.includes('como voy') ||
    input.includes('qué tal') || input.includes('que tal') ||
    input.includes('opinión') || input.includes('opinion') ||
    (input.includes('hoy') && (input.includes('día') || input.includes('dia'))) ||
    input.includes('alimentación') || input.includes('alimentacion') ||
    input.includes('registro');
  
  if (preguntaSobreComida) {
    console.log('✅ Detectado: pregunta sobre alimentación');
    
    if (!userFoodData || !userFoodData.meals) {
      return `📋 Aún no has registrado nada hoy.\n\n1. Ve a "Registro de Alimentos"\n2. Agrega lo que comiste\n3. Presiona "Guardar Todo"\n4. Vuelve y pregúntame de nuevo 😊`;
    }
    
    const allFoods = Object.values(userFoodData.meals).flat();
    
    if (allFoods.length === 0) {
      return `📋 Aún no has registrado comidas hoy.\n\n1. Ve a "Registro de Alimentos"\n2. Agrega lo que comiste\n3. Presiona "Guardar Todo"\n4. Vuelve y pregúntame de nuevo 😊`;
    }
    
    // HAY DATOS - Hacer análisis completo
    const totalCalories = allFoods.reduce((sum, food) => sum + (food.calories || 0), 0);
    const totalProtein = allFoods.reduce((sum, food) => sum + (food.protein || 0), 0);
    const totalCarbs = allFoods.reduce((sum, food) => sum + (food.carbs || 0), 0);
    const totalFat = allFoods.reduce((sum, food) => sum + (food.fat || 0), 0);
    
    let response = `📊 **Tu alimentación de hoy:**\n\n`;
    
    // Mostrar por comida
    const comidas = [
      { key: 'breakfast', nombre: 'Desayuno', icono: '🌅' },
      { key: 'lunch', nombre: 'Almuerzo', icono: '🍽️' },
      { key: 'dinner', nombre: 'Cena', icono: '🌙' },
      { key: 'snacks', nombre: 'Meriendas', icono: '🍪' }
    ];
    
    comidas.forEach(comida => {
      const items = userFoodData.meals[comida.key] || [];
      if (items.length > 0) {
        response += `${comida.icono} **${comida.nombre}:**\n`;
        items.forEach(item => {
          response += `  • ${item.name} (${item.calories} kcal)\n`;
        });
        response += `\n`;
      }
    });
    
    response += `**📈 Totales:**\n`;
    response += `• Calorías: ${totalCalories.toFixed(0)} kcal\n`;
    response += `• Proteínas: ${totalProtein.toFixed(1)}g\n`;
    response += `• Carbos: ${totalCarbs.toFixed(1)}g\n`;
    response += `• Grasas: ${totalFat.toFixed(1)}g\n\n`;
    
    // Evaluación
    if (userProfile && userProfile.calorieGoal) {
      const diff = totalCalories - userProfile.calorieGoal;
      response += `**🎯 Evaluación:**\n`;
      
      if (diff > 300) {
        response += `⚠️ Te pasaste ${diff.toFixed(0)} kcal. No hagas de esto un hábito.\n`;
      } else if (diff > 100) {
        response += `ℹ️ Estás ${diff.toFixed(0)} kcal arriba. Modera mañana.\n`;
      } else if (diff < -300) {
        response += `⚠️ Te faltan ${Math.abs(diff).toFixed(0)} kcal. Come más.\n`;
      } else {
        response += `✅ ¡Perfecto! Dentro de tu objetivo.\n`;
      }
      
      const targetProtein = (userProfile.calorieGoal * 0.30) / 4;
      if (totalProtein < targetProtein * 0.8) {
        response += `🥩 Baja en proteína. Agrega pollo/pescado/huevos.\n`;
      }
    }
    
    return response;
  }
  
  // ===== 2. PREGUNTAS SOBRE PROTEÍNAS =====
  if (input.includes('proteína') || input.includes('proteina')) {
    console.log('✅ Detectado: pregunta sobre proteínas');
    
    // Buscar alimento específico mencionado
    const alimentos = ALIMENTOS_DB.filter(a => 
      input.includes(a.nombre.toLowerCase())
    );
    
    if (alimentos.length > 0) {
      let resp = '';
      alimentos.slice(0, 3).forEach(alimento => {
        resp += `**${alimento.nombre}:**\n`;
        resp += `🥩 Proteínas: ${alimento.proteinas || 0}g\n`;
        resp += `🔥 ${alimento.calorias} kcal\n\n`;
      });
      return resp;
    }
    
    // Lista general de altos en proteína
    if (input.includes('más') || input.includes('mas') || input.includes('alta') || input.includes('mayor')) {
      const topProtein = ALIMENTOS_DB
        .filter(a => a.proteinas && a.proteinas > 20)
        .sort((a, b) => b.proteinas - a.proteinas)
        .slice(0, 8);
      
      let resp = `🥩 **Top alimentos en proteína:**\n\n`;
      topProtein.forEach((a, i) => {
        resp += `${i + 1}. ${a.nombre}: ${a.proteinas}g (${a.calorias} kcal)\n`;
      });
      return resp;
    }
  }
  
  // ===== 3. CALORÍAS DE ALIMENTOS =====
  if (input.includes('calorías') || input.includes('calorias') || input.includes('kcal')) {
    console.log('✅ Detectado: pregunta sobre calorías');
    
    const alimentos = ALIMENTOS_DB.filter(a => 
      input.includes(a.nombre.toLowerCase())
    );
    
    if (alimentos.length > 0) {
      let resp = '';
      alimentos.slice(0, 3).forEach(alimento => {
        resp += `**${alimento.nombre}:**\n`;
        resp += `🔥 ${alimento.calorias} kcal\n`;
        if (alimento.proteinas) resp += `🥩 Proteínas: ${alimento.proteinas}g\n`;
        if (alimento.carbohidratos) resp += `🍞 Carbos: ${alimento.carbohidratos}g\n`;
        if (alimento.grasas) resp += `🥑 Grasas: ${alimento.grasas}g\n`;
        resp += `\n`;
      });
      return resp;
    }
  }
  
  // ===== 4. DÉFICIT CALÓRICO =====
  if (input.includes('déficit') || input.includes('deficit') || input.includes('bajar') || input.includes('adelgazar') || input.includes('perder')) {
    console.log('✅ Detectado: pregunta sobre déficit calórico');
    return `🎯 **Para déficit calórico:**\n\n**✅ SÍ comer:**\n• Pollo, pescado, claras de huevo\n• Verduras (todas)\n• Bebidas Zero\n• Frutas (moderado)\n\n**❌ EVITAR:**\n• Gaseosas normales (140 kcal vacías)\n• Frituras\n• Dulces y postres\n• Alcohol\n• Exceso de arroz\n\n💡 Prioriza proteína + verduras.`;
  }
  
  // ===== 5. GANAR MÚSCULO =====
  if (input.includes('músculo') || input.includes('musculo') || input.includes('masa') || input.includes('volumen') || input.includes('crecer')) {
    console.log('✅ Detectado: pregunta sobre ganar músculo');
    return `💪 **Para ganar músculo:**\n\n**Proteína (1.6-2.2g/kg):**\n• Pollo: 35g\n• Huevos (2): 14g\n• Yogurt griego: 12g\n• Pescado: 28g\n\n**Carbos post-entreno:**\n• Arroz con pollo: 55g\n• Avena: 50g\n• Plátano: 30g\n\n**Grasas:**\n• Palta, frutos secos\n\n💡 Come cada 3-4h y duerme 7-8h.`;
  }
  
  // ===== 6. PREGUNTAS SIMPLES/COMPARACIONES =====
  if (input.match(/^(cual|cuál|que|qué)\s*(tomo|como|es mejor|elijo|escojo|prefiero|recomiendas)$/i)) {
    console.log('✅ Detectado: pregunta de comparación genérica');
    return `💡 **Para responder mejor, sé más específico:**\n\n🥤 **Bebidas:**\n• "¿Coca Cola Zero o normal?"\n• "¿Qué bebida tomar en déficit?"\n\n🍽️ **Comidas:**\n• "¿Arroz o quinoa?"\n• "¿Qué comer post-entreno?"\n\n🥩 **Proteínas:**\n• "¿Pollo o pescado?"\n• "¿Qué tiene más proteína?"\n\n¿Sobre qué quieres saber específicamente?`;
  }
  
  // ===== 7. SALUDOS =====
  if (input.match(/^(hola|hey|buenas|qué tal|que tal|buenas tardes|buenos días|buenos dias|holi|ola)$/)) {
    console.log('✅ Detectado: saludo');
    return `¡Hola! ¿Qué tal? 👋\n\nSoy tu asesor fitness. Puedo ayudarte con todo lo relacionado a nutrición:\n\n� **Pregúntame cosas como:**\n• "¿Está bien lo que comí?"\n• "¿Cuántas calorías tiene el pollo a la brasa?"\n• "¿Qué comer para bajar de peso?"\n• "¿Es malo el arroz en la noche?"\n• "¿Coca Cola Zero o normal?"\n\n¿En qué te ayudo hoy? 😊`;
  }
  
  // ===== 8. AGRADECIMIENTOS =====
  if (input.match(/^(gracias|thanks|grax|ty|thank you|thx|muchas gracias)$/)) {
    console.log('✅ Detectado: agradecimiento');
    return `¡De nada, bro/sis! 😊 Para eso estoy. Si tienes más dudas, aquí estoy 💪`;
  }
  
  // ===== 9. HIDRATACIÓN =====
  if (input.includes('agua') || input.includes('hidrat') || input.includes('tomar') || input.includes('beber')) {
    console.log('✅ Detectado: pregunta sobre hidratación');
    return `💧 **Hidratación óptima:**\n\n**Meta diaria:** 2.5-3 litros\n\n**Cuándo beber:**\n• Al despertar: 500ml\n• Antes de entrenar: 300ml\n• Durante entreno: 150ml cada 15min\n• Después: 500ml\n• Con cada comida: 250ml\n\n**Señales de deshidratación:**\n❌ Orina oscura\n❌ Sed excesiva\n❌ Fatiga\n❌ Dolor de cabeza\n\n✅ Orina clara = bien hidratado`;
  }
  
  // ===== 10. SUPLEMENTOS =====
  if (input.includes('suplemento') || input.includes('proteína en polvo') || input.includes('whey') || input.includes('creatina') || input.includes('pre-workout')) {
    console.log('✅ Detectado: pregunta sobre suplementos');
    return `💊 **Suplementos básicos:**\n\n**ESENCIALES:**\n✅ Proteína Whey (si no llegas a meta)\n• 25-30g post-entreno\n• O cuando no puedas comer\n\n✅ Creatina monohidrato\n• 5g diarios (cualquier hora)\n• Mejora fuerza y recuperación\n\n**OPCIONALES:**\n⚪ Pre-workout (solo si entrenas muy temprano)\n⚪ Omega 3 (si no comes pescado)\n⚪ Vitamina D (si no tomas sol)\n\n❌ **NO necesitas:** BCAA, glutamina, quemadores\n\n💡 La comida real siempre es mejor.`;
  }
  
  // ===== 11. HORARIOS DE COMIDA =====
  if (input.includes('cuándo comer') || input.includes('cuando comer') || input.includes('horario') || input.includes('hora') && (input.includes('comer') || input.includes('comida'))) {
    console.log('✅ Detectado: pregunta sobre horarios');
    return `⏰ **Horarios de comida óptimos:**\n\n**Para déficit calórico:**\n🌅 Desayuno: 8-9am (proteína + carbos)\n🍽️ Almuerzo: 1-2pm (comida grande)\n🌙 Cena: 7-8pm (proteína + verduras)\n\n**Para ganar músculo:**\n🌅 Desayuno: 7-8am\n🍎 Snack: 10-11am\n🍽️ Almuerzo: 1-2pm\n🥤 Pre-entreno: 1h antes\n💪 Post-entreno: Dentro de 1h\n🌙 Cena: 8-9pm\n🥛 Antes dormir: Caseína/yogurt\n\n💡 Come cada 3-4 horas para mantener metabolismo activo.`;
  }
  
  // ===== 12. CHEAT MEAL =====
  if (input.includes('cheat') || input.includes('trampa') || input.includes('romper dieta') || input.includes('pizza') && input.includes('puedo')) {
    console.log('✅ Detectado: pregunta sobre cheat meal');
    return `🍕 **Sobre las comidas trampa:**\n\n**¿Puedo tener cheat meals?**\n✅ SÍ, 1 vez por semana\n\n**Reglas:**\n1. Solo si cumpliste 6 días perfecto\n2. Una comida, NO todo el día\n3. Disfrútala sin culpa\n4. Vuelve a la dieta al día siguiente\n\n**Mejor estrategia:**\n• Programa tu cheat meal (sábado noche)\n• Come normal el resto del día\n• Entrena duro ese día\n• No te peses al día siguiente (retención de agua)\n\n💡 Un cheat meal a la semana NO arruina tu progreso.\n❌ 3-4 cheat meals SÍ lo arruinan.`;
  }
  
  // ===== 13. EJERCICIO CARDIO =====
  if (input.includes('cardio') || input.includes('correr') || input.includes('caminar') || input.includes('aeróbico') || input.includes('aerobico')) {
    console.log('✅ Detectado: pregunta sobre cardio');
    return `🏃 **Cardio para resultados:**\n\n**Para QUEMAR GRASA:**\n✅ LISS (Low Intensity):\n• Caminar rápido: 45-60min\n• 3-4 veces/semana\n• En ayunas (opcional)\n\n✅ HIIT (High Intensity):\n• Sprints: 20-30min\n• 2-3 veces/semana\n• Quema más calorías post-ejercicio\n\n**Para MANTENER MÚSCULO:**\n⚠️ NO excedas:\n• 3-4 sesiones/semana\n• 30-45min máximo\n• Prioriza pesas sobre cardio\n\n💡 Demasiado cardio = pierdes músculo\n💪 Pesas + dieta > solo cardio`;
  }
  
  // ===== 14. DESCANSO Y SUEÑO =====
  if (input.includes('descanso') || input.includes('dormir') || input.includes('sueño') || input.includes('recuperación') || input.includes('recuperacion')) {
    console.log('✅ Detectado: pregunta sobre descanso');
    return `😴 **Descanso y recuperación:**\n\n**SUEÑO (crítico):**\n✅ 7-9 horas obligatorias\n• Antes de las 11pm\n• Cuarto oscuro y fresco\n• Sin pantallas 1h antes\n\n**DÍAS DE DESCANSO:**\n• Mínimo 1-2 días/semana\n• Caminar ligero está bien\n• Estiramientos/yoga ayudan\n\n**POR QUÉ IMPORTA:**\n💪 El músculo crece en el descanso, no en el gym\n🧠 Mejora enfoque y energía\n⚡ Previene lesiones\n🔥 Optimiza quema de grasa\n\n❌ Menos de 6h = pierdes músculo y quemas menos grasa`;
  }
  
  // ===== 14. ALCOHOL =====
  if (input.includes('alcohol') || input.includes('cerveza') || input.includes('licor') || input.includes('tomar') && (input.includes('fiesta') || input.includes('drinks'))) {
    console.log('✅ Detectado: pregunta sobre alcohol');
    return `🍺 **Alcohol y fitness:**\n\n**LA VERDAD DURA:**\n❌ Alcohol = veneno para tus objetivos\n• Bloquea síntesis de proteína (músculo)\n• Aumenta cortisol (estrés/grasa)\n• Deshidrata severamente\n• Calorías vacías (7 kcal/gramo)\n\n**SI VAS A TOMAR:**\n⚠️ Limítate a 1-2 veces/mes\n\n**Mejor opción:**\n• Vodka/whisky + agua mineral\n• Ron + Coca Zero\n\n**PEOR opción:**\n❌ Cerveza (carbos + alcohol)\n❌ Cócteles dulces (azúcar + alcohol)\n❌ Shots (mucho alcohol rápido)\n\n💡 Una noche de copas = 3 días de progreso perdido`;
  }
  
  // ===== 15. BEBIDAS Y GASEOSAS =====
  if (input.includes('inka') || input.includes('coca cola') || input.includes('gaseosa') || input.includes('bebida') || input.includes('refresco') || input.includes('sprite') || input.includes('fanta') || 
      (input.match(/^(cual|cuál)\s*(tomo|bebo|es mejor)$/i))) {
    console.log('✅ Detectado: pregunta sobre bebidas/gaseosas');
    
    if (input.includes('zero') || input.includes('cero') || input.includes('light') || input.includes('diet')) {
      return `✅ **Bebidas Zero/Light:**\n\n**EXCELENTES para déficit:**\n• Coca Cola Zero: 0 kcal ✅\n• Inka Cola Zero: 0 kcal ✅\n• Sprite Zero: 0 kcal ✅\n\n💡 **Son SEGURAS:**\n• No rompen el déficit\n• No afectan insulina\n• Ayudan con antojos de dulce\n\n⚠️ Pero: el agua sigue siendo mejor\n\n💪 Úsalas sin culpa en déficit.`;
    }
    
    // Si pregunta "cual tomo" o similar
    if (input.match(/^(cual|cuál)\s*(tomo|bebo|es mejor)$/i)) {
      return `🥤 **Mi recomendación de bebidas:**\n\n**1️⃣ MEJOR OPCIÓN:**\n💧 Agua natural (2-3 litros/día)\n\n**2️⃣ BUENAS OPCIONES:**\n✅ Coca Cola Zero: 0 kcal\n✅ Inka Cola Zero: 0 kcal  \n✅ Sprite Zero: 0 kcal\n✅ Café negro: 0 kcal\n✅ Té verde/negro: 0 kcal\n\n**3️⃣ EVITAR:**\n❌ Coca Cola normal: 210 kcal\n❌ Inka Cola normal: 230 kcal\n❌ Jugos procesados: 150-200 kcal\n❌ Néctares: 180 kcal\n\n💡 **Para déficit calórico:** Solo agua y bebidas Zero.\n💪 **Para ganar músculo:** Puedes tomar 1 gaseosa normal post-entreno (carbos rápidos).`;
    }
    
    return `❌ **Bebidas azucaradas:**\n\n**Coca Cola normal (500ml):**\n• 210 calorías\n• 55g azúcar\n• ❌ CERO nutrientes\n\n**Inka Cola normal (500ml):**\n• 230 calorías  \n• 58g azúcar\n• ❌ CERO nutrientes\n\n**ALTERNATIVAS:**\n✅ Coca Cola Zero: 0 kcal\n✅ Inka Cola Zero: 0 kcal\n✅ Agua con limón\n✅ Té helado sin azúcar\n\n💡 Una gaseosa normal = 30 minutos de cardio desperdiciados.\n\n**Para déficit calórico:** SOLO bebidas Zero.`;
  }
  
  // ===== 16. COMIDA PERUANA ESPECÍFICA =====
  if (input.includes('ceviche') || input.includes('lomo saltado') || input.includes('ají de gallina') || input.includes('aji de gallina') || input.includes('pollo a la brasa') || input.includes('anticucho')) {
    console.log('✅ Detectado: pregunta sobre comida peruana');
    
    let peruFood = '';
    
    if (input.includes('ceviche')) {
      peruFood = `🐟 **Ceviche:**\n✅ EXCELENTE para déficit\n• ~250 kcal/porción\n• 35g proteína\n• Bajo en grasa\n\n💡 Evita el camote/choclo si estás en déficit`;
    } else if (input.includes('lomo saltado')) {
      peruFood = `🍖 **Lomo Saltado:**\n⚠️ MODERADO\n• ~450-550 kcal/porción\n• 30g proteína\n• Alto en aceite\n\n💡 Pide menos papas, más carne`;
    } else if (input.includes('ají') || input.includes('aji')) {
      peruFood = `🍗 **Ají de Gallina:**\n⚠️ ALTO EN CALORÍAS\n• ~600 kcal/porción\n• Mucha crema y aceite\n\n💡 Solo para cheat meal o bulking`;
    } else if (input.includes('pollo a la brasa')) {
      peruFood = `🍗 **Pollo a la Brasa:**\n✅ BUENO (sin piel)\n• 1/4 pollo sin piel: ~300 kcal\n• 40g proteína\n\n❌ Evita: papas fritas, cremas\n✅ Pide: ensalada, sin piel`;
    } else if (input.includes('anticucho')) {
      peruFood = `串 **Anticuchos:**\n✅ EXCELENTE\n• 3 anticuchos: ~250 kcal\n• 28g proteína\n• Bajo en grasa\n\n💡 Perfecto para post-entreno`;
    }
    
    return peruFood;
  }
  
  // ===== 17. AYUNO INTERMITENTE =====
  if (input.includes('ayuno') || input.includes('intermitente') || input.includes('16/8') || input.includes('no desayuno')) {
    console.log('✅ Detectado: pregunta sobre ayuno');
    return `⏱️ **Ayuno Intermitente:**\n\n**¿Funciona?**\n✅ SÍ, si te ayuda a comer menos calorías\n❌ NO es mágico\n\n**Protocolo 16/8 (más común):**\n• Ayuno: 8pm - 12pm (16 horas)\n• Ventana: 12pm - 8pm (8 horas)\n\n**VENTAJAS:**\n• Más fácil estar en déficit\n• Menos comidas que preparar\n• Claridad mental en ayunas\n\n**DESVENTAJAS:**\n❌ Difícil para ganar músculo\n❌ Posible pérdida de músculo\n❌ Poca energía para entrenar\n\n💡 **MI CONSEJO:**\nSolo úsalo si te facilita el déficit calórico.\nPara ganar músculo → come 4-5 veces/día.`;
  }
  
  // ===== 18. MESETA/PLATEAU =====
  if (input.includes('meseta') || input.includes('estancado') || input.includes('no bajo') || input.includes('no pierdo') || input.includes('plateau')) {
    console.log('✅ Detectado: pregunta sobre meseta');
    return `📊 **Rompiendo la meseta:**\n\n**¿Por qué pasa?**\nTu cuerpo se adaptó. Necesitas cambios.\n\n**SOLUCIONES:**\n\n1️⃣ **Recalcula tus calorías:**\n   • Pesaste menos → necesitas menos calorías\n   • Reduce 100-200 kcal más\n\n2️⃣ **Aumenta actividad:**\n   • +10min cardio\n   • +5,000 pasos diarios\n\n3️⃣ **Refeed estratégico:**\n   • 1 día come a mantenimiento\n   • Resetea hormonas (leptina)\n\n4️⃣ **Revisa TODO lo que comes:**\n   • Aceites, aderezos, "probaditas"\n   • Pesa tu comida 1 semana\n\n5️⃣ **Duerme más:**\n   • Menos de 7h = más cortisol = guardas grasa\n\n💪 Dale 2 semanas con los cambios antes de rendirte.`;
  }
  
  // ===== 19. ANTOJOS =====
  if (input.includes('antojo') || input.includes('ansiedad') || input.includes('hambre') && input.includes('todo el tiempo')) {
    console.log('✅ Detectado: pregunta sobre antojos');
    return `🍫 **Controlando antojos:**\n\n**ESTRATEGIAS QUE FUNCIONAN:**\n\n1️⃣ **Come más proteína:**\n   • 30g en cada comida\n   • Te mantiene lleno por horas\n\n2️⃣ **Toma más agua:**\n   • 500ml antes de cada comida\n   • A veces es sed, no hambre\n\n3️⃣ **Duerme suficiente:**\n   • Menos de 7h = +25% antojos\n   • Sube grelina (hormona del hambre)\n\n4️⃣ **Alimentos voluminosos:**\n   • Verduras (comes mucho, pocas calorías)\n   • Palomitas sin mantequilla\n   • Gelatina light\n\n5️⃣ **Chicles sin azúcar:**\n   • Engaña al cerebro\n\n6️⃣ **Snacks de emergencia:**\n   • Zanahoria + hummus\n   • Pepino + tajín\n   • Manzana + mantequilla de maní (1 cucharada)\n\n💡 Si tienes antojo de algo específico, cómelo en pequeña cantidad.\nEs mejor 2 cuadros de chocolate que comerte todo el refrigerador después.`;
  }
  
  // ===== 21. NO ENTENDIÓ - Usar API =====
  console.log('⚠️ No categorizado, usando API Gemini...');
  return null; // Esto hará que el sistema use la API
};

// Usamos `react-markdown` con `remark-gfm` para renderizado seguro y completo de Markdown

// Mensaje de bienvenida
const WELCOME_MESSAGE = `¡Qué onda! 👋 Soy tu asesor fitness personal en SnorxFit.

Estoy aquí para ayudarte con tu alimentación y nutrición. Tengo info de +220 alimentos peruanos e internacionales.

� **Pregúntame lo que sea, por ejemplo:**

🔥 **Sobre tu alimentación:**
• "¿Está bien lo que comí hoy?"
• "¿Cómo voy con mis calorías?"

🥩 **Info de alimentos:**
• "¿Cuántas calorías tiene el lomo saltado?"
• "¿Qué tiene más proteína, pollo o pescado?"

💪 **Para tus objetivos:**
• "¿Qué comer para bajar de peso?"
• "¿Cómo ganar músculo sin engordar?"

🥤 **Comparaciones:**
• "¿Coca Cola o Coca Zero?"
• "¿Es malo comer arroz en la noche?"

Habla normal, sin miedo. Estoy para ayudarte 😊`;

const Chatbot = ({ onBack, userProfile: userProfileProp }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, text: WELCOME_MESSAGE, sender: 'bot', timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userFoodData, setUserFoodData] = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [charCount, setCharCount] = useState(0);
  const [userPreferences, setUserPreferences] = useState(null);
  // userProfile viene del prop, no del state local
  const MAX_CHARS = 500;
  const messagesEndRef = useRef(null);

  // Cargar historial de chat desde Firebase
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user || historyLoaded) return;
      
      try {
        const chatHistoryRef = collection(db, 'users', user.uid, 'chatHistory');
        const q = query(chatHistoryRef, orderBy('timestamp', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const historyMessages = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            historyMessages.push({
              id: doc.id,
              text: data.message,
              sender: data.sender,
              timestamp: data.timestamp,
              isLocal: data.isLocal || false
            });
          });
          
          // Invertir para orden cronológico
          historyMessages.reverse();
          
          // Agregar mensaje de bienvenida + historial
          setMessages([
            { id: 'welcome', text: WELCOME_MESSAGE, sender: 'bot', timestamp: new Date().toISOString() },
            ...historyMessages
          ]);
          
          console.log('💬 Historial de chat cargado:', historyMessages.length, 'mensajes');
        }
        
        setHistoryLoaded(true);
      } catch (error) {
        console.error('❌ Error cargando historial:', error);
        setHistoryLoaded(true);
      }
    };
    
    loadChatHistory();
  }, [user, historyLoaded]);

  // Cargar datos de alimentación del usuario
  useEffect(() => {
    const loadUserFoodData = async () => {
      if (!user) return;

      try {
        const today = getLocalDateString();
        const docRef = doc(db, 'users', user.uid, 'foodLogs', today);
        const docSnap = await getDoc(docRef);

        let dataFromFirestore = null;
        if (docSnap.exists()) {
          dataFromFirestore = docSnap.data();
          console.log('📊 Datos de alimentación cargados desde Firestore:', dataFromFirestore);
        } else {
          console.log('� No hay datos de alimentación en Firestore para hoy');
        }

        // Leer cache local y fusionar para que el chatbot tenga siempre la info más completa
        let cached = null;
        try {
          cached = JSON.parse(localStorage.getItem(`foodLog_${today}`) || 'null');
        } catch (e) {
          cached = null;
        }

        if (cached && cached.meals) {
          // Si no hay datos en Firestore, usar cache directo
          if (!dataFromFirestore) {
            setUserFoodData(cached);
            console.log('� Usando cache local para userFoodData:', cached);
          } else {
            // Fusionar arrays por tipo de comida evitando duplicados por id o name
            const merged = { meals: {}, water: cached.water || dataFromFirestore.water || 0 };
            const mealTypes = ['breakfast','lunch','dinner','snacks'];
            mealTypes.forEach(mt => {
              const fromFs = (dataFromFirestore.meals && dataFromFirestore.meals[mt]) || [];
              const fromCache = (cached.meals && cached.meals[mt]) || [];
              const mapIds = new Map();
              fromFs.forEach(item => {
                const key = item.id || (item.name && item.name.toString().toLowerCase());
                if (key) mapIds.set(key, item);
              });
              fromCache.forEach(item => {
                const key = item.id || (item.name && item.name.toString().toLowerCase());
                if (key && !mapIds.has(key)) {
                  mapIds.set(key, item);
                }
              });
              merged.meals[mt] = Array.from(mapIds.values());
            });
            setUserFoodData(merged);
            console.log('🔀 userFoodData fusionado (Firestore + cache):', merged);
          }
        } else if (dataFromFirestore) {
          setUserFoodData(dataFromFirestore);
          console.log('📊 userFoodData establecido desde Firestore');
        } else {
          setUserFoodData(null);
          console.log('📋 No hay datos de alimentación disponibles (ni Firestore ni cache)');
        }
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      }
    };
    
    loadUserFoodData();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cargar conversaciones del usuario
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      
      try {
        const conversationsRef = collection(db, 'users', user.uid, 'conversations');
        const q = query(conversationsRef, orderBy('lastUpdated', 'desc'), limit(20));
        const querySnapshot = await getDocs(q);
        
        const convos = [];
        querySnapshot.forEach((doc) => {
          convos.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setConversations(convos);
        
        // Si no hay conversación activa, crear una nueva
        if (!activeConversationId && convos.length > 0) {
          setActiveConversationId(convos[0].id);
          loadConversationMessages(convos[0].id);
        } else if (convos.length === 0) {
          createNewConversation();
        }
      } catch (error) {
        console.error('❌ Error cargando conversaciones:', error);
      }
    };
    
    loadConversations();
  }, [user]);

  // Cargar preferencias y perfil del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        // El perfil viene como prop desde App.js, solo cargamos preferencias
        console.log('👤 Usando perfil del prop:', userProfileProp);
        if (userProfileProp) {
          console.log('  ✅ Nombre:', userProfileProp.name);
          console.log('  ✅ Objetivo:', userProfileProp.goal);
          console.log('  ✅ Edad:', userProfileProp.age);
          console.log('  ✅ Peso:', userProfileProp.weight);
          console.log('  ✅ Altura:', userProfileProp.height);
          console.log('  ✅ Actividad:', userProfileProp.activityLevel);
          console.log('  ✅ Calorías diarias:', userProfileProp.dailyCalories);
          console.log('  ✅ Alimentos favoritos:', userProfileProp.selectedFoods ? Object.keys(userProfileProp.selectedFoods).length : 0);
        } else {
          console.warn('⚠️ No se recibió userProfile como prop');
        }
        
        // Cargar o generar preferencias del usuario
        const prefs = await getUserPreferences(user.uid);
        setUserPreferences(prefs);
        console.log('🎯 Preferencias del usuario cargadas:', prefs);
        
        // Si no hay preferencias, analizar después de 3 segundos
        if (!prefs || !prefs.favoriteFoods || prefs.favoriteFoods.length === 0) {
          console.log('⏳ Generando análisis de preferencias...');
          setTimeout(async () => {
            const newPrefs = await analyzeUserPreferences(user.uid, 30);
            setUserPreferences(newPrefs);
            console.log('✅ Preferencias generadas:', newPrefs);
          }, 3000);
        }
      } catch (error) {
        console.error('❌ Error cargando datos de usuario:', error);
      }
    };
    
    loadUserData();
  }, [user]);

  // Crear nueva conversación
  const createNewConversation = async () => {
    if (!user) return;
    
    try {
      const conversationsRef = collection(db, 'users', user.uid, 'conversations');
      const newConvo = await addDoc(conversationsRef, {
        title: 'Nueva conversación',
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        messageCount: 0
      });
      
      setActiveConversationId(newConvo.id);
      setMessages([
        { id: 'welcome', text: WELCOME_MESSAGE, sender: 'bot', timestamp: new Date().toISOString() }
      ]);
      
      // Recargar lista
      const q = query(conversationsRef, orderBy('lastUpdated', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      const convos = [];
      querySnapshot.forEach((doc) => {
        convos.push({ id: doc.id, ...doc.data() });
      });
      setConversations(convos);
      
      console.log('✅ Nueva conversación creada');
    } catch (error) {
      console.error('❌ Error creando conversación:', error);
    }
  };

  // Cargar mensajes de una conversación
  const loadConversationMessages = async (conversationId) => {
    if (!user) return;
    
    try {
      const messagesRef = collection(db, 'users', user.uid, 'conversations', conversationId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));
      const querySnapshot = await getDocs(q);
      
      const msgs = [
        { id: 'welcome', text: WELCOME_MESSAGE, sender: 'bot', timestamp: new Date().toISOString() }
      ];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          text: data.message,
          sender: data.sender,
          timestamp: data.timestamp,
          isLocal: data.isLocal || false
        });
      });
      
      setMessages(msgs);
      setActiveConversationId(conversationId);
    } catch (error) {
      console.error('❌ Error cargando mensajes:', error);
    }
  };

  // Eliminar conversación
  const deleteConversation = async (conversationId) => {
    if (!window.confirm('¿Eliminar esta conversación?')) return;
    
    try {
      // Eliminar mensajes
      const messagesRef = collection(db, 'users', user.uid, 'conversations', conversationId, 'messages');
      const messagesSnapshot = await getDocs(messagesRef);
      await Promise.all(messagesSnapshot.docs.map(doc => deleteDoc(doc.ref)));
      
      // Eliminar conversación
      await deleteDoc(doc(db, 'users', user.uid, 'conversations', conversationId));
      
      // Actualizar UI
      const updatedConvos = conversations.filter(c => c.id !== conversationId);
      setConversations(updatedConvos);
      
      if (activeConversationId === conversationId) {
        if (updatedConvos.length > 0) {
          loadConversationMessages(updatedConvos[0].id);
        } else {
          createNewConversation();
        }
      }
      
      console.log('✅ Conversación eliminada');
    } catch (error) {
      console.error('❌ Error eliminando:', error);
    }
  };

  // Función para refrescar preferencias del usuario
  const refreshUserPreferences = async () => {
    if (!user) return;
    
    try {
      console.log('🔄 Actualizando preferencias del usuario...');
      const newPrefs = await analyzeUserPreferences(user.uid, 30);
      setUserPreferences(newPrefs);
      console.log('✅ Preferencias actualizadas:', newPrefs);
    } catch (error) {
      console.error('❌ Error actualizando preferencias:', error);
    }
  };

  // Función para guardar mensajes en Firebase
  const saveChatMessage = async (message, sender, isLocal = false) => {
    if (!user || !activeConversationId) return;
    
    try {
      // Guardar mensaje
      const messagesRef = collection(db, 'users', user.uid, 'conversations', activeConversationId, 'messages');
      await addDoc(messagesRef, {
        message,
        sender,
        isLocal,
        timestamp: serverTimestamp()
      });
      
      // Actualizar conversación
      const convoRef = doc(db, 'users', user.uid, 'conversations', activeConversationId);
      const convoSnap = await getDoc(convoRef);
      const currentData = convoSnap.data();
      
      // Título automático del primer mensaje del usuario
      let title = currentData.title;
      if (title === 'Nueva conversación' && sender === 'user') {
        title = message.substring(0, 40) + (message.length > 40 ? '...' : '');
      }
      
      await updateDoc(convoRef, {
        lastUpdated: serverTimestamp(),
        messageCount: (currentData.messageCount || 0) + 1,
        title
      });
      
      console.log('💾 Mensaje guardado en conversación');
    } catch (error) {
      console.error('❌ Error guardando mensaje:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setCharCount(0); // Resetear contador

    // Guardar mensaje del usuario
    await saveChatMessage(userInput, 'user');

    // 🍎 PASO 1: Intentar buscar en GALERÍA LOCAL de alimentos
    console.log('🔍 Buscando en base de datos local de alimentos...');
    const startTime1 = Date.now();
    const foodLocalResponse = getFoodNutritionFromLocal(userInput);
    const latency1 = Date.now() - startTime1;
    
    if (foodLocalResponse) {
      console.log('✅ ¡Alimento encontrado en base de datos local!');
      await logChatMetric('local_food', latency1, true, user?.uid);
      
      const botMessage = {
        id: messages.length + 2,
        text: foodLocalResponse,
        sender: 'bot',
        isLocal: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Guardar respuesta del bot
      await saveChatMessage(foodLocalResponse, 'bot', true);
      return; // No usar API si hay respuesta local
    }

    // 🚀 PASO 2: Intentar respuestas predefinidas locales (INSTANTÁNEA)
    console.log('🔄 Intentando respuestas predefinidas locales...');
    const startTime2 = Date.now();
    const localResponse = getLocalResponse(userInput, userFoodData, userProfileProp);
    const latency2 = Date.now() - startTime2;
    
    if (localResponse) {
      console.log('✅ Respuesta local predefinida encontrada!');
      await logChatMetric('local_predefined', latency2, true, user?.uid);
      
      const botMessage = {
        id: messages.length + 2,
        text: localResponse,
        sender: 'bot',
        isLocal: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Guardar respuesta del bot
      await saveChatMessage(localResponse, 'bot', true);
      return; // No usar API si hay respuesta local
    }

    // 📡 PASO 3: Solo si no hay respuesta local, usar API de Gemini
    console.log('📡 No hay respuesta local, consultando Gemini API...');
    setIsLoading(true);

    try {
      // Crear contexto con los datos del usuario
      let context = '';
      
      if (userFoodData && userFoodData.meals) {
        const allFoods = Object.values(userFoodData.meals).flat();
        if (allFoods.length > 0) {
          context += '\n\nRegistro de alimentación de hoy del usuario:\n';
          Object.entries(userFoodData.meals).forEach(([mealType, foods]) => {
            if (foods.length > 0) {
              context += `${mealType}: ${foods.map(f => f.name).join(', ')}\n`;
            }
          });
        }
      }
      
      if (userProfileProp && userProfileProp.calorieGoal) {
        context += `\nObjetivo calórico del usuario: ${userProfileProp.calorieGoal} kcal`;
      }

      // 🎯 Agregar contexto personalizado basado en el perfil del usuario
      // SIEMPRE generamos contexto si hay userProfile (preferences es opcional)
      if (userProfileProp) {
        console.log('🎯 Generando contexto personalizado...');
        console.log('📋 Perfil del usuario:', {
          nombre: userProfileProp.name,
          objetivo: userProfileProp.goal,
          peso: userProfileProp.weight,
          altura: userProfileProp.height,
          edad: userProfileProp.age,
          actividad: userProfileProp.activityLevel,
          calorias: userProfileProp.dailyCalories,
          alimentosFavoritos: userProfileProp.selectedFoods ? Object.keys(userProfileProp.selectedFoods).length : 0
        });
        
        // Generar contexto incluso si userPreferences es null
        const personalizedContext = generatePersonalizedContext(userProfileProp, userPreferences, userFoodData);
        context += '\n\n' + personalizedContext;
        
        console.log('✨ Contexto personalizado agregado (primeros 400 caracteres):');
        console.log(personalizedContext.substring(0, 400) + '...');
        console.log('📏 Longitud total del contexto:', personalizedContext.length, 'caracteres');
      } else {
        console.warn('⚠️ No se pudo generar contexto personalizado:');
        console.warn('  - userProfile existe?', !!userProfileProp);
        console.warn('  - userPreferences existe?', !!userPreferences);
      }

      console.log('🤖 Llamando a Gemini API con contexto personalizado...');
      console.log('📤 Prompt completo enviado a Gemini (primeros 300 caracteres):');
      console.log((userInput + context).substring(0, 300) + '...');
      const startTime3 = Date.now();
      const response = await chatWithGemini(userInput + context);
      const latency3 = Date.now() - startTime3;
      
      console.log('✅ Respuesta de API recibida exitosamente');
      await logChatMetric('gemini_api', latency3, true, user?.uid);
      
      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: 'bot',
        isLocal: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Guardar respuesta del bot de API
      await saveChatMessage(response, 'bot', false);
    } catch (error) {
      console.error('❌ Error completo de API:', error);
      await logChatMetric('gemini_api', 0, false, user?.uid);
      
      // Mensajes de error más específicos
      let errorText = '⚠️ **Error con la IA:**\n\n';
      
      if (error.message.includes('API Key inválida')) {
        errorText += '🔑 La API Key de Gemini no es válida.\n\n';
      } else if (error.message.includes('Límite de peticiones')) {
        errorText += '⏰ Demasiadas peticiones. Espera un momento.\n\n';
      } else if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
        errorText += '📡 Sin conexión a internet.\n\n';
      } else {
        errorText += `Error: ${error.message}\n\n`;
      }
      
      errorText += `💡 **Mientras tanto, prueba preguntando:**\n`;
      errorText += `• "¿Está bien lo que comí?"\n`;
      errorText += `• "¿Qué tiene más proteínas?"\n`;
      errorText += `• "¿Cuánta agua tomar?"\n`;
      errorText += `• "¿Puedo tomar cerveza?"\n`;
      errorText += `• "Dame opciones para déficit calórico"\n\n`;
      errorText += `✅ Estas preguntas funcionan sin IA.`;
      
      const errorMessage = {
        id: messages.length + 2,
        text: errorText,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setInput(value);
      setCharCount(value.length);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4 px-1">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} />
          </motion.button>
          {/* Toggle sidebar on mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSidebar(prev => !prev)}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors md:hidden"
            aria-label="Toggle historial"
          >
            <MessageCircle size={20} />
          </motion.button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <MessageSquare size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Asistente IA</h1>
              <p className="text-sm opacity-75">Con historial de conversaciones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container con Sidebar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 h-auto md:h-[calc(100vh-200px)]">
        
        {/* Sidebar - Historial */}
        {showSidebar && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full md:w-64 bg-black/30 backdrop-blur-sm rounded-2xl p-4 flex flex-col"
          >
            {/* Botón Nueva Conversación */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={createNewConversation}
              className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center gap-2 justify-center font-medium"
            >
              <Plus size={20} />
              Nueva Conversación
            </motion.button>
            
            {/* Lista de Conversaciones */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.map((convo) => (
                <div
                  key={convo.id}
                  className={`p-3 rounded-lg cursor-pointer flex items-center justify-between group transition-all ${
                    activeConversationId === convo.id
                      ? 'bg-white/20'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => loadConversationMessages(convo.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle size={14} className="flex-shrink-0" />
                      <p className="text-sm font-medium truncate">{convo.title}</p>
                    </div>
                    <p className="text-xs opacity-50">
                      {convo.messageCount || 0} mensajes
                    </p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(convo.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>

            {/* Preferencias del Usuario */}
            {userPreferences && userPreferences.favoriteFoods && userPreferences.favoriteFoods.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-xs font-semibold mb-2 opacity-75">🎯 Tus Favoritos</div>
                <div className="space-y-1">
                  {userPreferences.favoriteFoods.slice(0, 3).map((food, index) => (
                    <div key={index} className="text-xs bg-white/5 rounded-lg p-2">
                      <div className="flex justify-between">
                        <span className="truncate">{food.name}</span>
                        <span className="text-purple-300 ml-2">{food.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                {userPreferences.dietType && (
                  <div className="mt-2 text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-2">
                    <span className="opacity-75">Dieta: </span>
                    <span className="font-medium">{userPreferences.dietType}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Chat Area */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-3 sm:p-4 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-1">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                        : 'bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex items-center gap-2 mb-2 opacity-75">
                        <Sparkles size={16} />
                        <span className="text-xs">
                          {message.isLocal ? 'Respuesta Local' : 'IA (Gemini)'}
                        </span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap prose prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text || ''}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm opacity-75">Pensando...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="space-y-2">
            {/* Contador de caracteres */}
            <div className="flex justify-between items-center px-2">
              <span className={`text-xs ${charCount > MAX_CHARS * 0.9 ? 'text-red-400' : 'opacity-50'}`}>
                {charCount}/{MAX_CHARS} caracteres
              </span>
              {charCount > MAX_CHARS * 0.9 && (
                <span className="text-xs text-red-400">⚠️ Cerca del límite</span>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje... (máximo 500 caracteres)"
                className="flex-1 p-2 sm:p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={2}
                disabled={isLoading}
                maxLength={MAX_CHARS}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim() || charCount > MAX_CHARS}
                className="p-2 sm:p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end flex items-center justify-center"
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
