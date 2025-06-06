"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.addUserToProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getAllProjects = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllProjects = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getAllProjects = getAllProjects;
const getProjectById = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getProjectById = getProjectById;
const createProject = async (req, res) => {
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
                        userId: req.user.id,
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
                userId: req.user.id
            }
        });
        res.status(201).json(project);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du projet' });
    }
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.project.update({
            where: { id },
            data: req.body
        });
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
};
exports.updateProject = updateProject;
const addUserToProject = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur' });
    }
};
exports.addUserToProject = addUserToProject;
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.project.delete({
            where: { id }
        });
        res.json({ message: 'Projet supprimé avec succès' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};
exports.deleteProject = deleteProject;
