"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const password_1 = require("../utils/password");
const token_1 = require("../utils/token");
const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Naam is verplicht" });
    }
    if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "E-mailadres is verplicht" });
    }
    if (typeof password !== "string" || password.length < 8) {
        return res
            .status(400)
            .json({ message: "Wachtwoord moet minstens 8 tekens zijn" });
    }
    try {
        const hasAdmin = await prisma_1.default.user.findFirst({
            where: { role: "ADMIN" },
            select: { id: true },
        });
        const initialRole = hasAdmin ? "USER" : "ADMIN";
        const passwordHash = await (0, password_1.hashPassword)(password);
        const created = await prisma_1.default.user.create({
            data: {
                name: name.trim(),
                email: email.trim(),
                passwordHash,
                role: initialRole,
            },
            select: { id: true, name: true, email: true, role: true },
        });
        if (created.role === "USER") {
            // Create a personal client record for USER so they can create projects
            const personalClient = await prisma_1.default.client.create({
                data: {
                    firstName: created.name,
                    lastName: "",
                    email: created.email,
                },
                select: { id: true },
            });
            await prisma_1.default.user.update({
                where: { id: created.id },
                data: { personalClientId: personalClient.id },
                select: { id: true },
            });
        }
        const token = (0, token_1.createToken)({ userId: created.id, role: created.role });
        return res.status(201).json({ user: created, token });
    }
    catch (error) {
        // Prisma unique constraint violation
        if (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002") {
            return res.status(409).json({ message: "E-mailadres is al in gebruik" });
        }
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "E-mailadres is verplicht" });
    }
    if (typeof password !== "string" || !password) {
        return res.status(400).json({ message: "Wachtwoord is verplicht" });
    }
    const user = await prisma_1.default.user.findUnique({
        where: { email: email.trim() },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            passwordHash: true,
        },
    });
    if (!user) {
        return res
            .status(401)
            .json({ message: "Ongeldig e-mailadres of wachtwoord" });
    }
    const ok = await (0, password_1.verifyPassword)(password, user.passwordHash);
    if (!ok) {
        return res
            .status(401)
            .json({ message: "Ongeldig e-mailadres of wachtwoord" });
    }
    if (!user.isActive) {
        return res.status(401).json({ message: "Account is gedeactiveerd" });
    }
    // Ensure USER has a personal client (for project creation)
    if (user.role === "USER") {
        const existing = await prisma_1.default.user.findUnique({
            where: { id: user.id },
            select: { personalClientId: true },
        });
        if (!existing?.personalClientId) {
            const personalClient = await prisma_1.default.client.create({
                data: { firstName: user.name, lastName: "", email: user.email },
                select: { id: true },
            });
            await prisma_1.default.user.update({
                where: { id: user.id },
                data: { personalClientId: personalClient.id },
                select: { id: true },
            });
        }
    }
    const token = (0, token_1.createToken)({ userId: user.id, role: user.role });
    return res.json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
    });
};
exports.login = login;
