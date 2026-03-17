"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getProjects = async (req, res) => {
    const projects = await prisma_1.default.project.findMany();
    return res.json(projects);
};
exports.getProjects = getProjects;
const getProject = async (req, res) => {
    const id = Number(req.params.id);
    const project = await prisma_1.default.project.findUnique({ where: { id } });
    if (!project)
        return res.status(404).json({ message: "Project not found" });
    return res.json(project);
};
exports.getProject = getProject;
const createProject = async (req, res) => {
    const data = req.body;
    const project = await prisma_1.default.project.create({
        data: {
            name: data.name,
            description: data.description,
            status: "",
            deadline: data.deadline,
            client_id: "",
        },
    });
    return res.status(201).json(project);
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    const id = Number(req.params.id);
    const data = req.body;
    try {
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
        await prisma_1.default.project.delete({ where: { id } });
        return res.status(204).send();
    }
    catch (e) {
        return res.status(404).json({ message: "Project not found" });
    }
};
exports.deleteProject = deleteProject;
