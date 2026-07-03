import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboardController.js";
import { authorizeRoles, requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/summary", requireAuth, authorizeRoles("company"), getDashboardSummary);

export default router;
