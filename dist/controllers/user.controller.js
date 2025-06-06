"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.deleteUser = exports.updateUserRole = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
const getAllUsers = async (req, res) => {
    try {
        logger_1.logger.info('Fetching all users...');
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });
        logger_1.logger.info(`Found ${users.length} users`);
        res.json(users);
    }
    catch (error) {
        logger_1.logger.error('Error fetching users:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                darkMode: true,
                createdAt: true
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, darkMode } = req.body;
        const user = await prisma.user.update({
            where: { id },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(email && { email }),
                ...(darkMode !== undefined && { darkMode })
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                darkMode: true
            }
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
};
exports.updateUser = updateUser;
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await prisma.user.update({
            where: { id },
            data: { role }
        });
        res.json({ message: 'Rôle mis à jour avec succès' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle' });
    }
};
exports.updateUserRole = updateUserRole;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.update({
            where: { id },
            data: { isActive: false }
        });
        res.json({ message: 'Utilisateur désactivé avec succès' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};
exports.deleteUser = deleteUser;
const createUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }
        // Hasher le mot de passe
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });
        res.status(201).json(user);
    }
    catch (error) {
        logger_1.logger.error('Error creating user:', error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
};
exports.createUser = createUser;
