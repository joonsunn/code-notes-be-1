import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  JWT_REFRESH_SECRET as envJWT_REFRESH_SECRET,
  JWT_SECRET as envJWT_SECRET,
} from "@src/config/config";

const JWT_SECRET = envJWT_SECRET ?? "your_jwt_secret";
const JWT_REFRESH_SECRET = envJWT_REFRESH_SECRET ?? "your_jwt_refresh_secret";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
