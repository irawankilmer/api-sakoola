import { register,
  login,
  refreshTokenHandler,
  logoutHandler
} from '../controllers/authController.js';

export default function (app) {
  app.post('/register', register);
  app.post('/login', login);
  app.post('/refresh-token', refreshTokenHandler);
  app.post('/logout', logoutHandler);
}