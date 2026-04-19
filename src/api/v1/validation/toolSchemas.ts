import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     ToolCreateRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - jsonSchema
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 50
 *           description: Name of the tool
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 200
 *           description: Description of the tool
 *         jsonSchema:
 *           type: string
 *           maxLength: 5000
 *           description: JSON schema definition for the tool
 *
 *     ToolUpdateRequest:
 *       type: object
 *       required:
 *         - description
 *         - jsonSchema
 *       properties:
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 200
 *           description: Updated description of the tool
 *         jsonSchema:
 *           type: string
 *           maxLength: 1000
 *           description: Updated JSON schema definition
 *
 *     ToolIdParam:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the tool
 */

/**
 * @openapi
 * /posts:
 *   post:
 *     summary: Create a new tool
 *     tags:
 *       - Tools
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToolCreateRequest'
 *     responses:
 *       201:
 *         description: Tool created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /posts/{id}:
 *   put:
 *     summary: Update an existing tool
 *     tags:
 *       - Tools
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ToolIdParam/properties/id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToolUpdateRequest'
 *     responses:
 *       200:
 *         description: Tool updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tool not found
 */

/**
 * @openapi
 * /posts/{id}:
 *   get:
 *     summary: Get a tool by ID
 *     tags:
 *       - Tools
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ToolIdParam/properties/id'
 *     responses:
 *       200:
 *         description: Tool retrieved successfully
 *       404:
 *         description: Tool not found
 */

/**
 * @openapi
 * /posts/{id}:
 *   delete:
 *     summary: Delete a tool by ID
 *     tags:
 *       - Tools
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ToolIdParam/properties/id'
 *     responses:
 *       200:
 *         description: Tool deleted successfully
 *       404:
 *         description: Tool not found
 */

export const eventSchemas = {
    // POST /posts - Create new item
    create: {
        body: Joi.object({
            name: Joi.string().min(3).max(50).required().messages({
                "any.required": "Tool Name is required",
                "string.empty": "Tool Name cannot be empty",
            }),
            description: Joi.string().min(10).max(200).required().messages({
                "any.required": "Tool Description is required",
                "string.empty": "Tool Description cannot be empty",
            }),
            jsonSchema: Joi.string().max(5000).required().messages({
                "any.required": "Tool JSON Schema is required",
                "string.empty": "Tool JSON Schema cannot be empty",
            })
        }),
    },
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
            })
        }),
        body: Joi.object({
            description: Joi.string().min(10).max(200).required().messages({
                "any.required": "Tool Description is required",
                "string.empty": "Tool Description cannot be empty",
            }),
            jsonSchema: Joi.string().max(1000).required().messages({
                "any.required": "Tool JSON Schema is required",
                "string.empty": "Tool JSON Schema cannot be empty",
            })
        }).min(1)
    },
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
            })
        })
    },
    deleteById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
            })
        })
    }
};