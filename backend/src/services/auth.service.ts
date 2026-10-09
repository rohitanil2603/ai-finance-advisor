import { prisma } from "../config/db";
import { AppError } from "../utils/errors";
import { signJwt } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";

function toPublicUser(user: { id: string; email: string; createdAt: Date }) {
  return { id: user.id, email: user.email, createdAt: user.createdAt.toISOString() };
}

export async function register(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError(409, "An account with this email already exists.");

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash } });

  return { user: toPublicUser(user), token: signJwt({ sub: user.id }) };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError(401, "Invalid email or password.");

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new AppError(401, "Invalid email or password.");

  return { user: toPublicUser(user), token: signJwt({ sub: user.id }) };
}
