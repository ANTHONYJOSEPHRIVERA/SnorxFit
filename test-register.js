const https = require('https');
const http = require('http');

async function testRegisterUser() {
    console.log('🔍 Probando registro de usuario...');
    
    const testUser = {
        email: 'test@snorxfit.com',
        name: 'Usuario Prueba',
        password: 'password123'
    };

    const postData = JSON.stringify(testUser);
    
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        console.log('Status:', res.statusCode);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('Response:', JSON.stringify(jsonData, null, 2));
                
                if (res.statusCode === 201) {
                    console.log('✅ Registro exitoso!');
                } else {
                    console.log('❌ Registro falló');
                }
            } catch (error) {
                console.log('Raw Response:', data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Error:', error.message);
    });

    req.write(postData);
    req.end();
}

testRegisterUser();