import type { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { verifyToken } from "../utils/token";

export type AuthUser = {
  id: number;
  role: "USER" | "ADMIN";
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = typeof header === "string" && header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : null;

  if (!token) return res.status(401).json({ message: "Niet ingelogd" });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ message: "Niet ingelogd" });

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true, isActive: true },
  });
  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Account is gedeactiveerd" });
  }

  req.auth = { id: user.id, role: user.role };
  return next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ message: "Niet ingelogd" });
  if (req.auth.role !== "ADMIN") {
    return res.status(403).json({ message: "Geen toegang" });
  }
  return next();
}

