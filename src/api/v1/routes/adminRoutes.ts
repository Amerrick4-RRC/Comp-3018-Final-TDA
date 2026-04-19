import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { setCustomClaims, updateToolWithName, deleteToolByName } from "../controllers/adminController";
import cors from "cors";
import { authenticatedCorsOptions} from "../../../config/corsConfig";

const router: Router = express.Router();

router.use("/tools", cors(authenticatedCorsOptions));

/**
 * @openapi
 * components:
 *   schemas:
 *     SetCustomClaimsRequest:
 *       type: object
 *       required:
 *         - uid
 *         - claims
 *       properties:
 *         uid:
 *           type: string
 *           description: Firebase Auth user ID
 *         claims:
 *           type: object
 *           description: Custom claims to assign to the user
 *           example:
 *             admin: true
 *
 *     UpdateToolRequest:
 *       type: object
 *       required:
 *         - description
 *         - jsonSchema
 *       properties:
 *         description:
 *           type: string
 *           description: Updated tool description
 *         jsonSchema:
 *           type: string
 *           description: Updated JSON schema for the tool
 *
 *     AdminAuthHeader:
 *       type: string
 *       description: Bearer token for authentication
 *       example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
router.post("/setCustomClaims", authenticate, isAuthorized({ hasRole: ["admin"] }), setCustomClaims);

/**
 * @openapi
 * /admin/tools/{name}:
 *   put:
 *     summary: Update a tool by name
 *     description: Requires admin role. Updates tool metadata and schema.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/UpdateToolRequest'
 *     responses:
 *       200:
 *         description: Tool updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin role required
 *       404:
 *         description: Tool not found
 */
router.put("/tools/:name", authenticate, isAuthorized({ hasRole: ["admin"] }), updateToolWithName);

/**
 * @openapi
 * /admin/tools/{name}:
 *   delete:
 *     summary: Delete a tool by name
 *     description: Requires admin role. Permanently deletes a tool.
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin role required
 *       404:
 *         description: Tool not found
 */
router.delete("/tools/:name", authenticate, isAuthorized({ hasRole: ["admin"] }), deleteToolByName);
export default router;