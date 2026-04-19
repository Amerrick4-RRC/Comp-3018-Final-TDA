// --------------------------------------------------
// MOCK FIREBASE CONFIG FIRST (prevents crash on import)
// --------------------------------------------------
jest.mock("../src/config/firebaseConfig", () => ({
  initializeFirebaseAdmin: jest.fn(),
  getFirebaseConfig: jest.fn(),
  firebaseAdmin: {}
}));

import { Request, Response } from "express";
import {
  updateToolWithName,
  deleteToolByName
} from "../src/api/v1/controllers/toolController";

import {
  getByToolName,
  updateToolByName,
  deleteToolWithName
} from "../src/api/v1/services/toolsServices";

jest.mock("../src/api/v1/services/toolsServices");

// --------------------------------------------------
// Mock req/res helpers
// --------------------------------------------------
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.locals = {};
  return res as Response;
};

const mockRequest = (params = {}, body = {}) =>
  ({ params, body } as unknown as Request);

// --------------------------------------------------
// Test Suite
// --------------------------------------------------
describe("Tool Ownership Access Control", () => {
  beforeEach(() => jest.clearAllMocks());

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------
  describe("updateToolWithName", () => {
    it("allows update when requester is creator", async () => {
      const req = mockRequest({ name: "hammer" }, { description: "updated" });
      const res = mockResponse();
      res.locals.uid = "user123";

      (getByToolName as jest.Mock).mockResolvedValue({
        name: "hammer",
        creator: "user123"
      });

      (updateToolByName as jest.Mock).mockResolvedValue({
        name: "hammer",
        description: "updated"
      });

      await updateToolWithName(req, res);

      expect(getByToolName).toHaveBeenCalledWith("hammer");
      expect(updateToolByName).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        update: { name: "hammer", description: "updated" }
      });
    });

    it("blocks update when requester is NOT creator", async () => {
      const req = mockRequest({ name: "hammer" }, { description: "updated" });
      const res = mockResponse();
      res.locals.uid = "intruder";

      (getByToolName as jest.Mock).mockResolvedValue({
        name: "hammer",
        creator: "owner123"
      });

      await updateToolWithName(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "You are not the tools creator and cannot edit"
      });
      expect(updateToolByName).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------
  describe("deleteToolByName", () => {
    it("allows deletion when requester is creator", async () => {
      const req = mockRequest({ name: "hammer" });
      const res = mockResponse();
      res.locals.uid = "user123";

      (getByToolName as jest.Mock).mockResolvedValue({
        name: "hammer",
        creator: "user123"
      });

      (deleteToolWithName as jest.Mock).mockResolvedValue(true);

      await deleteToolByName(req, res);

      expect(deleteToolWithName).toHaveBeenCalledWith("hammer");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Successful deletion of hammer"
      });
    });

    it("blocks deletion when requester is NOT creator", async () => {
      const req = mockRequest({ name: "hammer" });
      const res = mockResponse();
      res.locals.uid = "intruder";

      (getByToolName as jest.Mock).mockResolvedValue({
        name: "hammer",
        creator: "owner123"
      });

      await deleteToolByName(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "You are not the tools creator and cannot edit"
      });
      expect(deleteToolWithName).not.toHaveBeenCalled();
    });
  });
});
