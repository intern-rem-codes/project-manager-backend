"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getProjects = async (req, res) => {
    const auth = req.auth;
    if (!auth)
        return res.status(401).json({ message: "Niet ingelogd" });
    const where = auth.role === "USER" ? { ownerId: auth.id } : undefined;
    const projects = await prisma_1.default.project.findMany({ where });
    return res.json(projects);
};
exports.getProjects = getProjects;
const getProject = async (req, res) => {
    const id = Number(req.params.id);
    const auth = req.auth;
    if (!auth)
        return res.status(401).json({ message: "Niet ingelogd" });
    const project = await prisma_1.default.project.findUnique({ where: { id } });
    if (!project)
        return res.status(404).json({ message: "Project not found" });
    if (auth.role === "USER" && project.ownerId !== auth.id) {
        return res.status(403).json({ message: "Geen toegang" });
    }
    return res.json(project);
};
exports.getProject = getProject;
const createProject = async (req, res) => {
    const auth = req.auth;
    if (!auth)
        return res.status(401).json({ message: "Niet ingelogd" });
    const { name, description, deadline, status, clientId } = req.body;
    if (typeof name !== "string" || !name.trim())
        return res.status(400).json({ message: "Naam is verplicht" });
    if (typeof description !== "string" || !description.trim())
        return res.status(400).json({ message: "Beschrijving is verplicht" });
    if (typeof deadline !== "string" || !deadline.trim())
        return res.status(400).json({ message: "Deadline is verplicht" });
    if (typeof status !== "string" || !status.trim())
        return res.status(400).json({ message: "Status is verplicht" });
    let connectClientId = null;
    if (auth.role === "ADMIN") {
        if (typeof clientId !== "string" && typeof clientId !== "number") {
            return res.status(400).json({ message: "Klant is verplicht" });
        }
        connectClientId = Number(clientId);
        if (!Number.isFinite(connectClientId)) {
            return res.status(400).json({ message: "Ongeldige klant" });
        }
    }
    else {
        const me = await prisma_1.default.user.findUnique({
            where: { id: auth.id },
            select: { personalClientId: true },
        });
        if (!me?.personalClientId) {
            return res.status(400).json({ message: "Geen persoonlijke klant gevonden" });
        }
        connectClientId = me.personalClientId;
    }
    const project = await prisma_1.default.project.create({
        data: {
            name: name.trim(),
            description: description.trim(),
            status: status.trim(),
            deadline: deadline.trim(),
            client: { connect: { id: connectClientId } },
            owner: { connect: { id: auth.id } },
            created_at: new Date(),
            updated_at: new Date(),
        },
    });
    return res.status(201).json(project);
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    const id = Number(req.params.id);
    const data = req.body;
    try {
        const auth = req.auth;
        if (!auth)
            return res.status(401).json({ message: "Niet ingelogd" });
        const existing = await prisma_1.default.project.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ message: "Project not found" });
        if (auth.role === "USER" && existing.ownerId !== auth.id) {
            return res.status(403).json({ message: "Geen toegang" });
        }
        const updated = await prisma_1.default.project.update({ where: { id }, data });
        return res.json(updated);
    }
    catch (e) {
        return res.status(404).json({ message: "Project not found" });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const auth = req.auth;
        if (!auth)
            return res.status(401).json({ message: "Niet ingelogd" });
        const existing = await prisma_1.default.project.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ message: "Project not found" });
        if (auth.role === "USER" && existing.ownerId !== auth.id) {
            return res.status(403).json({ message: "Geen toegang" });
        }
        await prisma_1.default.project.delete({ where: { id } });
        return res.status(204).send();
    }
    catch (e) {
        return res.status(404).json({ message: "Project not found" });
    }
};
exports.deleteProject = deleteProject;
