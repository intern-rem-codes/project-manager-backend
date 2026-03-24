"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProjectFiles = listProjectFiles;
exports.uploadProjectFile = uploadProjectFile;
exports.deleteProjectFile = deleteProjectFile;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const prisma_1 = __importDefault(require("../prisma"));
function publicBaseUrl(req) {
    const host = req.get("host");
    if (!host)
        return "";
    return `${req.protocol}://${host}`;
}
async function assertProjectAccess(req, res) {
    const projectId = Number(req.params.id);
    if (!Number.isFinite(projectId)) {
        res.status(400).json({ message: "Ongeldig project id" });
        return null;
    }
    const auth = req.auth;
    if (!auth) {
        res.status(401).json({ message: "Niet ingelogd" });
        return null;
    }
    const project = await prisma_1.default.project.findUnique({
        where: { id: projectId },
        select: { id: true, ownerId: true },
    });
    if (!project) {
        res.status(404).json({ message: "Project not found" });
        return null;
    }
    if (auth.role === "USER" && project.ownerId !== auth.id) {
        res.status(403).json({ message: "Geen toegang" });
        return null;
    }
    return { projectId, auth };
}
async function listProjectFiles(req, res) {
    const access = await assertProjectAccess(req, res);
    if (!access)
        return;
    const files = await prisma_1.default.projectFile.findMany({
        where: { projectId: access.projectId },
        orderBy: { createdAt: "desc" },
    });
    const base = publicBaseUrl(req);
    return res.json(files.map((f) => ({
        id: f.id,
        name: f.originalName,
        size: f.size,
        mimeType: f.mimeType,
        createdAt: f.createdAt,
        url: `${base}/uploads/${encodeURIComponent(f.storedName)}`,
    })));
}
async function uploadProjectFile(req, res) {
    const access = await assertProjectAccess(req, res);
    if (!access)
        return;
    const file = req.file;
    if (!file)
        return res.status(400).json({ message: "Bestand ontbreekt" });
    const created = await prisma_1.default.projectFile.create({
        data: {
            projectId: access.projectId,
            originalName: file.originalname,
            storedName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            uploadedById: access.auth.id,
        },
    });
    const base = publicBaseUrl(req);
    return res.status(201).json({
        id: created.id,
        name: created.originalName,
        size: created.size,
        mimeType: created.mimeType,
        createdAt: created.createdAt,
        url: `${base}/uploads/${encodeURIComponent(created.storedName)}`,
    });
}
async function deleteProjectFile(req, res) {
    const access = await assertProjectAccess(req, res);
    if (!access)
        return;
    const fileId = Number(req.params.fileId);
    if (!Number.isFinite(fileId)) {
        return res.status(400).json({ message: "Ongeldig bestand id" });
    }
    const file = await prisma_1.default.projectFile.findUnique({
        where: { id: fileId },
    });
    if (!file || file.projectId !== access.projectId) {
        return res.status(404).json({ message: "Bestand niet gevonden" });
    }
    await prisma_1.default.projectFile.delete({ where: { id: fileId } });
    const uploadPath = node_path_1.default.join(process.cwd(), "uploads", file.storedName);
    try {
        await promises_1.default.unlink(uploadPath);
    }
    catch {
        // Ignore missing file on disk
    }
    return res.status(204).send();
}
