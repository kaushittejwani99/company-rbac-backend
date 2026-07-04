import bcrypt from "bcryptjs";
import Company from "../models/Company.js";
import { signCompanyToken } from "../utils/token.js";

const sanitizeCompany = (company) => ({
  id: company._id,
  companyName: company.companyName,
  email: company.email,
  industry: company.industry,
  phone: company.phone,
  address: company.address,
  logo: company.logo,
  role: company.role,
  createdAt: company.createdAt
});

export const signupCompany = async (req, res, next) => {
  try {
    const { companyName, email, password, industry, phone, address } = req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({ message: "Company name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingCompany = await Company.findOne({ email: email.toLowerCase() });

    if (existingCompany) {
      return res.status(409).json({ message: "A company already exists with this email" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const logoUrl = req.file ? req.file.location : "";
    
    const company = await Company.create({
      companyName,
      email,
      passwordHash,
      industry,
      phone,
      address,
      logo: logoUrl
    });

    res.status(201).json({
      token: signCompanyToken(company),
      company: sanitizeCompany(company)
    });
  } catch (error) {
    next(error);
  }
};

export const loginCompany = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const company = await Company.findOne({ email: email.toLowerCase() }).select("+passwordHash");

    if (!company) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, company.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: signCompanyToken(company),
      company: sanitizeCompany(company)
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentCompany = async (req, res) => {
  res.json({ company: sanitizeCompany(req.company) });
};
