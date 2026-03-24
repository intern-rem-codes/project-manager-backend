import { Router } from "express";
import {
  deleteUserAdmin,
  listUsers,
  resetPasswordAdmin,
  updateUserAdmin,
} from "../controllers/admin.controller";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/users", listUsers);
router.patch("/users/:id", updateUserAdmin);
router.post("/users/:id/reset-password", resetPasswordAdmin);
router.delete("/users/:id", deleteUserAdmin);

export default router;

