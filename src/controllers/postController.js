import { PrismaClient } from "@prisma/client";
import { getIO } from "../sockets/io.js";

const prisma = new PrismaClient();

export const index = async (req, res) => {
  try {
  const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const store = async (req, res) => {
  try {
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
      }
    });

    getIO()?.emit('new_post', post);
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const show = async (req, res) => {
  try {
    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id: parseInt(req.params.id),
      }
    });

    res.status(200).json(post);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const update = async (req, res) => {
  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        title: req.body.title,
        content: req.body.content,
      }
    });

    getIO()?.emit('updated_post', post);
    res.status(204).json(post);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

export const destroy = async (req, res) => {
  try {
    const post = await prisma.post.delete({
      where: {
        id: parseInt(req.params.id),
      }
    });

    getIO()?.emit('deleted_post', post);
    res.status(204).json(post);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};