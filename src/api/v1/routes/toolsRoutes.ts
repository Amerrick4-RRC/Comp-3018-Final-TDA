import express, { Router } from "express";
import {
    getTools,
    createTool,
    updateToolWithName,
    deleteToolByName,
    getHealth,
    getSelectedTool,
    signIn
} from "../controllers/toolController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";



const router: Router = express.Router();

router.get("/tools",authenticate,isAuthorized({ hasRole: ["admin", "officer", "manager"] }), getTools);
router.post("/tools",authenticate,isAuthorized({ hasRole: ["admin", "manager"] }), createTool);
router.get("/tools/:name",authenticate,isAuthorized({ hasRole: ["admin", "officer", "manager"] }), getSelectedTool);
router.put("/tools/:name",authenticate,isAuthorized({ hasRole: ["admin", "manager"] }), updateToolWithName);
router.delete("/tools/:name",authenticate,isAuthorized({ hasRole: ["admin"], allowSameUser: true }), deleteToolByName);
router.get("/health", getHealth);
router.post("/auth/signin", signIn)
export default router;