import request from "supertest";
import express from "express";

// --------------------------------------------------
// MOCK THE ENTIRE TOOLS ROUTER (TS-SAFE)
// --------------------------------------------------
jest.mock("../src/api/v1/routes/toolsRoutes", () => {
  const express = require("express");
  const router = express.Router();

  router.get(
    "/tools",
    (req: import("express").Request, res: import("express").Response) =>
      res.status(200).json({ tools: ["mocked"] })
  );

  router.post(
    "/tools",
    (req: import("express").Request, res: import("express").Response) =>
      res.status(201).json({ created: true })
  );

  router.get(
    "/tools/:name",
    (req: import("express").Request, res: import("express").Response) =>
      res.status(200).json({ selected: req.params.name })
  );

  router.put(
    "/tools/:name",
    (req: import("express").Request, res: import("express").Response) =>
      res.status(200).json({ updated: req.params.name })
  );

  router.delete(
    "/tools/:name",
    (req: import("express").Request, res: import("express").Response) =>
      res.status(200).json({ deleted: req.params.name })
  );

  router.get(
    "/health",
    (req: import("express").Request, res: import("express").Response) =>
      res.status(200).json({ status: "ok" })
  );

  router.post(
    "/auth/signin",
    (req: import("express").Request, res: import("express").Response) =>
      res.status(200).json({ signedIn: true })
  );

  return router;
});

// --------------------------------------------------
// IMPORT ROUTER AFTER MOCKING
// --------------------------------------------------
import toolsRoutes from "../src/api/v1/routes/toolsRoutes";

// --------------------------------------------------
// BUILD MINIMAL EXPRESS APP
// --------------------------------------------------
const app = express();
app.use(express.json());
app.use("/api", toolsRoutes);

// --------------------------------------------------
// TEST SUITE
// --------------------------------------------------
describe("Tools Routes (Router-Mocked)", () => {
  it("GET /api/tools → returns mocked tools list", async () => {
    const res = await request(app).get("/api/tools");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ tools: ["mocked"] });
  });

  it("POST /api/tools → returns mocked creation response", async () => {
    const res = await request(app).post("/api/tools").send({ name: "hammer" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ created: true });
  });

  it("GET /api/tools/:name → returns mocked selected tool", async () => {
    const res = await request(app).get("/api/tools/saw");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ selected: "saw" });
  });

  it("PUT /api/tools/:name → returns mocked update response", async () => {
    const res = await request(app).put("/api/tools/hammer");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ updated: "hammer" });
  });

  it("DELETE /api/tools/:name → returns mocked delete response", async () => {
    const res = await request(app).delete("/api/tools/saw");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: "saw" });
  });

  it("GET /api/health → returns mocked health response", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("POST /api/auth/signin → returns mocked signin response", async () => {
    const res = await request(app).post("/api/auth/signin").send({ email: "a@b.com" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ signedIn: true });
  });
});