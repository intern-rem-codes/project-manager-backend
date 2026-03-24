"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("util");
const scryptAsync = (0, util_1.promisify)(crypto_1.default.scrypt);
const SCRYPT_KEYLEN = 64;
async function hashPassword(password) {
    const salt = crypto_1.default.randomBytes(16);
    const derivedKey = (await scryptAsync(password, salt, SCRYPT_KEYLEN));
    return `scrypt$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
}
async function verifyPassword(password, stored) {
    if (!stored)
        return false;
    const parts = stored.split("$");
    if (parts.length !== 3)
        return false;
    const [algo, saltHex, hashHex] = parts;
    if (algo !== "scrypt")
        return false;
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = (await scryptAsync(password, salt, expected.length));
    if (expected.length !== actual.length)
        return false;
    return crypto_1.default.timingSafeEqual(expected, actual);
}
