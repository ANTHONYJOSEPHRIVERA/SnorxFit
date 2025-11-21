// Script de prueba para nueva API Key de Gemini
const GEMINI_API_KEY = 'AIzaSyA3JAxsrZcGNCho5sfudmDgWQxPRRUpyXc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function testGeminiAPI() {
  try {
    console.log('🔍 Probando nueva API Key de Gemini...\n');
    console.log('🔑 API Key:', GEMINI_API_KEY.substring(0, 15) + '...\n');

    console.log('📤 Enviando mensaje de prueba...\n');

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: '¿Qué alimentos tienen más proteínas? Responde en español de forma breve.'
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error HTTP:', response.status, response.statusText);
      console.error('Detalles:', JSON.stringify(errorData, null, 2));
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log('✅ CONEXIÓN EXITOSA!\n');
    console.log('📨 Respuesta de Gemini:');
    console.log(data.candidates[0].content.parts[0].text);
    console.log('\n🎉 La API de Gemini está funcionando correctamente!\n');
    console.log('💡 Ahora puedes usar el chatbot en tu aplicación!\n');

  } catch (error) {
    console.error('\n❌ ERROR AL CONECTAR CON GEMINI:\n');
    console.error('Mensaje:', error.message);
    console.error('\n💡 SOLUCIÓN:');
    console.error('   1. Verifica que la API key sea correcta');
    console.error('   2. Verifica que la API key esté habilitada en Google AI Studio');
    console.error('   3. Revisa: https://aistudio.google.com/app/apikey\n');
  }
}

// Ejecutar la prueba
testGeminiAPI();
