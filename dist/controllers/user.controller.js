"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.createUser = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const password_1 = require("../utils/password");
const getUsers = async (req, res) => {
    if (!req.auth)
        return res.status(401).json({ message: "Niet ingelogd" });
    if (req.auth.role !== "ADMIN")
        return res.status(403).json({ message: "Geen toegang" });
    const users = await prisma_1.default.user.findMany({
        select: { id: true, name: true, email: true },
    });
    return res.json(users);
};
exports.getUsers = getUsers;
const getUser = async (req, res) => {
    if (!req.auth)
        return res.status(401).json({ message: "Niet ingelogd" });
    const id = Number(req.params.id);
    if (req.auth.role !== "ADMIN" && req.auth.id !== id) {
        return res.status(403).json({ message: "Geen toegang" });
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            phone: true,
            street: true,
            city: true,
            postalCode: true,
            country: true,
            role: true,
            isActive: true,
        },
    });
    if (!user)
        return res.status(404).json({ message: "Gebruiker niet gevonden" });
    return res.json(user);
};
exports.getUser = getUser;
const updateUser = async (req, res) => {
    if (!req.auth)
        return res.status(401).json({ message: "Niet ingelogd" });
    const id = Number(req.params.id);
    if (req.auth.role !== "ADMIN" && req.auth.id !== id) {
        return res.status(403).json({ message: "Geen toegang" });
    }
    const { name, email, lastName, phone, street, city, postalCode, country } = req.body;
    if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Naam is verplicht" });
    }
    if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "E-mailadres is verplicht" });
    }
    if (typeof lastName !== "string" || !lastName.trim()) {
        return res.status(400).json({ message: "Achternaam is verplicht" });
    }
    if (typeof street !== "string" || !street.trim()) {
        return res.status(400).json({ message: "Straat is verplicht" });
    }
    if (typeof city !== "string" || !city.trim()) {
        return res.status(400).json({ message: "Plaats is verplicht" });
    }
    if (typeof postalCode !== "string" || !postalCode.trim()) {
        return res.status(400).json({ message: "Postcode is verplicht" });
    }
    if (typeof country !== "string" || !country.trim()) {
        return res.status(400).json({ message: "Land is verplicht" });
    }
    const phoneValue = typeof phone === "string" && phone.trim() ? phone.trim() : null;
    try {
        const updated = await prisma_1.default.user.update({
            where: { id },
            data: {
                name: name.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                phone: phoneValue,
                street: street.trim(),
                city: city.trim(),
                postalCode: postalCode.trim(),
                country: country.trim(),
            },
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                phone: true,
                street: true,
                city: true,
                postalCode: true,
                country: true,
            },
        });
        return res.json(updated);
    }
    catch (error) {
        if (typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002") {
            return res.status(409).json({ message: "E-mailadres is al in gebruik" });
        }
        return res.status(404).json({ message: "Gebruiker niet gevonden" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    if (!req.auth)
        return res.status(401).json({ message: "Niet ingelogd" });
    if (req.auth.role !== "ADMIN")
        return res.status(403).json({ message: "Geen toegang" });
    const id = Number(req.params.id);
    try {
        await prisma_1.default.user.delete({ where: { id } });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(404).json({ message: "Gebruiker niet gevonden" });
    }
};
exports.deleteUser = deleteUser;
const createUser = async (req, res) => {
    if (!req.auth)
        return res.status(401).json({ message: "Niet ingelogd" });
    if (req.auth.role !== "ADMIN")
        return res.status(403).json({ message: "Geen toegang" });
    const { name, email, password } = req.body;
    if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Naam is verplicht" });
    }
    if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "E-mailadres is verplicht" });
    }
    const passwordHash = typeof password === "string" && password ? await (0, password_1.hashPassword)(password) : "";
    const user = await prisma_1.default.user.create({
        data: { name: name.trim(), email: email.trim(), passwordHash },
        select: { id: true, name: true, email: true },
    });
    return res.status(201).json(user);
};
exports.createUser = createUser;
const changePassword = async (req, res) => {
    if (!req.auth)
        return res.status(401).json({ message: "Niet ingelogd" });
    const id = Number(req.params.id);
    if (req.auth.role !== "ADMIN" && req.auth.id !== id) {
        return res.status(403).json({ message: "Geen toegang" });
    }
    const { currentPassword, newPassword } = req.body;
    if (typeof currentPassword !== "string" || !currentPassword) {
        return res.status(400).json({ message: "Huidig wachtwoord is verplicht" });
    }
    if (typeof newPassword !== "string" || newPassword.length < 8) {
        return res
            .status(400)
            .json({ message: "Wachtwoord moet minstens 8 tekens zijn" });
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        select: { id: true, passwordHash: true },
    });
    if (!user) {
        return res.status(404).json({ message: "Gebruiker niet gevonden" });
    }
    const ok = await (0, password_1.verifyPassword)(currentPassword, user.passwordHash);
    if (!ok) {
        return res.status(401).json({ message: "Huidig wachtwoord is onjuist" });
    }
    const passwordHash = await (0, password_1.hashPassword)(newPassword);
    await prisma_1.default.user.update({
        where: { id },
        data: { passwordHash },
        select: { id: true },
    });
    return res.json({ message: "Wachtwoord bijgewerkt" });
};
exports.changePassword = changePassword;
