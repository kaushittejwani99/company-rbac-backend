import { clientCompanyScopeFields } from "../utils/companyScope.js";

const collectClientCompanyFields = (source = {}) => {
  return clientCompanyScopeFields.filter((field) => Object.prototype.hasOwnProperty.call(source, field));
};

export const rejectClientCompanyScope = (req, res, next) => {
  const bodyFields = collectClientCompanyFields(req.body);
  const queryFields = collectClientCompanyFields(req.query);
  const forbiddenFields = [...new Set([...bodyFields, ...queryFields])];

  if (forbiddenFields.length > 0) {
    return res.status(400).json({
      message: "Company scope is decoded from the JWT token only. Do not send company or companyId in API requests.",
      forbiddenFields
    });
  }

  next();
};
