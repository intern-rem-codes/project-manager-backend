import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
} from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

// READ all users
router.get("/", getUsers);
// READ one user by id
router.get("/:id", getUser);
// CREATE a new user
router.post("/", createUser);
// UPDATE a user (full or partial)
router.put("/:id", updateUser);
router.patch("/:id", updateUser);
// CHANGE password
router.put("/:id/password", changePassword);
// DELETE a user
router.delete("/:id", deleteUser);

export default router;
