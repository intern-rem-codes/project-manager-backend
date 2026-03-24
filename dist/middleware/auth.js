"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const prisma_1 = __importDefault(require("../prisma"));
const token_1 = require("../utils/token");
async function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    const token = typeof header === "string" && header.startsWith("Bearer ")
        ? header.slice("Bearer ".length)
        : null;
    if (!token)
        return res.status(401).json({ message: "Niet ingelogd" });
    const payload = (0, token_1.verifyToken)(token);
    if (!payload)
        return res.status(401).json({ message: "Niet ingelogd" });
    const user = await prisma_1.default.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) {
        return res.status(401).json({ message: "Account is gedeactiveerd" });
    }
    req.auth = { id: user.id, role: user.role };
    return next();
}
function requireAdmin(req, res, next) {
    if (!req.auth)
        return res.status(401).json({ message: "Niet ingelogd" });
    if (req.auth.role !== "ADMIN") {
        return res.status(403).json({ message: "Geen toegang" });
    }
    return next();
}
