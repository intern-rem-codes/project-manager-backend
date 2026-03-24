import { Request, Response } from "express";
import crypto from "crypto";
import prisma from "../prisma";
import { hashPassword } from "../utils/password";

export const listUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
    },
  });
  return res.json(users);
};

export const updateUserAdmin = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { role, isActive } = req.body as {
    role?: unknown;
    isActive?: unknown;
  };

  if (req.auth?.id === id) {
    if (role === "USER") {
      return res.status(400).json({ message: "Je kunt je eigen rol niet verlagen" });
    }
    if (isActive === false) {
      return res
        .status(400)
        .json({ message: "Je kunt je eigen account niet deactiveren" });
    }
  }

  const data: { role?: "USER" | "ADMIN"; isActive?: boolean } = {};
  if (role === "USER" || role === "ADMIN") data.role = role;
  if (typeof isActive === "boolean") data.isActive = isActive;

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Geen wijzigingen" });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
    return res.json(user);
  } catch {
    return res.status(404).json({ message: "Gebruiker niet gevonden" });
  }
};

export const resetPasswordAdmin = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (req.auth?.id === id) {
    return res.status(400).json({
      message: "Gebruik accountpagina om je eigen wachtwoord te wijzigen",
    });
  }
  const tempPassword = crypto.randomBytes(6).toString("base64url");
  const passwordHash = await hashPassword(tempPassword);

  try {
    await prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: { id: true },
    });
    return res.json({ message: "Wachtwoord gereset", tempPassword });
  } catch {
    return res.status(404).json({ message: "Gebruiker niet gevonden" });
  }
};

export const deleteUserAdmin = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (req.auth?.id === id) {
    return res.status(400).json({ message: "Je kunt jezelf niet verwijderen" });
  }
  try {
    await prisma.user.delete({ where: { id } });
    return res.status(204).send();
  } catch {
    return res.status(404).json({ message: "Gebruiker niet gevonden" });
  }
};
