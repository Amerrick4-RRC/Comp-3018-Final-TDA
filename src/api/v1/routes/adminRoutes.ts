import express, { Router } from "express";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { setCustomClaims, updateToolWithName, deleteToolByName } from "../controllers/adminController";


const router: Router = express.Router();

router.post("/setCustomClaims", setCustomClaims);
router.put("/tools/:name", authenticate, isAuthorized({ hasRole: ["admin"] }), updateToolWithName);
router.delete("/tools/:name", authenticate, isAuthorized({ hasRole: ["admin"] }), deleteToolByName);
export default router;