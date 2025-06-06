"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.createClient = exports.getClientById = exports.getAllClients = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
const getAllClients = async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            include: {
                _count: {
                    select: { projects: true }
                }
            }
        });
        res.json(clients);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.getAllClients = getAllClients;
const getClientById = async (req, res) => {
    res.json({ message: 'getClientById' });
};
exports.getClientById = getClientById;
const createClient = async (req, res) => {
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
    }
    catch (error) {
        logger_1.logger.error('Error creating client:', error);
        res.status(500).json({ error: 'Erreur lors de la création du client' });
    }
};
exports.createClient = createClient;
const updateClient = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
};
exports.updateClient = updateClient;
const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.client.delete({
            where: { id }
        });
        res.json({ message: 'Client supprimé avec succès' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};
exports.deleteClient = deleteClient;
