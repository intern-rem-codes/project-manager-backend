import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import clientRoutes from "./routes/client.routes";
import projectRoutes from "./routes/project.routes";
import { createUser } from "./controllers/user.controller";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use("/users", userRoutes);
app.use("/clients", clientRoutes);
app.use("/projects", projectRoutes);
app.use("/uploads", express.static("uploads"));

// CREATE = POST
// READ = GET
// UPDATE = PUT/PATCH
// DELETE = DELETE

app.get("/", (req, res) => {
  res.json({ message: "API working" });
});

// Backward compatible alias
app.post("/create", createUser);

///////////////
// ERROR HANDLING //
///////////////

app.use(
  (
    err: unknown,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err instanceof Error ? err.stack : err);
    return res.status(500).json({ message: "Internal Server Error" });
  },
);

export default app;
