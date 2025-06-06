import http from 'http';

const API_HOST = '127.0.0.1'; // Utiliser 127.0.0.1 au lieu de localhost
const API_PORT = 5000;

function makeRequest(options: http.RequestOptions, data?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAPI() {
  try {
    // 1. Se connecter
    console.log('🔐 Connexion...');
    const loginResponse = await makeRequest({
      hostname: API_HOST,
      port: API_PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    if (loginResponse.status !== 200) {
      console.error('❌ Erreur de connexion:', loginResponse.data);
      return;
    }
    
    const { accessToken } = loginResponse.data;
    console.log('✅ Connexion réussie');
    
    // 2. Tester la récupération des utilisateurs
    console.log('\n👥 Test API Utilisateurs...');
    const usersResponse = await makeRequest({
      hostname: API_HOST,
      port: API_PORT,
      path: '/api/users',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (usersResponse.status === 200) {
      console.log(`Nombre d'utilisateurs: ${usersResponse.data.length}`);
      console.table(usersResponse.data);
    } else {
      console.error('❌ Erreur:', usersResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testAPI();
