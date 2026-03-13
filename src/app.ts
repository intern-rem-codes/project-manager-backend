import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userRoutes from "./routes/user.routes";
import {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
} from "./controllers/user.controller";
import projectRoutes from "./routes/project.routes";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "./controllers/project.controller";
import filemetadateRoutes from "./routes/filemetadata.routes";
import {
  getFileMetadata,
  getFile,
  createFileMetadata,
  updateFileMetadata,
  deleteFileMetadata,
} from "./controllers/filemetadata.controller";
const app = express();

import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use("/users", userRoutes);

app.use(express.json());

// CREATE = POST
// READ = GET
// UPDATE = PUT/PATCH
// DELETE = DELETE

app.get("/", (req, res) => {
  res.json({ message: "API working" });
});

///////////
// USERS //
///////////

app.get("/users", (req, res) => {
  getUsers(req, res);
});

app.post("/create", (req, res) => {
  res.json({ message: "Create user" });
  return createUser(req, res);
});
app.put("/users/:id", (req, res) => {
  res.json({ message: "Update user" });
  return updateUser(req, res);
});

app.patch("/users/:id", (req, res) => {
  res.json({ message: "Update user" });
  return updateUser(req, res);
});

app.delete("/users/:id", (req, res) => {
  res.json({ message: "Delete user" });
  return deleteUser(req, res);
});

//////////////
// PROJECTS //
//////////////

app.get("/projects", (req, res) => {
  return getProjects(req, res);
});
app.get("/projects/:id", (req, res) => {
  return getProject(req, res);
});
app.post("/projects", (req, res) => {
  res.json({ message: "Create project" });
  return createProject(req, res);
});

app.put("/projects/:id", (req, res) => {
  res.json({ message: "Update project" });
  return updateProject(req, res);
});

app.delete("/projects/:id", (req, res) => {
  res.json({ message: "Delete project" });
  return deleteProject(req, res);
});

//////////////
// FILE METADATA //
//////////////

app.get("/filemetadata", (req, res) => {
  res.json({ message: "Get file metadata" });
  return getFileMetadata(req, res);
});

app.get("/filemetadata/:id", (req, res) => {
  res.json({ message: "Get file metadata by id" });
  return getFile(req, res);
});
app.post("/filemetadata", (req, res) => {
  res.json({ message: "Create file metadata" });
  return createFileMetadata(req, res);
});
app.put("/filemetadata/:id", (req, res) => {
  res.json({ message: "Update file metadata" });
  return updateFileMetadata(req, res);
});
app.patch("/filemetadata/:id", (req, res) => {
  res.json({ message: "Update file metadata" });
  return updateFileMetadata(req, res);
});
app.delete("/filemetadata/:id", (req, res) => {
  res.json({ message: "Delete file metadata" });
  return deleteFileMetadata(req, res);
});

///////////////
// ERROR HANDLING //
///////////////

app.use((err: any, req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
