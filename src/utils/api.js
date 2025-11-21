import { ALIMENTOS_DB } from '../data/foodDatabase';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Configuration for Gemini API
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyA3JAxsrZcGNCho5sfudmDgWQxPRRUpyXc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

console.log('🔑 Gemini API Key cargada:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'NO ENCONTRADA');
console.log('🔍 Fuente de API Key:', process.env.REACT_APP_GEMINI_API_KEY ? 'Variable de entorno' : 'Hardcodeada (temporal)');
console.log('🤖 Modelo Gemini:', 'gemini-2.0-flash (estable y rápido)');

// Function to log chat metrics to Firebase
export const logChatMetric = async (messageType, latency, success, userId = null) => {
  try {
    await addDoc(collection(db, 'chat_metrics'), {
      messageType, // 'local' | 'api' | 'predefined'
      latency,
      success,
      userId,
      timestamp: serverTimestamp()
    });
    console.log(`📊 Métrica guardada: ${messageType} - ${latency}ms - ${success ? '✅' : '❌'}`);
  } catch (error) {
    console.error('❌ Error logging metric:', error);
  }
};

// Function to chat with Gemini
export const chatWithGemini = async (message) => {
  try {
    if (!GEMINI_API_KEY) {
      console.error('❌ Gemini API key not found');
      throw new Error('API key not configured. Asegúrate de tener REACT_APP_GEMINI_API_KEY en tu archivo .env');
    }

    console.log('🤖 Iniciando llamada a Gemini API');
    console.log('📝 Mensaje del usuario:', message);

    // System prompt con información de la base de datos
    const systemPrompt = `Eres un asistente de fitness y nutrición experto. Responde en español de forma breve, práctica y motivadora.

Tienes acceso a información nutricional de más de 220 alimentos peruanos e internacionales.

EJEMPLOS DE MACRONUTRIENTES:
- Pollo a la plancha: 450 kcal, 35g proteína, 55g carbos, 10g grasa
- Arroz con pollo: 450 kcal, 35g proteína, 55g carbos, 10g grasa
- Lomo saltado: 550 kcal, 32g proteína, 50g carbos, 22g grasa
- Ceviche: 200 kcal, 28g proteína, 15g carbos, 4g grasa
- Huevos (2): 180 kcal, 14g proteína, 2g carbos, 12g grasa
- Yogurt griego: 150 kcal, 12g proteína, 15g carbos, 5g grasa
- Coca Cola Zero: 0 calorías
- Coca Cola normal: 140 calorías

TIPS PARA DÉFICIT CALÓRICO:
- Prioriza proteínas: pollo, pescado, huevos, yogurt descremado
- Usa bebidas Zero para ahorrar calorías
- Aumenta verduras: pocas calorías, mucha saciedad
- Evita: gaseosas normales, frituras, dulces procesados

TIPS PARA GANAR MASA MUSCULAR:
- Consume 1.6-2.2g de proteína por kg de peso
- Incluye carbohidratos post-entreno
- Grasas saludables: palta, frutos secos

Responde de forma directa con ejemplos específicos y números concretos.`;

    console.log('🔄 Generando respuesta con Gemini...');
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: systemPrompt + '\n\nPregunta del usuario: ' + message
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
        responseMimeType: "text/plain"
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE"
        }
      ]
    };

    console.log('📤 Enviando request a Gemini...');
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`📥 Respuesta HTTP: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error de Gemini API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      if (response.status === 400) {
        throw new Error('Error en la petición a Gemini. Verifica la API Key.');
      } else if (response.status === 429) {
        throw new Error('Límite de peticiones excedido. Intenta en unos minutos.');
      } else if (response.status === 403) {
        throw new Error('API Key inválida o sin permisos.');
      }
      
      throw new Error(`Error Gemini: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    console.log('📊 Respuesta de Gemini:', JSON.stringify(data).substring(0, 200) + '...');
    
    // Verificar diferentes formatos de respuesta
    if (!data.candidates || data.candidates.length === 0) {
      console.error('❌ No hay candidatos en la respuesta:', data);
      throw new Error('Respuesta sin candidatos de Gemini API');
    }
    
    const candidate = data.candidates[0];
    
    // Verificar si hay contenido
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      console.error('❌ Candidato sin contenido:', candidate);
      
      // Verificar si fue bloqueado por seguridad
      if (candidate.finishReason === 'SAFETY') {
        throw new Error('Respuesta bloqueada por filtros de seguridad');
      } else if (candidate.finishReason === 'MAX_TOKENS') {
        throw new Error('Respuesta incompleta (límite de tokens)');
      }
      
      throw new Error(`Respuesta inválida de Gemini (finishReason: ${candidate.finishReason})`);
    }
    
    const text = candidate.content.parts[0].text;
    
    if (!text || text.trim() === '') {
      throw new Error('Respuesta vacía de Gemini');
    }
    
    console.log('✅ Respuesta de Gemini recibida:', text.substring(0, 100) + '...');
    return text;
    
  } catch (error) {
    console.error('❌ Error detallado en Gemini API:', {
      message: error.message,
      stack: error.stack
    });
    
    // Re-throw the error so the chatbot can handle it
    throw error;
  }
};

// Legacy API call function (keep for other potential uses)
export const makeApiCall = async (endpoint) => {
  try {
    const response = await fetch(`your_api_base_url/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
