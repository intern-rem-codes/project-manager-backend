import crypto from "crypto";

type Payload = {
  userId: number;
  role: "USER" | "ADMIN";
  exp: number; // unix seconds
};

const TOKEN_SECRET = process.env.TOKEN_SECRET ?? "dev-secret-change-me";

function base64urlEncode(input: Buffer | string) {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf
    .toString("base64")
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");
}

function base64urlDecode(input: string) {
  const padded = input.replaceAll("-", "+").replaceAll("_", "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const final = padded + "=".repeat(padLen);
  return Buffer.from(final, "base64");
}

function sign(data: string) {
  return base64urlEncode(crypto.createHmac("sha256", TOKEN_SECRET).update(data).digest());
}

export function createToken(payload: Omit<Payload, "exp">, ttlSeconds = 60 * 60 * 24) {
  const full: Payload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const body = base64urlEncode(JSON.stringify(full));
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function verifyToken(token: string): Payload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  if (sign(body) !== sig) return null;
  try {
    const parsed = JSON.parse(base64urlDecode(body).toString("utf8")) as Payload;
    if (!parsed || typeof parsed.userId !== "number") return null;
    if (parsed.role !== "USER" && parsed.role !== "ADMIN") return null;
    if (typeof parsed.exp !== "number") return null;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

