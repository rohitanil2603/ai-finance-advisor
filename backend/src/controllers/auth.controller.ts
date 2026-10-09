import type { CookieOptions, Request, Response } from "express";
import { env } from "../config/env";
import * as authService from "../services/auth.service";
import { asyncHandler } from "../utils/errors";
import type { LoginInput, RegisterInput } from "../validators/auth.validators";

function cookieOptions(): CookieOptions {
  const isProd = env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    // "none" is required for the Vercel-hosted frontend (different origin) to receive the
    // cookie in production; "lax" works for same-site localhost dev without needing https.
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export const register = asyncHandler(async (_req: Request, res: Response) => {
  const { email, password } = res.locals.validated as RegisterInput;
  const { user, token } = await authService.register(email, password);
  res.cookie(env.COOKIE_NAME, token, cookieOptions());
  res.status(201).json(user);
});

export const login = asyncHandler(async (_req: Request, res: Response) => {
  const { email, password } = res.locals.validated as LoginInput;
  const { user, token } = await authService.login(email, password);
  res.cookie(env.COOKIE_NAME, token, cookieOptions());
  res.status(200).json(user);
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(env.COOKIE_NAME, cookieOptions());
  res.sendStatus(204);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.json(req.user);
});
