"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getUsers = async (req, res) => {
    const users = await prisma_1.default.user.findMany();
    return res.json(users);
};
exports.getUsers = getUsers;
const getUser = async (req, res) => {
    const id = Number(req.params.id);
    const user = await prisma_1.default.user.findUnique({ where: { id } });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    return res.json(user);
};
exports.getUser = getUser;
const updateUser = async (req, res) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;
    try {
        const updated = await prisma_1.default.user.update({
            where: { id },
            data: { name, email },
        });
        return res.json(updated);
    }
    catch (error) {
        return res.status(404).json({ message: "User not found" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma_1.default.user.delete({ where: { id } });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(404).json({ message: "User not found" });
    }
};
exports.deleteUser = deleteUser;
const createUser = async (req, res) => {
    const { name, email } = req.body;
    const user = await prisma_1.default.user.create({
        data: {
            name,
            email,
        },
    });
    return res.json(user);
};
exports.createUser = createUser;
