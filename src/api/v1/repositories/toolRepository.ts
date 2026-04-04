import { db } from "../../../config/firebaseConfig";
import { DocumentReference } from "firebase-admin/firestore";
import * as model from "../models/toolModel"
import { AppError } from "../errors/errors";

export const addTool = async (tool: model.CreateToolDef): Promise<model.ToolDef> => {

    const docRef: DocumentReference = db.collection("tools").doc(tool.name);

    const addition: model.ToolDef = {
        name: tool.name,
        description: tool.description,
        jsonSchema: tool.jsonSchema,
        creator: tool.creator,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await docRef.set(addition);

    console.log("Tool added");
    return addition;
};

export const getToolById = async (name: string): Promise<model.ToolDef> => {
    const docRef: DocumentReference = db.collection("tools").doc(name);

    const item = await docRef.get();

    if (item.exists) {
        console.log("Tool found")
        return item.data() as model.ToolDef;
    }
    else {
        console.log("Tool not found")
        throw new AppError(`Tool with Name ${name} not found`,"TOOL_NOT_FOUND", 404);
    };
};

export const getAllToolsList = async (): Promise<model.ToolDef[]> => {
    try {
        const snapshot = await db.collection("tools").get()
        const itemListing: model.ToolDef[] = snapshot.docs.map(doc => ({ ... (doc.data() as model.ToolDef) }))

        return itemListing;
    }
    catch (error) {
        throw new Error("Failed to fetch")
    };
};

export const updateTool = async (name: string, update: Partial<model.UpdateToolDef>): Promise<model.ToolDef> => {
    const docRef: DocumentReference = db.collection("tools").doc(name);

    try {
        const updates = {
            ...update
        };

        await docRef.update(updates);

        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            throw new Error("Tool not found");
        }

        return {
            ...(snapshot.data() as model.ToolDef),
            name: snapshot.id
        };

    } catch (error) {
        throw new Error("TOOL_NOT_FOUND");
    }

};

export const deleteToolByName = async (name: string): Promise<void> => {
    const docRef: DocumentReference = db.collection("tools").doc(name);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
        console.log("document not found");
        throw new AppError(`tool with id ${name} not found`,"TOOL_NOT_FOUND", 404);
    }

    await docRef.delete();
    console.log("Tool deleted")
};