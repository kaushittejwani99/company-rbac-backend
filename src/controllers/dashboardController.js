import Employee from "../models/Employee.js";
import Employer from "../models/Employer.js";

export const getDashboardSummary = async (req, res, next) => {
  try {
    const company = req.auth.companyId;
    const [employerCount, employeeCount, activeEmployers, activeEmployees] = await Promise.all([
      Employer.countDocuments({ company }),
      Employee.countDocuments({ company }),
      Employer.countDocuments({ company, status: "active" }),
      Employee.countDocuments({ company, status: "active" })
    ]);

    res.json({
      employerCount,
      employeeCount,
      activeEmployers,
      activeEmployees
    });
  } catch (error) {
    next(error);
  }
};
