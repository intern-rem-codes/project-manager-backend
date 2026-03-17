"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileMetadata = exports.updateFileMetadata = exports.createFileMetadata = exports.getFile = exports.getFileMetadata = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const getFileMetadata = async (req, res) => {
    const files = await prisma_1.default.fileMetadata.findMany();
    return res.json(files);
};
exports.getFileMetadata = getFileMetadata;
const getFile = async (req, res) => {
    const id = Number(req.params.id);
    const file = await prisma_1.default.fileMetadata.findUnique({
        where: { id },
    });
    if (!file) {
        return res.status(404).json({ message: "File not found" });
    }
    return res.json(file);
};
exports.getFile = getFile;
const createFileMetadata = async (req, res) => {
    try {
        console.log(req.body);
        const newFile = await prisma_1.default.fileMetadata.create({
            data: {
                project_id: req.body.project_id,
                file_name: req.body.file.file_name,
                file_path: req.body.file.file_path,
                file_type: req.body.file.file_type,
                file_size: req.body.file.file_size,
                base64: req.body.base64,
                uploaded_by: req.body.user,
                download_url: `/uploads/${req.body.file.file_name}`,
            },
        });
        return res.status(201).json(newFile);
    }
    catch (error) {
        return res.status(500).json({ message: JSON.stringify(error) });
    }
};
exports.createFileMetadata = createFileMetadata;
const updateFileMetadata = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const updated = await prisma_1.default.fileMetadata.update({
            where: { id },
            data: req.body,
        });
        return res.json(updated);
    }
    catch {
        return res.status(404).json({ message: "File not found" });
    }
};
exports.updateFileMetadata = updateFileMetadata;
const deleteFileMetadata = async (req, res) => {
    const id = Number(req.params.id);
    try {
        await prisma_1.default.fileMetadata.delete({
            where: { id },
        });
        return res.status(204).send();
    }
    catch {
        return res.status(404).json({ message: "File not found" });
    }
};
exports.deleteFileMetadata = deleteFileMetadata;
