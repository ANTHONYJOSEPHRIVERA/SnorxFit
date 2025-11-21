// Script de prueba para DeepSeek API
const DEEPSEEK_API_KEY = 'sk-33ebe2d404e6429bbd392def051e6b31';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

async function testDeepSeekAPI() {
  try {
    console.log('🔍 Probando conexión con DeepSeek API...\n');
    console.log('🔑 API Key:', DEEPSEEK_API_KEY.substring(0, 15) + '...\n');

    console.log('📤 Enviando mensaje de prueba...\n');

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente de fitness y nutrición. Responde en español de forma breve.'
          },
          {
            role: 'user',
            content: '¿Qué alimentos tienen más proteínas?'
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error HTTP:', response.status, response.statusText);
      console.error('Detalles:', errorData);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log('✅ CONEXIÓN EXITOSA!\n');
    console.log('📨 Respuesta de DeepSeek:');
    console.log(data.choices[0].message.content);
    console.log('\n🎉 La API de DeepSeek está funcionando correctamente!\n');

  } catch (error) {
    console.error('\n❌ ERROR AL CONECTAR CON DEEPSEEK:\n');
    console.error('Mensaje:', error.message);
    console.error('\n💡 SOLUCIÓN:');
    console.error('   1. Verifica que la API key sea correcta');
    console.error('   2. Verifica que tengas saldo en DeepSeek');
    console.error('   3. Revisa: https://platform.deepseek.com/api_keys\n');
  }
}

// Ejecutar la prueba
testDeepSeekAPI();
