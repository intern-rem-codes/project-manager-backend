import { Request, Response } from "express";
import prisma from "../prisma";
import { CreateProjectDTO, Project } from "../interfaces/project";

export const getProjects = async (req: Request, res: Response) => {
  const auth = req.auth;
  if (!auth) return res.status(401).json({ message: "Niet ingelogd" });
  const where = auth.role === "USER" ? { ownerId: auth.id } : undefined;
  const projects = await prisma.project.findMany({ where });
  return res.json(projects);
};

export const getProject = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const auth = req.auth;
  if (!auth) return res.status(401).json({ message: "Niet ingelogd" });
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (auth.role === "USER" && project.ownerId !== auth.id) {
    return res.status(403).json({ message: "Geen toegang" });
  }
  return res.json(project);
};

export const createProject = async (req: Request, res: Response) => {
  const auth = req.auth;
  if (!auth) return res.status(401).json({ message: "Niet ingelogd" });
  const { name, description, deadline, status, clientId } = req.body as {
    name?: unknown;
    description?: unknown;
    deadline?: unknown;
    status?: unknown;
    clientId?: unknown;
  };

  if (typeof name !== "string" || !name.trim())
    return res.status(400).json({ message: "Naam is verplicht" });
  if (typeof description !== "string" || !description.trim())
    return res.status(400).json({ message: "Beschrijving is verplicht" });
  if (typeof deadline !== "string" || !deadline.trim())
    return res.status(400).json({ message: "Deadline is verplicht" });
  if (typeof status !== "string" || !status.trim())
    return res.status(400).json({ message: "Status is verplicht" });

  let connectClientId: number | null = null;
  if (auth.role === "ADMIN") {
    if (typeof clientId !== "string" && typeof clientId !== "number") {
      return res.status(400).json({ message: "Klant is verplicht" });
    }
    connectClientId = Number(clientId);
    if (!Number.isFinite(connectClientId)) {
      return res.status(400).json({ message: "Ongeldige klant" });
    }
  } else {
    const me = await prisma.user.findUnique({
      where: { id: auth.id },
      select: { personalClientId: true },
    });
    if (!me?.personalClientId) {
      return res.status(400).json({ message: "Geen persoonlijke klant gevonden" });
    }
    connectClientId = me.personalClientId;
  }

  const project = await prisma.project.create({
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

export const updateProject = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const data = req.body;
  try {
    const auth = req.auth;
    if (!auth) return res.status(401).json({ message: "Niet ingelogd" });
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Project not found" });
    if (auth.role === "USER" && existing.ownerId !== auth.id) {
      return res.status(403).json({ message: "Geen toegang" });
    }

    const updated = await prisma.project.update({ where: { id }, data });
    return res.json(updated);
  } catch (e) {
    return res.status(404).json({ message: "Project not found" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const auth = req.auth;
    if (!auth) return res.status(401).json({ message: "Niet ingelogd" });
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Project not found" });
    if (auth.role === "USER" && existing.ownerId !== auth.id) {
      return res.status(403).json({ message: "Geen toegang" });
    }
    await prisma.project.delete({ where: { id } });
    return res.status(204).send();
  } catch (e) {
    return res.status(404).json({ message: "Project not found" });
  }
};
