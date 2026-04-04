import Joi from "joi";

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
            jsonSchema: Joi.string().max(1000).required().messages({
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