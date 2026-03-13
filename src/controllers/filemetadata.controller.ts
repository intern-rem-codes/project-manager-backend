import { Request, Response } from "express";
import prisma from "../prisma";

export const getFileMetadata = async (req: Request, res: Response) => {
  const files = await prisma.fileMetadata.findMany();
  return res.json(files);
};

export const getFile = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const file = await prisma.fileMetadata.findUnique({ where: { id } });
  if (!file) return res.status(404).json({ message: "File not found" });
  return res.json(file);
};

export const createFileMetadata = async (req: Request, res: Response) => {
  const data = req.body;
  const file = await prisma.fileMetadata.create({ data });
  return res.status(201).json(file);
};

export const updateFileMetadata = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;
  try {
    const updated = await prisma.fileMetadata.update({ where: { id }, data });
    return res.json(updated);
  } catch (e) {
    return res.status(404).json({ message: "File not found" });
  }
};

export const deleteFileMetadata = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.fileMetadata.delete({ where: { id } });
    return res.status(204).send();
  } catch (e) {
    return res.status(404).json({ message: "File not found" });
  }
};
