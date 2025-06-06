import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getAllProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        client: true,
        users: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: { tasks: true }
        }
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        users: {
          include: {
            user: true
          }
        },
        tasks: {
          include: {
            assignedTo: true,
            dependencies: {
              include: {
                dependsOnTask: {
                  select: {
                    id: true,
                    title: true,
                    status: true
                  }
                }
              }
            }
          }
        },
        notes: true
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, clientId, startDate, endDate, budget } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        clientId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: budget ? parseFloat(budget) : null,
        users: {
          create: {
            userId: req.user!.id,
            role: 'PROJECT_MANAGER'
          }
        }
      }
    });

    await prisma.activity.create({
      data: {
        type: 'PROJECT_CREATED',
        description: `Projet "${name}" créé`,
        projectId: project.id,
        userId: req.user!.id
      }
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du projet' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.update({
      where: { id },
      data: req.body
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

export const addUserToProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    const projectUser = await prisma.projectUser.create({
      data: {
        projectId: id,
        userId,
        role: role || 'MEMBER'
      }
    });

    res.json(projectUser);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({
      where: { id }
    });
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};
