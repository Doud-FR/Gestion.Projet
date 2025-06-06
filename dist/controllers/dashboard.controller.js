"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentActivities = exports.getDashboardStats = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalClients, totalProjects, activeProjects, totalTasks, completedTasks, projectsByStatus, recentProjects] = await Promise.all([
            prisma.user.count(),
            prisma.client.count(),
            prisma.project.count(),
            prisma.project.count({ where: { status: 'ACTIVE' } }),
            prisma.task.count(),
            prisma.task.count({ where: { status: 'DONE' } }),
            prisma.project.groupBy({
                by: ['status'],
                _count: true
            }),
            prisma.project.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    client: true,
                    _count: {
                        select: { tasks: true }
                    }
                }
            })
        ]);
        // Calculer les tendances (simulation)
        const userGrowth = 12.5;
        const clientGrowth = 8.3;
        const projectGrowth = 15.2;
        const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        // Formater les projets par statut
        const projectStatusMap = {
            PLANNING: 0,
            ACTIVE: 0,
            ON_HOLD: 0,
            COMPLETED: 0,
            CANCELLED: 0
        };
        projectsByStatus.forEach(item => {
            projectStatusMap[item.status] = item._count;
        });
        res.json({
            totalUsers,
            totalClients,
            totalProjects,
            activeProjects,
            completedTasks,
            userGrowth,
            clientGrowth,
            projectGrowth,
            taskCompletionRate,
            projectsByStatus: projectStatusMap,
            taskCompletionTrend: [65, 72, 78, 82, 88, 92], // Données simulées
            recentProjects
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};
exports.getDashboardStats = getDashboardStats;
const getRecentActivities = async (req, res) => {
    try {
        const activities = await prisma.activity.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
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
            }
        });
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des activités' });
    }
};
exports.getRecentActivities = getRecentActivities;
