import { Request, Response } from "express";
import prisma from "../prisma";
import { CreateProjectDTO, Project } from "../interfaces/project";

export const getProjects = async (req: Request, res: Response) => {
  const projects = await prisma.project.findMany();
  return res.json(projects);
};

export const getProject = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return res.status(404).json({ message: "Project not found" });
  return res.json(project);
};

export const createProject = async (req: Request, res: Response) => {
  const { name, description, deadline, status } = req.body;

  const project = await prisma.project.create({
    data: {
      name,
      description,
      status,
      deadline,
      client: { connect: { id: 1 } },
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  return res.status(201).json(project);
};

export const updateProject = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;
  try {
    const updated = await prisma.project.update({ where: { id }, data });
    return res.json(updated);
  } catch (e) {
    return res.status(404).json({ message: "Project not found" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.project.delete({ where: { id } });
    return res.status(204).send();
  } catch (e) {
    return res.status(404).json({ message: "Project not found" });
  }
};
