// Prueba de conexión directa con la API
const testApiConnection = async () => {
  console.log('🔍 Probando conexión con la API...');
  
  // 1. Probar Health Check
  try {
    const healthResponse = await fetch('http://localhost:5000/api/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Check exitoso:', healthData);
    } else {
      console.error('❌ Health Check falló:', healthResponse.status);
      return;
    }
  } catch (error) {
    console.error('❌ Error en Health Check:', error);
    return;
  }

  // 2. Probar registro de usuario
  const testUser = {
    email: 'test@snorxfit.com',
    name: 'Usuario Prueba',
    password: 'password123'
  };

  try {
    console.log('📝 Probando registro de usuario...');
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Registro exitoso:', registerData);
    } else {
      console.error('❌ Registro falló:', registerData);
    }
  } catch (error) {
    console.error('❌ Error en registro:', error);
  }
};

// Ejecutar la prueba cuando la página cargue
if (typeof window !== 'undefined') {
  window.testApiConnection = testApiConnection;
  console.log('🧪 Función de prueba cargada. Ejecuta: testApiConnection()');
}

export default testApiConnection;