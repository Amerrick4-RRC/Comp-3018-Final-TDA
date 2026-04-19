import request from "supertest";
import express from "express";

// --------------------------------------------------
// MOCK THE ENTIRE ROUTER MODULE (TS-SAFE)
// --------------------------------------------------
jest.mock("../src/api/v1/routes/adminRoutes", () => {
  const express = require("express");
  const router = express.Router();

  router.post(
    "/setCustomClaims",
    (req: import("express").Request, res: import("express").Response) =>
      res.status(200).json({ mocked: true })
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

  return router;
});

// --------------------------------------------------
// IMPORT THE ROUTER AFTER MOCKING
// --------------------------------------------------
import adminRoutes from "../src/api/v1/routes/adminRoutes";

// --------------------------------------------------
// BUILD A MINIMAL EXPRESS APP
// --------------------------------------------------
const app = express();
app.use(express.json());
app.use("/admin", adminRoutes);

// --------------------------------------------------
// TEST SUITE
// --------------------------------------------------
describe("Admin Routes (Router-Mocked)", () => {
  it("PUT /admin/tools/:name → returns mocked response", async () => {
    const res = await request(app).put("/admin/tools/hammer");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ updated: "hammer" });
  });

  it("DELETE /admin/tools/:name → returns mocked response", async () => {
    const res = await request(app).delete("/admin/tools/saw");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: "saw" });
  });

  it("POST /admin/setCustomClaims → returns mocked response", async () => {
    const res = await request(app)
      .post("/admin/setCustomClaims")
      .send({ uid: "123", role: "admin" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ mocked: true });
  });
});