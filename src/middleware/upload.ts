import multer from "multer";
import crypto from "crypto";
import fs from "node:fs";
import path from "node:path";

function ensureUploadsDir() {
  const dir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function sanitizeBaseName(name: string) {
  const base = path.basename(name);
  return base.replace(/[^\w.\-() ]+/g, "_").slice(0, 120) || "file";
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ensureUploadsDir());
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = sanitizeBaseName(file.originalname).replace(ext, "");
    const nonce = crypto.randomBytes(8).toString("hex");
    cb(null, `${Date.now()}-${nonce}-${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

export default upload;
