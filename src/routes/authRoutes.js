import { Router } from "express";
import { getCurrentCompany, loginCompany, signupCompany } from "../controllers/authController.js";
import { authorizeRoles, requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, signupSchema } from "../validators/schemas.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.post("/signup", upload.single("logo"), validateBody(signupSchema), signupCompany);
router.post("/login", validateBody(loginSchema), loginCompany);
router.get("/me", requireAuth, authorizeRoles("company"), getCurrentCompany);

export default router;

