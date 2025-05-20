import { PrismaClient } from "../../generated/prisma/client.js";
const prisma = new PrismaClient();

export const index = async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json(posts);
};