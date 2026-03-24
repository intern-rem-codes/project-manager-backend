"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function ensureUploadsDir() {
    const dir = node_path_1.default.join(process.cwd(), "uploads");
    if (!node_fs_1.default.existsSync(dir))
        node_fs_1.default.mkdirSync(dir, { recursive: true });
    return dir;
}
function sanitizeBaseName(name) {
    const base = node_path_1.default.basename(name);
    return base.replace(/[^\w.\-() ]+/g, "_").slice(0, 120) || "file";
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ensureUploadsDir());
    },
    filename: (req, file, cb) => {
        const ext = node_path_1.default.extname(file.originalname);
        const base = sanitizeBaseName(file.originalname).replace(ext, "");
        const nonce = crypto_1.default.randomBytes(8).toString("hex");
        cb(null, `${Date.now()}-${nonce}-${base}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});
exports.default = upload;
