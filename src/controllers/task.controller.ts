import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
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
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      title, 
      description, 
      projectId, 
      startDate, 
      endDate, 
      assignedToId, 
      status, 
      progress,
      estimatedHours,
      actualHours,
      dependencies 
    } = req.body;

    // Vérifier que le projet existe
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    // Vérifier les dépendances si fournies
    if (dependencies && dependencies.length > 0) {
      const dependencyTasks = await prisma.task.findMany({
        where: {
          id: { in: dependencies },
          projectId // S'assurer que les dépendances sont du même projet
        }
      });

      if (dependencyTasks.length !== dependencies.length) {
        return res.status(400).json({ error: 'Une ou plusieurs dépendances invalides' });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assignedToId,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'TODO',
        progress: progress || 0,
        estimatedHours: estimatedHours || null,
        actualHours: actualHours || null
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Créer les dépendances
    if (dependencies && dependencies.length > 0) {
      await prisma.taskDependency.createMany({
        data: dependencies.map((depId: string) => ({
          dependentTaskId: task.id,
          dependsOnTaskId: depId
        }))
      });
    }

    // Mettre à jour la progression du projet
    await updateProjectProgress(projectId);

    await prisma.activity.create({
      data: {
        type: 'TASK_CREATED',
        description: `Tâche "${title}" créée`,
        projectId,
        userId: req.user!.id
      }
    });

    res.status(201).json(task);
  } catch (error) {
    logger.error('Error creating task:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la tâche' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.update({
      where: { id },
      data: req.body
    });

    if (task.projectId) {
      await updateProjectProgress(task.projectId);
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { 
        status,
        progress: status === 'DONE' ? 100 : undefined
      }
    });

    if (task.projectId) {
      await updateProjectProgress(task.projectId);
    }

    await prisma.activity.create({
      data: {
        type: 'TASK_STATUS_UPDATED',
        description: `Statut de la tâche "${task.title}" mis à jour: ${status}`,
        projectId: task.projectId,
        userId: req.user!.id
      }
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.delete({
      where: { id }
    });

    if (task.projectId) {
      await updateProjectProgress(task.projectId);
    }

    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

// Fonction helper pour mettre à jour la progression du projet
async function updateProjectProgress(projectId: string) {
  const tasks = await prisma.task.findMany({
    where: { projectId }
  });

  if (tasks.length === 0) return;

  const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
  const averageProgress = totalProgress / tasks.length;

  await prisma.project.update({
    where: { id: projectId },
    data: { progress: averageProgress }
  });
}
