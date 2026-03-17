"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/prisma.ts
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const client_1 = require("@prisma/client");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
}
const adapter = new adapter_better_sqlite3_1.PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new client_1.PrismaClient({ adapter });
exports.default = prisma;
