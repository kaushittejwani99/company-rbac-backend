import jwt from "jsonwebtoken";

export const signCompanyToken = (company) => {
  return jwt.sign(
    {
      sub: company._id.toString(),
      role: company.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};
