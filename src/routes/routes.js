import express from 'express';
import postRoutes from "./postRoutes.js";

export default function (app) {
  const api = express.Router();

  postRoutes(api);

  app.use('/api/v1', api);
}