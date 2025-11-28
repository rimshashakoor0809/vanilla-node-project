import jwt from "jsonwebtoken";

export const generateToken = (type = "access", payload, secret) => {
  const expiresIn =
    type === "access"
      ? "1d"
      : type === "refresh"
        ? "7d"
        : "15m";

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }
};
