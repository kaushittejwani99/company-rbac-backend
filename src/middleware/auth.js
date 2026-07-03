import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.sub);

    if (!company) {
      return res.status(401).json({ message: "Authenticated company no longer exists" });
    }

    req.auth = {
      companyId: company._id.toString(),
      role: decoded.role || company.role
    };
    req.company = company;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({ message: "You do not have permission for this action" });
    }

    next();
  };
};
