"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
const generateTokens = (userId) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '15m' });
    const refreshToken = jsonwebtoken_1.default.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
    return { accessToken, refreshToken };
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user || !await bcryptjs_1.default.compare(password, user.password)) {
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
    }
    catch (error) {
        logger_1.logger.error('Login error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
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
    }
    catch (error) {
        logger_1.logger.error('Register error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.register = register;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true }
        });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            return res.status(401).json({ error: 'Refresh token invalide' });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
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
    }
    catch (error) {
        logger_1.logger.error('Refresh token error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        });
        res.json({ message: 'Déconnexion réussie' });
    }
    catch (error) {
        logger_1.logger.error('Logout error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.logout = logout;
