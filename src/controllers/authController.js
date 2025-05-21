import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

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
      where: {email}, include: {
        roles: {
          include: { role: true }
        }
      }
    });

    if (!user) return res.status(401).json({ message: "User login failed" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "User login failed" });

    const roleNames = user.roles.map(r => r.name);
    const token = jwt.sign({
      userId: user.id, roles: roleNames
    },
      JWT_SECRET, {
        expiresIn: "1d"
    });

    res.json({ token });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};