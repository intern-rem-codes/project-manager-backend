"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = __importDefault(require("../middleware/upload"));
const filemetadata_controller_1 = require("../controllers/filemetadata.controller");
const router = (0, express_1.Router)();
router.get("/", filemetadata_controller_1.getFileMetadata);
router.get("/:id", filemetadata_controller_1.getFile);
router.post("/", upload_1.default.single("file"), filemetadata_controller_1.createFileMetadata);
router.put("/:id", filemetadata_controller_1.updateFileMetadata);
router.patch("/:id", filemetadata_controller_1.updateFileMetadata);
router.delete("/:id", filemetadata_controller_1.deleteFileMetadata);
exports.default = router;
