import { Router } from "express";
import {
  createEmployer,
  deleteEmployer,
  listEmployers,
  updateEmployer
} from "../controllers/employerController.js";
import { authorizeRoles, requireAuth } from "../middleware/auth.js";
import { rejectClientCompanyScope } from "../middleware/companyScope.js";
import { validateBody } from "../middleware/validate.js";
import { employerCreateSchema, employerUpdateSchema } from "../validators/schemas.js";
import { uploadEmployerImage } from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(requireAuth, authorizeRoles("company"), rejectClientCompanyScope);
router.route("/").get(listEmployers).post(uploadEmployerImage.single("image"), validateBody(employerCreateSchema), createEmployer);
router.route("/:id").put(uploadEmployerImage.single("image"), validateBody(employerUpdateSchema), updateEmployer).delete(deleteEmployer);

export default router;
