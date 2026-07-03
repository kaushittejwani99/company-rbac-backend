export const clientCompanyScopeFields = ["company", "companyId"];

export const getTokenCompanyId = (req) => {
  if (!req.auth?.companyId) {
    throw new Error("Company scope is missing from the authenticated token");
  }

  return req.auth.companyId;
};

export const companyFilter = (req, filter = {}) => ({
  ...filter,
  company: getTokenCompanyId(req)
});

export const companyOwnedPayload = (req, payload = {}) => ({
  ...payload,
  company: getTokenCompanyId(req)
});
