// Listar modelos disponibles en Gemini
const GEMINI_API_KEY = 'AIzaSyA3JAxsrZcGNCho5sfudmDgWQxPRRUpyXc';

async function listModels() {
  try {
    console.log('🔍 Listando modelos disponibles...\n');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error:', error);
      return;
    }

    const data = await response.json();

    console.log('✅ Modelos disponibles:\n');
    
    data.models.forEach(model => {
      console.log(`📌 ${model.name}`);
      console.log(`   Descripción: ${model.description || 'N/A'}`);
      console.log(`   Métodos: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listModels();
