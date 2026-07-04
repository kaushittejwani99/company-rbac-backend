import Company from "../models/Company.js";
import Employee from "../models/Employee.js";
import Employer from "../models/Employer.js";
import { getTokenCompanyId } from "../utils/companyScope.js";
import { deleteObjectByUrl } from "../utils/s3.js";

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
      // delete previous logo if present
      const existing = await Company.findById(companyId);
      if (existing && existing.logo) {
        await deleteObjectByUrl(existing.logo);
      }
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

    // fetch company and related records so we can delete images from S3
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const employers = await Employer.find({ company: companyId });
    const employees = await Employee.find({ company: companyId });

    // delete images: company logo, employer images, employee images (best-effort)
    if (company.logo) await deleteObjectByUrl(company.logo);
    await Promise.all(
      employers.map((e) => (e.image ? deleteObjectByUrl(e.image) : Promise.resolve()))
    );
    await Promise.all(
      employees.map((e) => (e.image ? deleteObjectByUrl(e.image) : Promise.resolve()))
    );

    const employerResult = await Employer.deleteMany({ company: companyId });
    const employeeResult = await Employee.deleteMany({ company: companyId });
    await Company.findByIdAndDelete(companyId);

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
