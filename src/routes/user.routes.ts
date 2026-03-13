import { Router } from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

// READ all users
router.get("/", getUsers);
// READ one user by id
router.get("/:id", getUser);
// CREATE a new user
router.post("/", createUser);
// UPDATE a user (full or partial)
router.put("/:id", updateUser);
router.patch("/:id", updateUser);
// DELETE a user
router.delete("/:id", deleteUser);

export default router;
