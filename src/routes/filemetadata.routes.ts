import { Router } from "express";
import {
  getFileMetadata,
  getFile,
  createFileMetadata,
  updateFileMetadata,
  deleteFileMetadata,
} from "../controllers/filemetadata.controller";

const router = Router();

router.get("/", getFileMetadata);
router.get("/:id", getFile);
router.post("/", createFileMetadata);
router.put("/:id", updateFileMetadata);
router.patch("/:id", updateFileMetadata);
router.delete("/:id", deleteFileMetadata);

export default router;
