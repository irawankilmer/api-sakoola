import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

function generateRefreshToken() {
  return randomBytes(64).toString("hex");
}

export const register = async (req, res) => {
  const { name, email, password, roleNames = [] } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roles = await prisma.role.findMany({
      where: {
        name: {
          in: roleNames
        }
      }
    });
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: {
          create: roles.map(role => ({
            role: { connect: {
              id: role.id,
              }}
          }))
        }
      }
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      include: { roles: { include: { role: true } } }
    });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Login failed" });

    const roleNames = user.roles.map(r => r.role.name);
    const accessToken = jwt.sign({ userId: user.id, roles: roleNames }, JWT_SECRET, { expiresIn: "15m" });

    const refreshToken = generateRefreshToken();
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ accessToken });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const refreshTokenHandler = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  try {
    const stored = await prisma.refreshToken.findUniqueOrThrow({
      where: { token },
      include: { user: true }
    });

    if (stored.expiresAt < new Date()) {
      return res.status(403).json({ error: "Refresh token expired" });
    }

    const userWithRoles = await prisma.user.findUnique({
      where: { id: stored.userId },
      include: { roles: { include: { role: true } } }
    });

    const roleNames = userWithRoles.roles.map(r => r.role.name);
    const newAccessToken = jwt.sign({ userId: stored.user.id, roles: roleNames }, JWT_SECRET, { expiresIn: "15m" });

    res.json({ accessToken: newAccessToken });
  } catch (e) {
    res.status(403).json({ error: "Invalid refresh token" });
  }
};

export const logoutHandler = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }

  res.clearCookie("refreshToken").json({ message: "Logged out" });
};