"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAdmin = exports.resetPasswordAdmin = exports.updateUserAdmin = exports.listUsers = void 0;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = __importDefault(require("../prisma"));
const password_1 = require("../utils/password");
const listUsers = async (_req, res) => {
    const users = await prisma_1.default.user.findMany({
        orderBy: { id: "asc" },
        select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
        },
    });
    return res.json(users);
};
exports.listUsers = listUsers;
const updateUserAdmin = async (req, res) => {
    const id = Number(req.params.id);
    const { role, isActive } = req.body;
    if (req.auth?.id === id) {
        if (role === "USER") {
            return res.status(400).json({ message: "Je kunt je eigen rol niet verlagen" });
        }
        if (isActive === false) {
            return res
                .status(400)
                .json({ message: "Je kunt je eigen account niet deactiveren" });
        }
    }
    const data = {};
    if (role === "USER" || role === "ADMIN")
        data.role = role;
    if (typeof isActive === "boolean")
        data.isActive = isActive;
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ message: "Geen wijzigingen" });
    }
    try {
        const user = await prisma_1.default.user.update({
            where: { id },
            data,
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                role: true,
                isActive: true,
            },
        });
        return res.json(user);
    }
    catch {
        return res.status(404).json({ message: "Gebruiker niet gevonden" });
    }
};
exports.updateUserAdmin = updateUserAdmin;
const resetPasswordAdmin = async (req, res) => {
    const id = Number(req.params.id);
    if (req.auth?.id === id) {
        return res.status(400).json({
            message: "Gebruik accountpagina om je eigen wachtwoord te wijzigen",
        });
    }
    const tempPassword = crypto_1.default.randomBytes(6).toString("base64url");
    const passwordHash = await (0, password_1.hashPassword)(tempPassword);
    try {
        await prisma_1.default.user.update({
            where: { id },
            data: { passwordHash },
            select: { id: true },
        });
        return res.json({ message: "Wachtwoord gereset", tempPassword });
    }
    catch {
        return res.status(404).json({ message: "Gebruiker niet gevonden" });
    }
};
exports.resetPasswordAdmin = resetPasswordAdmin;
const deleteUserAdmin = async (req, res) => {
    const id = Number(req.params.id);
    if (req.auth?.id === id) {
        return res.status(400).json({ message: "Je kunt jezelf niet verwijderen" });
    }
    try {
        await prisma_1.default.user.delete({ where: { id } });
        return res.status(204).send();
    }
    catch {
        return res.status(404).json({ message: "Gebruiker niet gevonden" });
    }
};
exports.deleteUserAdmin = deleteUserAdmin;
