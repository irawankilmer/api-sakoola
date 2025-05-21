import express from 'express';
import postRoutes from "./postRoutes.js";
import authRoutes from "./authRoutes.js";
import roleRoutes from "./roleRoutes.js";

export default function (app) {
  const api = express.Router();

  authRoutes(api);
  postRoutes(api);
  roleRoutes(api);

  app.use('/api/v1', api);
}