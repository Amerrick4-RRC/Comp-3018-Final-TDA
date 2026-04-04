import express, { Router } from "express";
import {
    getTools,
    createTool,
    updateToolWithName,
    deleteToolByName,
    getHealth,
    getSelectedTool,
    signIn
} from "../controllers/toolController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";



const router: Router = express.Router();

/**
 * @openapi
 * /tools:
 *   get:
 *     summary: Retrieve all tool definitions
 *     description: Returns a list of all tool definitions stored in the system.
 *     tags:
 *       - Tools
 *     responses:
 *       200:
 *         description: A list of tool definitions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Listing:
 *                   type: string
 *                   example: Tool Definitions
 *                 Count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "tool_12345"
 *                       name:
 *                         type: string
 *                         example: "image_generator"
 *                       description:
 *                         type: string
 *                         example: "Generates images from prompts"
 *                       jsonSchema:
 *                         type: object
 *                         example:
 *                           type: object
 *                           properties:
 *                             prompt:
 *                               type: string
 *                       creatorId:
 *                         type: string
 *                         example: "user_98765"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-15T18:32:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-02-01T12:10:00.000Z"
 *       400:
 *         description: Failed to retrieve tools
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Unable to fetch tool definitions"
 *                     code:
 *                       type: string
 *                       example: "TOOLS_FETCH_FAILED"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get("/tools", authenticate, isAuthorized({ hasRole: ["admin", "creator"] }), getTools);

/**
 * @openapi
 * /tools:
 *   post:
 *     summary: Create a new tool definition
 *     description: Creates a new tool definition using the provided name, description, and JSON schema.
 *     tags:
 *       - Tools
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "image_generator"
 *               description:
 *                 type: string
 *                 example: "Generates images from text prompts"
 *               jsonSchema:
 *                 type: object
 *                 example:
 *                   type: object
 *                   properties:
 *                     prompt:
 *                       type: string
 *             required:
 *               - name
 *               - description
 *               - jsonSchema
 *     responses:
 *       201:
 *         description: Tool successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Listing:
 *                   type: string
 *                   example: Tool Definitions
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "tool_12345"
 *                     name:
 *                       type: string
 *                       example: "image_generator"
 *                     description:
 *                       type: string
 *                       example: "Generates images from text prompts"
 *                     jsonSchema:
 *                       type: object
 *                       example:
 *                         type: object
 *                         properties:
 *                           prompt:
 *                             type: string
 *                     creatorId:
 *                       type: string
 *                       example: "user_98765"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-15T18:32:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-15T18:32:00.000Z"
 *       400:
 *         description: Failed to create tool
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid tool definition payload"
 *                     code:
 *                       type: string
 *                       example: "TOOL_CREATION_FAILED"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.post("/tools", authenticate, isAuthorized({ hasRole: ["admin", "creator"] }), createTool);

/**
 * @openapi
 * /tools/{name}:
 *   get:
 *     summary: Retrieve a specific tool definition by name
 *     description: Returns a single tool definition matching the provided name.
 *     tags:
 *       - Tools
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the tool to retrieve
 *     responses:
 *       200:
 *         description: Tool definition found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ToolDefinition:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     jsonSchema:
 *                       type: string
 *                     creator:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Tool not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     code:
 *                       type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get("/tools/:name", authenticate, isAuthorized({ hasRole: ["admin", "creator"] }), getSelectedTool);

/**
 * @openapi
 * /tools/{name}:
 *   put:
 *     summary: Update an existing tool definition
 *     description: Updates fields of a tool definition. Only the creator of the tool may update it.
 *     tags:
 *       - Tools
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the tool to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update
 *             properties:
 *               description:
 *                 type: string
 *               jsonSchema:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tool updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 update:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     jsonSchema:
 *                       type: string
 *                     creator:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: User is not the creator of the tool
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Tool not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put("/tools/:name", authenticate, isAuthorized({ hasRole: ["creator"] }), updateToolWithName);

/**
 * @openapi
 * /tools/{name}:
 *   delete:
 *     summary: Delete an existing tool definition
 *     description: Deletes a tool definition. Only the creator of the tool may delete it.
 *     tags:
 *       - Tools
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the tool to delete
 *     responses:
 *       200:
 *         description: Tool deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     creator:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: User is not the creator of the tool
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Tool not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete("/tools/:name", authenticate, isAuthorized({ hasRole: ["creator"], allowSameUser: true }), deleteToolByName);

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns uptime, timestamp, version, and service status.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Health status information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 uptime:
 *                   type: number
 *                 timestamp:
 *                   type: string
 *                 version:
 *                   type: string
 */
router.get("/health", getHealth);

/**
 * @openapi
 * /auth/signin:
 *   post:
 *     summary: Sign in a user using Firebase Authentication
 *     description: Authenticates a user with email and password and returns Firebase tokens.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idToken:
 *                   type: string
 *                 email:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 expiresIn:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/auth/signin", signIn)
export default router;