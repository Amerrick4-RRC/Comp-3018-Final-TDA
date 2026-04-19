// -------------------------------------------------------------
// IMPORTANT: Mock repository BEFORE importing the service layer
// -------------------------------------------------------------
jest.mock("../src/api/v1/repositories/toolRepository", () => ({
    addTool: jest.fn(),
    getToolById: jest.fn(),
    getAllToolsList: jest.fn(),
    updateTool: jest.fn(),
    deleteToolByName: jest.fn()
}));

// Now import the mocked functions
import {
    addTool,
    getToolById,
    getAllToolsList,
    updateTool,
    deleteToolByName
} from "../src/api/v1/repositories/toolRepository";

// Import the service AFTER the mock is in place
import {
    createNewTool,
    getByToolName,
    getAllTools,
    updateToolByName,
    deleteToolWithName,
    __resetCache
} from "../src/api/v1/services/toolsServices";

beforeEach(() => {
    __resetCache();
    jest.clearAllMocks();
    jest.clearAllTimers();
});

jest.useFakeTimers();

describe("Tool Service Cache Layer", () => {
    const now = new Date();

    const mockTool = {
        name: "hammer",
        description: "A strong tool",
        jsonSchema: "{}",
        creator: "andrew",
        createdAt: now,
        updatedAt: now
    };

    const mockTool2 = {
        name: "saw",
        description: "A cutting tool",
        jsonSchema: "{}",
        creator: "andrew",
        createdAt: now,
        updatedAt: now
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    // ---------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------
    test("createNewTool stores result in cache", async () => {
        (addTool as jest.Mock).mockResolvedValue(mockTool);

        const result = await createNewTool({
            name: mockTool.name,
            description: mockTool.description,
            jsonSchema: mockTool.jsonSchema,
            creator: mockTool.creator
        });

        expect(addTool).toHaveBeenCalledWith({
            name: mockTool.name,
            description: mockTool.description,
            jsonSchema: mockTool.jsonSchema,
            creator: mockTool.creator
        });

        expect(result).toEqual(mockTool);

        // Should hit cache on second call
        const cached = await getByToolName("hammer");
        expect(getToolById).not.toHaveBeenCalled();
        expect(cached).toEqual(mockTool);
    });

    // ---------------------------------------------------------
    // GET BY NAME
    // ---------------------------------------------------------
    test("getByToolName returns cached value on second call", async () => {
        (getToolById as jest.Mock).mockResolvedValue(mockTool);

        const first = await getByToolName("hammer");
        expect(getToolById).toHaveBeenCalledTimes(1);

        const second = await getByToolName("hammer");
        expect(getToolById).toHaveBeenCalledTimes(1); // cache hit
        expect(second).toEqual(mockTool);
        expect(first).toEqual(second);
    });

    test("getByToolName refreshes cache after expiration", async () => {
        (getToolById as jest.Mock).mockResolvedValue(mockTool);

        await getByToolName("hammer");
        expect(getToolById).toHaveBeenCalledTimes(1);

        // Fast‑forward 1 hour + 1ms
        jest.advanceTimersByTime(60 * 60 * 1000 + 1);

        await getByToolName("hammer");
        expect(getToolById).toHaveBeenCalledTimes(2);
    });

    // ---------------------------------------------------------
    // GET ALL TOOLS
    // ---------------------------------------------------------
    test("getAllTools caches list and individual items", async () => {
        (getAllToolsList as jest.Mock).mockResolvedValue([mockTool, mockTool2]);

        const first = await getAllTools();
        expect(getAllToolsList).toHaveBeenCalledTimes(1);
        expect(first.length).toBe(2);

        const second = await getAllTools();
        expect(getAllToolsList).toHaveBeenCalledTimes(1); // cache hit
        expect(second.length).toBe(2);

        // Individual items should also be cached
        const hammer = await getByToolName("hammer");
        expect(getToolById).not.toHaveBeenCalled();
        expect(hammer).toEqual(mockTool);
    });

    test("getAllTools refreshes after expiration", async () => {
        (getAllToolsList as jest.Mock).mockResolvedValue([mockTool]);

        await getAllTools();
        expect(getAllToolsList).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(60 * 60 * 1000 + 1);

        await getAllTools();
        expect(getAllToolsList).toHaveBeenCalledTimes(2);
    });

    // ---------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------
    test("updateToolByName updates cache", async () => {
        const updated = {
            ...mockTool,
            description: "Updated desc",
            updatedAt: new Date()
        };

        (updateTool as jest.Mock).mockResolvedValue(updated);

        const result = await updateToolByName("hammer", {
            description: "Updated desc",
            jsonSchema: "{}"
        });

        expect(updateTool).toHaveBeenCalledWith("hammer", {
            description: "Updated desc",
            jsonSchema: "{}"
        });

        expect(result.description).toBe("Updated desc");

        // Should now return updated version from cache
        const cached = await getByToolName("hammer");
        expect(cached.description).toBe("Updated desc");
    });

    // ---------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------
    test("deleteToolWithName removes from cache", async () => {
        (getToolById as jest.Mock).mockResolvedValue(mockTool);

        await getByToolName("hammer"); // populate cache
        expect(getToolById).toHaveBeenCalledTimes(1);

        await deleteToolWithName("hammer");
        expect(deleteToolByName).toHaveBeenCalledWith("hammer");

        // Should fetch again because cache was cleared
        await getByToolName("hammer");
        expect(getToolById).toHaveBeenCalledTimes(2);
    });
});