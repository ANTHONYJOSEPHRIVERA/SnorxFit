// Test simple para verificar conexión con Gemini
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = "AIzaSyC9R7T8UN8O9Jii_eMXU3KVG3oCDCbuTZA";

async function testGeminiConnection() {
  try {
    console.log('🔄 Probando conexión con Gemini 1.5 Flash...');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Hola, solo responde 'Conexión exitosa con Gemini AI'";
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('✅ Respuesta de Gemini:', text);
    console.log('🎉 ¡Conexión exitosa!');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('Detalles:', error);
  }
}

testGeminiConnection();
