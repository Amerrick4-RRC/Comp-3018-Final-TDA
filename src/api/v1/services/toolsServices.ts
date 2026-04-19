import { addTool, getToolById, getAllToolsList, updateTool, deleteToolByName } from "../repositories/toolRepository"
import { CreateToolDef, ToolDef, UpdateToolDef } from "../models/toolModel"

// In-memory cache for tool definitions
const toolMap = new Map()

// Cache expiration time set to one hour (in milliseconds)
const CACHE_TIMER = 60 * 60 * 1000; // Cache expiration time set to one hour (in milliseconds)

// Function to set a tool definition in the cache with an expiration timer
const setCache = (Key: string, value: ToolDef, timer: number) => {
    toolMap.set(Key, {value, expires: Date.now() + timer});
};

// Function to retrieve a tool definition from the cache, checking for expiration
const getCache = (Key: string): ToolDef | null => {
    const value = toolMap.get(Key);
    if (!value) return null;
    if (Date.now() > value.expires) {
        toolMap.delete(Key);
        return null;
    }
    return value.value;
};

// Cache for all tools list with expiration
let ALL_TOOLS_CACHE: {
value: ToolDef[],
expires: number 
} | null = null;

const setAllToolsCache = (value: ToolDef[], timer: number) => {
    ALL_TOOLS_CACHE = { value, expires: Date.now() + CACHE_TIMER };
}

const getAllToolsCache = (): ToolDef[] | null => {
    if (!ALL_TOOLS_CACHE) return null;
    if (Date.now() > ALL_TOOLS_CACHE.expires) {
        ALL_TOOLS_CACHE = null;
        return null;
    }
    return ALL_TOOLS_CACHE.value;
};


// Creates a new tool definition in the database
export const createNewTool = async (tool: CreateToolDef): Promise<ToolDef> => {
    let results = await addTool(tool);
    setCache(results.name, results, CACHE_TIMER);
    return results;
};

// Retrieves a tool definition by its name
export const getByToolName = async (name: string): Promise<ToolDef> => {
    const cachedTool = getCache(name);
    if (cachedTool) {
        console.log(`Cache hit for tool: ${name}`);
        return cachedTool;
    };
    let results = await getToolById(name);
    setCache(results.name, results, CACHE_TIMER);
    return results;
};

// Retrieves a list of all tool definitions in the database
export const getAllTools = async (): Promise<ToolDef[]> => { 
    const cachedTools = getAllToolsCache();
    if (cachedTools) {
        console.log("Cache hit for all tools");
        return cachedTools;
    };
    let results = await getAllToolsList();
    results.forEach((tool) => setCache(tool.name, tool, CACHE_TIMER));
    setAllToolsCache(results, CACHE_TIMER);
    return results;
};

// Updates an existing tool definition by its name
export const updateToolByName = async (name: string, update: Partial<UpdateToolDef>): Promise<ToolDef> => {
    let results = await updateTool(name, update);
    setCache(results.name, results, CACHE_TIMER);
    if (ALL_TOOLS_CACHE) {
        ALL_TOOLS_CACHE.expires = Date.now(); // Invalidate the all tools cache
    }
    return results;
};

// Deletes a tool definition by its name
export const deleteToolWithName = async (name: string): Promise<void> => {
    await deleteToolByName(name);
    toolMap.delete(name);
    if (ALL_TOOLS_CACHE) {
        ALL_TOOLS_CACHE.expires = Date.now(); // Invalidate the all tools cache
    }
    return;
}

// Resets the in-memory cache (for testing purposes)
export const __resetCache = () => {
    toolMap.clear();
    ALL_TOOLS_CACHE = null;
};