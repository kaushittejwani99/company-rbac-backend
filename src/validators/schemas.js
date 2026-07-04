import Joi from "joi";

const phoneRule = Joi.string()
  .trim()
  .allow("")
  .max(30)
  .pattern(/^[+\d\s().-]*$/)
  .messages({
    "string.pattern.base": "phone can contain only numbers "
  });

const emailRule = Joi.string().trim().lowercase().email({ tlds: { allow: false } });
const statusRule = Joi.string().valid("active", "inactive");
const permissionRule = Joi.string().valid("manage_employers", "manage_employees", "view_dashboard");

export const signupSchema = Joi.object({
  companyName: Joi.string().trim().min(2).max(120).required(),
  email: emailRule.required(),
  password: Joi.string().min(6).max(128).required(),
  industry: Joi.string().trim().allow("").max(80).default(""),
  phone: phoneRule.default(""),
  address: Joi.string().trim().allow("").max(200).default("")
});

export const loginSchema = Joi.object({
  email: emailRule.required(),
  password: Joi.string().min(6).max(128).required()
});

export const companyUpdateSchema = Joi.object({
  companyName: Joi.string().trim().min(2).max(120),
  email: emailRule,
  industry: Joi.string().trim().allow("").max(80),
  phone: phoneRule,
  address: Joi.string().trim().allow("").max(200)
}).min(1);

export const employerCreateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: emailRule.required(),
  phone: phoneRule.default(""),
  department: Joi.string().trim().min(2).max(80).required(),
  designation: Joi.string().trim().min(2).max(80).required(),
  permissions: Joi.array().items(permissionRule).min(1).unique().default(["view_dashboard"]),
  status: statusRule.default("active"),
  hiredAt: Joi.date().iso()
});

export const employerUpdateSchema = employerCreateSchema
  .fork(["name", "email", "department", "designation"], (schema) => schema.optional())
  .min(1);

export const employeeCreateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: emailRule.required(),
  phone: phoneRule.default(""),
  department: Joi.string().trim().min(2).max(80).required(),
  position: Joi.string().trim().min(2).max(80).required(),
  salary: Joi.number().min(0).precision(2).default(0),
  status: statusRule.default("active"),
  joinedAt: Joi.date().iso()
});

export const employeeUpdateSchema = employeeCreateSchema
  .fork(["name", "email", "department", "position"], (schema) => schema.optional())
  .min(1);

