import { Router } from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import upload from "../middleware/upload";
import {
  deleteProjectFile,
  listProjectFiles,
  uploadProjectFile,
} from "../controllers/projectFiles.controller";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", createProject);
router.put("/:id", updateProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

router.get("/:id/files", listProjectFiles);
router.post("/:id/files", upload.single("file"), uploadProjectFile);
router.delete("/:id/files/:fileId", deleteProjectFile);

export default router;
