import { addTool, getToolById, getAllToolsList, updateTool, deleteToolByName } from "../repositories/toolRepository"
import { CreateToolDef, ToolDef, UpdateToolDef } from "../models/toolModel"

// Creates a new tool definition in the database
export const createNewTool = async (tool: CreateToolDef): Promise<ToolDef> => {
    let results = await addTool(tool);
    return results;
};

// Retrieves a tool definition by its name
export const getByToolName = async (name: string): Promise<ToolDef> => {
    let results = await getToolById(name);
    return results;
};

// Retrieves a list of all tool definitions in the database
export const getAllTools = async (): Promise<ToolDef[]> => {  
    let results = await getAllToolsList();
    return results;
};

// Updates an existing tool definition by its name
export const updateToolByName = async (name: string, update: Partial<UpdateToolDef>): Promise<ToolDef> => {
    let results = await updateTool(name, update);
    return results;
};

// Deletes a tool definition by its name
export const deleteToolWithName = async (name: string): Promise<void> => {
    await deleteToolByName(name);
    return;
}