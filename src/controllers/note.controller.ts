import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getAllNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        OR: [
          { authorId: req.user!.id },
          { project: { users: { some: { userId: req.user!.id } } } }
        ]
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        author: true,
        project: true
      }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note non trouvée' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, projectId, tags } = req.body;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        projectId,
        tags: tags || [],
        authorId: req.user!.id
      }
    });

    if (projectId) {
      await prisma.activity.create({
        data: {
          type: 'NOTE_CREATED',
          description: `Note "${title}" créée`,
          projectId,
          userId: req.user!.id
        }
      });
    }

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la note' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const note = await prisma.note.update({
      where: { id },
      data: req.body
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.note.delete({
      where: { id }
    });
    res.json({ message: 'Note supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};
