"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
exports.verifyToken = verifyToken;
const crypto_1 = __importDefault(require("crypto"));
const TOKEN_SECRET = process.env.TOKEN_SECRET ?? "dev-secret-change-me";
function base64urlEncode(input) {
    const buf = typeof input === "string" ? Buffer.from(input) : input;
    return buf
        .toString("base64")
        .replaceAll("=", "")
        .replaceAll("+", "-")
        .replaceAll("/", "_");
}
function base64urlDecode(input) {
    const padded = input.replaceAll("-", "+").replaceAll("_", "/");
    const padLen = (4 - (padded.length % 4)) % 4;
    const final = padded + "=".repeat(padLen);
    return Buffer.from(final, "base64");
}
function sign(data) {
    return base64urlEncode(crypto_1.default.createHmac("sha256", TOKEN_SECRET).update(data).digest());
}
function createToken(payload, ttlSeconds = 60 * 60 * 24) {
    const full = {
        ...payload,
        exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    };
    const body = base64urlEncode(JSON.stringify(full));
    const sig = sign(body);
    return `${body}.${sig}`;
}
function verifyToken(token) {
    const [body, sig] = token.split(".");
    if (!body || !sig)
        return null;
    if (sign(body) !== sig)
        return null;
    try {
        const parsed = JSON.parse(base64urlDecode(body).toString("utf8"));
        if (!parsed || typeof parsed.userId !== "number")
            return null;
        if (parsed.role !== "USER" && parsed.role !== "ADMIN")
            return null;
        if (typeof parsed.exp !== "number")
            return null;
        if (parsed.exp < Math.floor(Date.now() / 1000))
            return null;
        return parsed;
    }
    catch {
        return null;
    }
}
