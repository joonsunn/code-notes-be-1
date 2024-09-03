import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "@src/utils/auth.util";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET as envJWT_REFRESH_SECRET } from "@src/config/config";
import { HttpError } from "@src/utils/HttpError";
import { roles } from "@src/config/roles";
import { RefreshToken } from "../models/refreshToken.model"; // Assume you have a model for storing refresh tokens

const JWT_REFRESH_SECRET = envJWT_REFRESH_SECRET ?? "your_jwt_refresh_secret";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    // if (existingUser) {
    //   const error = new Error("User already exists");
    //   (error as any).status = 400;
    //   throw error;
    // }
    if (existingUser) {
      throw new HttpError("User already exists", 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      // role: roles.USER,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { email: user.email, role: user.role },
    });
  } catch (error) {
    // res.status(500).json({ error: "User registration failed" });
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    // if (!user) {
    //   const error = new Error("Invalid email or password");
    //   (error as any).status = 401;
    //   throw error;
    // }
    if (!user) {
      throw new HttpError("Invalid email or password", 401);
    }
    // if (!user || !(await comparePassword(password, user.password))) {
    //   return res.status(401).json({ error: "Invalid email or password" });
    // }

    const isMatch = await comparePassword(password, user.password);
    // if (!isMatch) {
    //   const error = new Error("Invalid email or password");
    //   (error as any).status = 401;
    //   throw error;
    // }
    if (!isMatch) {
      throw new HttpError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Save the refresh token in the database
    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Adjust expiry as needed
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ accessToken });
  } catch (error) {
    // res.status(500).json({ error: "Login failed" });
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the cookies
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Optionally, invalidate the refresh token in the database
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await RefreshToken.destroy({ where: { token: refreshToken } });
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: "An error occurred while logging out",
      error: error.message,
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.sendStatus(403);

  try {
    const payload = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as jwt.JwtPayload;

    const user = await User.findByPk(payload.id);
    if (!user) return res.sendStatus(403);

    const accessToken = generateAccessToken(user.id);
    res.json({ accessToken });
  } catch (error) {
    res.sendStatus(403);
  }
};
