import { Request, Response } from "express";
import prisma from "../prisma";

export const getFileMetadata = async (req: Request, res: Response) => {
  const files = await prisma.fileMetadata.findMany();
  return res.json(files);
};

export const getFile = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const file = await prisma.fileMetadata.findUnique({
    where: { id },
  });

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  return res.json(file);
};

export const createFileMetadata = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const newFile = await prisma.fileMetadata.create({
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
  } catch (error) {
    return res.status(500).json({ message: JSON.stringify(error) });
  }
};

export const updateFileMetadata = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const updated = await prisma.fileMetadata.update({
      where: { id },
      data: req.body,
    });

    return res.json(updated);
  } catch {
    return res.status(404).json({ message: "File not found" });
  }
};

export const deleteFileMetadata = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.fileMetadata.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch {
    return res.status(404).json({ message: "File not found" });
  }
};
