// Script para listar modelos disponibles en tu API Key
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyC9R7T8UN8O9Jii_eMXU3KVG3oCDCbuTZA';

async function listAvailableModels() {
  try {
    console.log('🔍 Consultando modelos disponibles en tu API Key...\n');

    const genAI = new GoogleGenerativeAI(API_KEY);
    const models = await genAI.listModels();

    console.log('✅ Modelos disponibles:\n');
    
    for (const model of models) {
      console.log(`📌 ${model.name}`);
      console.log(`   Soporta generateContent: ${model.supportedGenerationMethods?.includes('generateContent')}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error al listar modelos:', error.message);
    console.error('\n💡 SOLUCIÓN:');
    console.error('   Tu API Key puede estar inválida o bloqueada.');
    console.error('   Crea una nueva en: https://makersuite.google.com/app/apikey\n');
  }
}

listAvailableModels();
