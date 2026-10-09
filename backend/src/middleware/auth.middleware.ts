import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";
import { env } from "../config/env";
import { AppError } from "../utils/errors";
import { verifyJwt } from "../utils/jwt";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token: string | undefined = req.cookies?.[env.COOKIE_NAME];
    if (!token) throw new AppError(401, "Not authenticated.");

    const payload = verifyJwt(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, createdAt: true },
    });
    if (!user) throw new AppError(401, "Not authenticated.");

    req.user = user;
    next();
  } catch (err) {
    next(err instanceof AppError ? err : new AppError(401, "Not authenticated."));
  }
}
