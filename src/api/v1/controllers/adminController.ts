// External library imports
import { Request, Response, NextFunction } from "express";

// Internal module imports
import { auth } from "../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpConstants";

import { deleteToolWithName, updateToolByName } from "../services/toolsServices";
import { UpdateToolDef } from "../models/toolModel";


/**
 * Handles setting custom claims (roles) for a user.
 * This allows administrators to assign or modify user roles.
 *
 * Note: After setting custom claims, the user must obtain a new
 * token for the changes to take effect.
 *
 * @param {Request} req - The request object containing uid and claims.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const setCustomClaims = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { uid, claims } = req.body;

    try {
        // Set custom claims on the user's Firebase account
        await auth.setCustomUserClaims(uid, claims);

        res.status(HTTP_STATUS.OK).json({message: "Custom claims set successfully"});
    } catch (error) {
        next(error);
    }
};

export const updateToolWithName = async (req: Request, res: Response): Promise<void> => {
    const name = req.params.name as string;
   
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