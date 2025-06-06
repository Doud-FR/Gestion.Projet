import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: { projects: true }
        }
      }
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getClientById = async (req: Request, res: Response) => {
  res.json({ message: 'getClientById' });
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, website } = req.body;

    const existingClient = await prisma.client.findUnique({
      where: { email }
    });

    if (existingClient) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
        website
      },
      include: {
        _count: {
          select: { projects: true }
        }
      }
    });

    res.status(201).json(client);
  } catch (error) {
    logger.error('Error creating client:', error);
    res.status(500).json({ error: 'Erreur lors de la création du client' });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await prisma.client.update({
      where: { id },
      data: req.body,
      include: {
        _count: {
          select: { projects: true }
        }
      }
    });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.client.delete({
      where: { id }
    });
    res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};
