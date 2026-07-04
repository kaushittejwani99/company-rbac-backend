import Company from "../models/Company.js";
import Employee from "../models/Employee.js";
import Employer from "../models/Employer.js";
import { getTokenCompanyId } from "../utils/companyScope.js";

const sanitizeCompany = (company) => ({
  id: company._id,
  companyName: company.companyName,
  email: company.email,
  industry: company.industry,
  phone: company.phone,
  address: company.address,
  logo: company.logo,
  role: company.role,
  createdAt: company.createdAt,
  updatedAt: company.updatedAt
});

const allowedFields = ["companyName", "email", "industry", "phone", "address", "logo"];

const pickCompanyFields = (body) => {
  return allowedFields.reduce((payload, field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }

    return payload;
  }, {});
};

export const getCompanyProfile = (req, res) => {
  res.json({ company: sanitizeCompany(req.company) });
};

export const updateCompanyProfile = async (req, res, next) => {
  try {
    const companyId = getTokenCompanyId(req);
    const payload = pickCompanyFields(req.body);

    // Add logo URL if file is uploaded
    if (req.file) {
      payload.logo = req.file.location;
    }

    if (payload.email) {
      const existingCompany = await Company.findOne({
        _id: { $ne: companyId },
        email: payload.email
      });

      if (existingCompany) {
        return res.status(409).json({ message: "A company already exists with this email" });
      }
    }

    const company = await Company.findByIdAndUpdate(companyId, payload, {
      new: true,
      runValidators: true
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({ company: sanitizeCompany(company) });
  } catch (error) {
    next(error);
  }
};

export const deleteCompanyAccount = async (req, res, next) => {
  try {
    const companyId = getTokenCompanyId(req);

    const [employerResult, employeeResult, company] = await Promise.all([
      Employer.deleteMany({ company: companyId }),
      Employee.deleteMany({ company: companyId }),
      Company.findByIdAndDelete(companyId)
    ]);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json({
      message: "Company and related records deleted",
      deleted: {
        company: 1,
        employers: employerResult.deletedCount,
        employees: employeeResult.deletedCount
      }
    });
  } catch (error) {
    next(error);
  }
};
