"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
// READ all users
router.get("/", user_controller_1.getUsers);
// READ one user by id
router.get("/:id", user_controller_1.getUser);
// CREATE a new user
router.post("/", user_controller_1.createUser);
// UPDATE a user (full or partial)
router.put("/:id", user_controller_1.updateUser);
router.patch("/:id", user_controller_1.updateUser);
// CHANGE password
router.put("/:id/password", user_controller_1.changePassword);
// DELETE a user
router.delete("/:id", user_controller_1.deleteUser);
exports.default = router;
