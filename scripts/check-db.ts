import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function checkDatabase() {
  try {
    console.log('🔍 Vérification de la connexion à la base de données...');
    
    // Test de connexion
    await prisma.$connect();
    console.log('✅ Connexion réussie');
    
    // Compter les utilisateurs
    const userCount = await prisma.user.count();
    console.log(`\n👥 Nombre d'utilisateurs: ${userCount}`);
    
    // Lister les utilisateurs
    const users = await prisma.user.findMany();
    console.log('\nUtilisateurs:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName}) - Role: ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
