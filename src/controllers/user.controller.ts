import { Request, Response } from "express";
import prisma from "../prisma";

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  return res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { name, email },
    });
    return res.json(updated);
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return res.json(user);
};
