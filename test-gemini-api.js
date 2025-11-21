// Script de prueba para verificar la API de Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');

// API Key actual
const API_KEY = 'AIzaSyC9R7T8UN8O9Jii_eMXU3KVG3oCDCbuTZA';

async function testGeminiAPI() {
  try {
    console.log('🔍 Probando conexión con Gemini API...\n');
    console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...\n');

    // Inicializar Gemini
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log('📤 Enviando mensaje de prueba...\n');

    // Enviar un mensaje simple
    const result = await model.generateContent("Di hola en una palabra");
    const response = result.response;
    const text = response.text();

    console.log('✅ CONEXIÓN EXITOSA!');
    console.log('📨 Respuesta de Gemini:', text);
    console.log('\n🎉 La API está funcionando correctamente!\n');

  } catch (error) {
    console.error('❌ ERROR AL CONECTAR CON GEMINI:\n');
    console.error('Tipo de error:', error.name);
    console.error('Mensaje:', error.message);
    
    if (error.message.includes('API key')) {
      console.error('\n💡 SOLUCIÓN: La API key no es válida.');
      console.error('   → Necesitas crear una nueva API key en:');
      console.error('   → https://makersuite.google.com/app/apikey\n');
    } else if (error.message.includes('quota')) {
      console.error('\n💡 SOLUCIÓN: Has excedido el límite de uso.');
      console.error('   → Espera 24 horas o crea una nueva API key\n');
    } else if (error.message.includes('blocked')) {
      console.error('\n💡 SOLUCIÓN: El contenido fue bloqueado por seguridad.');
      console.error('   → Esto es normal, la API funciona!\n');
    } else {
      console.error('\n💡 Error desconocido. Detalles completos:');
      console.error(error);
    }
  }
}

// Ejecutar la prueba
testGeminiAPI();
