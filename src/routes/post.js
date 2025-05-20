import {
  index,
  store,
  detail,
  update,
  destroy
} from "../controllers/post-controller.js";

export default function (app) {
  app.get('/post', index);
  app.post('/post', store);
  app.get('/post/:id', detail);
  app.put('/post/:id', update);
  app.delete('/post/:id', destroy);
}