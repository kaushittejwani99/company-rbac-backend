import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  listEmployees,
  updateEmployee
} from "../controllers/employeeController.js";
import { authorizeRoles, requireAuth } from "../middleware/auth.js";
import { rejectClientCompanyScope } from "../middleware/companyScope.js";
import { validateBody } from "../middleware/validate.js";
import { employeeCreateSchema, employeeUpdateSchema } from "../validators/schemas.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(requireAuth, authorizeRoles("company"), rejectClientCompanyScope);
router.route("/").get(listEmployees).post(upload.single("image"), validateBody(employeeCreateSchema), createEmployee);
router.route("/:id").put(upload.single("image"), validateBody(employeeUpdateSchema), updateEmployee).delete(deleteEmployee);

export default router;
