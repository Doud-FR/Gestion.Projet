import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (existingAdmin) {
      console.log('L\'utilisateur admin existe déjà');
      return;
    }

    // Créer l'utilisateur admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'System',
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('✅ Utilisateur admin créé avec succès!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Mot de passe: admin123');
    
    // Créer quelques données de test
    const client = await prisma.client.create({
      data: {
        name: 'Client Test',
        email: 'client@test.com',
        phone: '+33 1 23 45 67 89'
      }
    });

    const project = await prisma.project.create({
      data: {
        name: 'Projet de démonstration',
        description: 'Un projet pour tester l\'application',
        clientId: client.id,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // +90 jours
        budget: 50000,
        users: {
          create: {
            userId: admin.id,
            role: 'PROJECT_MANAGER'
          }
        }
      }
    });

    console.log('✅ Données de test créées');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
