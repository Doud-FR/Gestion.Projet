"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const client_1 = require("@prisma/client");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const client_routes_1 = __importDefault(require("./routes/client.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const note_routes_1 = __importDefault(require("./routes/note.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes API
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/clients', client_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/tasks', task_routes_1.default);
app.use('/api/notes', note_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
    // Servir les fichiers statiques depuis le dossier client/dist
    const clientPath = path_1.default.join(__dirname, '../client/dist');
    app.use(express_1.default.static(clientPath));
    // Toutes les routes non-API renvoient vers index.html
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(clientPath, 'index.html'));
    });
}
// Error handler
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(PORT, HOST, () => {
    logger_1.logger.info(`Server running on http://${HOST}:${PORT}`);
    logger_1.logger.info(`Environment: ${process.env.NODE_ENV}`);
    if (process.env.NODE_ENV === 'production') {
        logger_1.logger.info(`Serving static files from: ${path_1.default.join(__dirname, '../client/dist')}`);
    }
});
// Graceful shutdown
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
