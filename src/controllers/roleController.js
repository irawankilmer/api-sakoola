import { PrismaClient } from "@prisma/client";
import { getIO } from "../sockets/io.js";

const prisma = new PrismaClient();

export const index = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.status(200).json(roles);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const store = async (req, res) => {
  try {
    const role = await prisma.role.create({
      data: {
        name: req.body.name,
      }
    });

    getIO()?.emit('new_role', role);
    res.status(201).json(role);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const show = async (req, res) => {
  try {
    const role = await prisma.role.findUniqueOrThrow({
      where: {
        id: parseInt(req.params.id),
      }
    });

    res.status(200).json(role);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const update = async (req, res) => {
  try {
    const role = await prisma.role.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        role: req.body.role,
      }
    });

    getIO()?.emit('updated_role', role);
    res.status(204).json(role);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const destroy = async (req, res) => {
  try {
    const role = await prisma.role.delete({
      where: {
        id: parseInt(req.params.id),
      }
    });

    getIO()?.emit('deleted_role', role);
    res.status(204).json(role);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};