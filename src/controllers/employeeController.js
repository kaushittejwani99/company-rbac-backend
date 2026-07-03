import Employee from "../models/Employee.js";
import { companyFilter, companyOwnedPayload } from "../utils/companyScope.js";

const allowedFields = ["name", "email", "phone", "department", "position", "salary", "status", "joinedAt", "image"];

const pickFields = (body) => {
  return allowedFields.reduce((payload, field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field];
    }

    return payload;
  }, {});
};

export const listEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find(companyFilter(req)).sort({ createdAt: -1 });
    res.json({ employees });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const payload = pickFields(req.body);
    
    // Add image if file is uploaded
    if (req.file) {
      payload.image = req.file.filename;
    }
    
    const employee = await Employee.create(companyOwnedPayload(req, payload));

    res.status(201).json({ employee });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const payload = pickFields(req.body);
    
    // Add image if file is uploaded
    if (req.file) {
      payload.image = req.file.filename;
    }
    
    const employee = await Employee.findOneAndUpdate(
      companyFilter(req, { _id: req.params.id }),
      payload,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ employee });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOneAndDelete(companyFilter(req, { _id: req.params.id }));

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted" });
  } catch (error) {
    next(error);
  }
};


