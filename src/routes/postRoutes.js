import {
  index,
  store,
  show,
  update,
  destroy
} from "../controllers/postController.js";

export default function (app) {
  app.get('/post', index);
  app.post('/post', store);
  app.get('/post/:id', show);
  app.put('/post/:id', update);
  app.delete('/post/:id', destroy);
}