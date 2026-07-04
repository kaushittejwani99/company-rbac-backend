import { Router } from "express";
import {
  deleteCompanyAccount,
  getCompanyProfile,
  updateCompanyProfile
} from "../controllers/companyController.js";
import { authorizeRoles, requireAuth } from "../middleware/auth.js";
import { rejectClientCompanyScope } from "../middleware/companyScope.js";
import { validateBody } from "../middleware/validate.js";
import { companyUpdateSchema } from "../validators/schemas.js";
import { uploadLogo } from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(requireAuth, authorizeRoles("company"), rejectClientCompanyScope);
router.route("/").get(getCompanyProfile).put(uploadLogo.single("logo"), validateBody(companyUpdateSchema), updateCompanyProfile).delete(deleteCompanyAccount);

export default router;
