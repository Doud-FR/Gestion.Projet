import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRE || '15m' } as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Sauvegarder le refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'LOGIN',
        description: 'Connexion réussie',
        userId: user.id
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Compte créé avec succès',
      user: userWithoutPassword
    });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Refresh token invalide' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    // Supprimer l'ancien token et créer le nouveau
    await prisma.refreshToken.delete({
      where: { id: storedToken.id }
    });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: decoded.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    });

    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
