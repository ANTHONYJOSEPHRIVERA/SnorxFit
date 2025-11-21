// Test rápido de Gemini API
const GEMINI_API_KEY = 'AIzaSyA3JAxsrZcGNCho5sfudmDgWQxPRRUpyXc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function testGemini() {
  console.log('🧪 Probando Gemini API...');
  
  try {
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
                text: '¿Es mejor entrenar en ayunas o después de comer? Responde en español brevemente.'
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          responseMimeType: "text/plain"
        }
      })
    });

    console.log('📥 Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error:', errorData);
      return;
    }

    const data = await response.json();
    console.log('✅ Respuesta completa:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      const text = data.candidates[0].content.parts[0].text;
      console.log('\n💬 Respuesta de Gemini:\n', text);
    } else {
      console.log('⚠️ Formato de respuesta inesperado');
      console.log('FinishReason:', data.candidates?.[0]?.finishReason);
    }
  } catch (error) {
    console.error('❌ Error de red:', error.message);
  }
}

testGemini();
