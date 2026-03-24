"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.getClientById = exports.getClients = exports.createClient = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const createClient = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, dateOfBirth, street, city, postalCode, country, } = req.body;
        const client = await prisma_1.default.client.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                street,
                city,
                postalCode,
                country,
            },
        });
        res.status(201).json(client);
    }
    catch (error) {
        res.status(500).json({ error: "Fout bij aanmaken client" });
    }
};
exports.createClient = createClient;
const getClients = async (req, res) => {
    try {
        const clients = await prisma_1.default.client.findMany();
        res.json(clients);
    }
    catch (error) {
        res.status(500).json({ error: "Fout bij ophalen clients" });
    }
};
exports.getClients = getClients;
const getClientById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const client = await prisma_1.default.client.findUnique({
            where: { id },
        });
        if (!client) {
            return res.status(404).json({ error: "Client niet gevonden" });
        }
        return res.status(200).json(client);
    }
    catch (error) {
        res.status(500).json({ error: "Fout bij ophalen client" });
    }
};
exports.getClientById = getClientById;
const updateClient = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updatedClient = await prisma_1.default.client.update({
            where: { id },
            data: req.body,
        });
        res.json(updatedClient);
    }
    catch (error) {
        res.status(500).json({ error: "Fout bij updaten client" });
    }
};
exports.updateClient = updateClient;
const deleteClient = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const existingProjects = await prisma_1.default.project.findMany({
            where: {
                clientId: id,
            },
        });
        if (existingProjects.length > 0) {
            return res.status(400).json({
                error: "Client kan niet worden verwijderd omdat er projecten aan gekoppeld zijn.",
            });
        }
        await prisma_1.default.client.delete({
            where: { id },
        });
        res.json({ message: "Client verwijderd" });
    }
    catch (error) {
        res.status(500).json({ error: "Fout bij verwijderen client" });
    }
};
exports.deleteClient = deleteClient;
