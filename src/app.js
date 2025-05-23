import express from "express";
import routes from "./routes/routes.js";
import cors from "cors";
import { corsOptions } from "./configs/corsConfig.js";
import passport from "passport";
import configurePassport from "./configs/passportConfig.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

configurePassport(passport);
app.use(passport.initialize());
app.use(cookieParser());

routes(app);

export default app;