import { Request, Response } from "express";
import { HealthCheckResponse } from "../models/healthCheck";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { createNewTool, getByToolName, getAllTools, deleteToolWithName, updateToolByName, } from "../services/toolsServices"
import { CreateToolDef, UpdateToolDef } from "../models/toolModel"


export const getTools = async (req: Request, res: Response) => {
    try {
        const items = await getAllTools();
        res.status(HTTP_STATUS.OK).json({ Listing: "Loan Applications", Count: items.length, data: items });
    }
    catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                message: `Could not find loan with id ${req.params.id}`,
                code: "LOAN_NOT_FOUND"
            },
            timestamp: new Date().toISOString()
        });
    }
};

export const getSelectedTool = async (req: Request, res: Response) => {
    try {
        let name = req.params.name as string;
        let result = await getByToolName(name);

        res.status(HTTP_STATUS.OK).json({ ToolDefinition: result });
    }
    catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                message: `Could not find tool with name ${req.params.name}`,
                code: "TOOL_NOT_FOUND"
            },
            timestamp: new Date().toISOString()
        });
    }
};

export const createTool = async (req: Request, res: Response) => {

    try {
        const newTool: CreateToolDef = {
            name: req.body.name,
            description: req.body.description,
            jsonSchema: req.body.jsonSchema,
            creator: res.locals.uid as string
        }
        let result = await createNewTool(newTool);

        res.status(HTTP_STATUS.CREATED).json({ Listing: "Tool Definitions", data: result });
    }
    catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                message: `Could not create tool`,
                code: "TOOL_NOT_CREATED"
            },
            timestamp: new Date().toISOString()
        });
    }
};

export const updateToolWithName = async (req: Request, res: Response): Promise<void> => {
    const name = req.params.name as string;
    const uid = res.locals.uid as string;
    let tool = await getByToolName(name);
    
    if (tool.creator !== uid) {
        res.status(HTTP_STATUS.FORBIDDEN).json({message: "You are not the tools creator and cannot edit"});
        return;
    }

    try {
        const change: Partial<UpdateToolDef> = req.body;

        let result = await updateToolByName(name, change)
        res.status(HTTP_STATUS.OK).json({ update: result })
    }
    catch (error) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: `Could not find ${name}` })
    }
};

export const deleteToolByName = async (req: Request, res: Response): Promise<void> => {
    const name = req.params.name as string;
    const uid = res.locals.uid as string;
    let tool = await getByToolName(name);
    
    if (tool.creator !== uid) {
        res.status(HTTP_STATUS.FORBIDDEN).json({message: "You are not the tools creator and cannot edit"});
        return;
    }

    try {
        await deleteToolWithName(name)
        res.status(HTTP_STATUS.OK).json({ message: `Successful deletion of ${name}` })
    }
    catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                message: `Could not find loan with id ${req.params.id}`,
                code: "LOAN_NOT_FOUND"
            },
            timestamp: new Date().toISOString()
        });
    }
};

export const getHealth = (req: Request, res: Response): void => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    };
    res.status(HTTP_STATUS.OK).json(healthData)
};

export const signIn = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    const apiKey = process.env.FIREBASE_WEB_API_KEY;

    try {
        const firebaseRes = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true
                })
            }
        );

        const data = await firebaseRes.json();

        // Return error if crud operation fails
        if (!firebaseRes.ok) {
            return res.status(400).json({ error: data.error?.message });
        }

        // Return required data points
        return res.json({
            idToken: data.idToken,
            email: data.email,
            userId: data.localId,
            expiresIn: data.expiresIn,
            refreshToken: data.refreshToken
        });

    } catch (err) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: {
                message: `Could not retrieve sign in data`,
                code: "SIGN_IN_FAILED"
            },
            timestamp: new Date().toISOString()
        });
    }
};
