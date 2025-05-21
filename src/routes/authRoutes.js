import { register, login } from '../controllers/authController.js';

export default function (app) {
  app.post('/register', register);
  app.post('/login', login);
}