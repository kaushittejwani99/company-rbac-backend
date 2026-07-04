import Employer from "../models/Employer.js";
import { companyFilter, companyOwnedPayload } from "../utils/companyScope.js";

const allowedFields = ["name", "email", "phone", "department", "designation", "permissions", "status", "hiredAt", "image"];

const pickFields = (body) => {
  return allowedFields.reduce((payload, field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }

    return payload;
  }, {});
};

export const listEmployers = async (req, res, next) => {
  try {
    const employers = await Employer.find(companyFilter(req)).sort({ createdAt: -1 });
    res.json({ employers });
  } catch (error) {
    next(error);
  }
};

export const createEmployer = async (req, res, next) => {
  try {
    const payload = pickFields(req.body);
    
    // Add image URL if file is uploaded
    if (req.file) {
      payload.image = req.file.location;
    }
    
    const employer = await Employer.create(companyOwnedPayload(req, payload));

    res.status(201).json({ employer });
  } catch (error) {
    next(error);
  }
};

export const updateEmployer = async (req, res, next) => {
  try {
    const payload = pickFields(req.body);
    
    // Add image URL if file is uploaded
    if (req.file) {
      payload.image = req.file.location;
    }
    
    const employer = await Employer.findOneAndUpdate(
      companyFilter(req, { _id: req.params.id }),
      payload,
      { new: true, runValidators: true }
    );

    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    res.json({ employer });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployer = async (req, res, next) => {
  try {
    const employer = await Employer.findOneAndDelete(companyFilter(req, { _id: req.params.id }));

    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    res.json({ message: "Employer deleted" });
  } catch (error) {
    next(error);
  }
};


