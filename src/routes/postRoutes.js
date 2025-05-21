import passport from "passport";
import { authorizeRoles } from "../middlewares/authorize.js";
import {
  index,
  store,
  show,
  update,
  destroy
} from "../controllers/postController.js";

export default function (app) {
  app.get('/post', passport.authenticate('jwt', { session: false }), authorizeRoles(['admin']), index);
  app.post('/post', passport.authenticate('jwt', { session: false }), authorizeRoles(['admin']), store);
  app.get('/post/:id', passport.authenticate('jwt', { session: false }), authorizeRoles(['admin']), show);
  app.put('/post/:id', passport.authenticate('jwt', { session: false }), authorizeRoles(['admin']), update);
  app.delete('/post/:id', passport.authenticate('jwt', { session: false }), authorizeRoles(['admin']), destroy);
}