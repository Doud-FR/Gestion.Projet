import axios from 'axios';

const API_URL = 'http://localhost:5000';

async function testAPI() {
  try {
    // 1. Se connecter
    console.log('🔐 Connexion...');
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const { accessToken } = loginResponse.data;
    console.log('✅ Connexion réussie');
    
    // 2. Configurer axios avec le token
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    
    // 3. Tester la récupération des utilisateurs
    console.log('\n👥 Test API Utilisateurs...');
    const usersResponse = await axios.get(`${API_URL}/api/users`);
    console.log(`Nombre d'utilisateurs: ${usersResponse.data.length}`);
    console.table(usersResponse.data);
    
    // 4. Tester les autres endpoints
    console.log('\n📊 Test API Dashboard...');
    const dashboardResponse = await axios.get(`${API_URL}/api/dashboard/stats`);
    console.log('Stats dashboard:', dashboardResponse.data);
    
  } catch (error: any) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testAPI();
