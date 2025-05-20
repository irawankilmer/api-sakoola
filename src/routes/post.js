import { index } from "../controllers/post-controller.js";

export default function (app) {
  app.get('/posts', index);
}