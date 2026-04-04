import { addTool, getToolById, getAllToolsList, updateTool, deleteToolByName } from "../repositories/toolRepository"
import { CreateToolDef, ToolDef, UpdateToolDef } from "../models/toolModel"

export const createNewTool = async (tool: CreateToolDef): Promise<ToolDef> => {
    let results = await addTool(tool);
    return results;
};

export const getByToolName = async (name: string): Promise<ToolDef> => {
    let results = await getToolById(name);
    return results;
};

export const getAllTools = async (): Promise<ToolDef[]> => {  
    let results = await getAllToolsList();
    return results;
};

export const updateToolByName = async (name: string, update: Partial<UpdateToolDef>): Promise<ToolDef> => {
    let results = await updateTool(name, update);
    return results;
};

export const deleteToolWithName = async (name: string): Promise<void> => {
    await deleteToolByName(name);
    return;
}