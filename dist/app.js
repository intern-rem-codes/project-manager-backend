"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const client_routes_1 = __importDefault(require("./routes/client.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const filemetadata_routes_1 = __importDefault(require("./routes/filemetadata.routes"));
const user_controller_1 = require("./controllers/user.controller");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
}));
app.use(express_1.default.json());
app.use("/users", user_routes_1.default);
app.use("/clients", client_routes_1.default);
app.use("/projects", project_routes_1.default);
app.use("/filemetadata", filemetadata_routes_1.default);
app.use("/uploads", express_1.default.static("uploads"));
// CREATE = POST
// READ = GET
// UPDATE = PUT/PATCH
// DELETE = DELETE
app.get("/", (req, res) => {
    res.json({ message: "API working" });
});
// Backward compatible alias
app.post("/create", user_controller_1.createUser);
///////////////
// ERROR HANDLING //
///////////////
app.use((err, req, res, _next) => {
    console.error(err instanceof Error ? err.stack : err);
    return res.status(500).json({ message: "Internal Server Error" });
});
exports.default = app;
