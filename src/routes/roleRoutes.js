import {
  index,
  store,
  show,
  update,
  destroy
} from "../controllers/roleController.js";

export default function (app) {
  app.get('/role', index);
  app.post('/role', store);
  app.get('/role/:id', show);
  app.put('/role/:id', update);
  app.delete('/role/:id', destroy);
}