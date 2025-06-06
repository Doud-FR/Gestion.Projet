import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const admin = await prisma.user.update({
      where: { email: 'admin@example.com' },
      data: { 
        password: hashedPassword,
        isActive: true 
      }
    });

    console.log('✅ Mot de passe réinitialisé avec succès!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Nouveau mot de passe: admin123');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
