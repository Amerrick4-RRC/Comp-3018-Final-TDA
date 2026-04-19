import express from "express";
import dotenv from "dotenv";
dotenv.config();
import setupSwagger from "./config/swagger";
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import projectRoutes from "./api/v1/routes/toolsRoutes";
import adminRoutes from "./api/v1/routes/adminRoutes";
import morgan from "morgan";
import { apiHelmetConfig } from "./config/helmetConfig";

// Initialize Express app
const app = express();

app.use(apiHelmetConfig); 

// Logging middleware (should be applied early in the middleware stack)
app.use(morgan("dev")); // or "combined" in production

// Conditional logging based on environment
if (process.env.NODE_ENV === "production") {
    // In production, log to files
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    // In development, log to console for immediate feedback
    app.use(consoleLogger);
}

// Body parsing middleware
app.use(express.json());

// API Routes
app.use("/api/v1", projectRoutes);
app.use("/api/admin", adminRoutes)

// Global error handling middleware (MUST be applied last)
app.use(errorHandler);

// Setup Swagger documentation
setupSwagger(app);

// Start the server
export default app;