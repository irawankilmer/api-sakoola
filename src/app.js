import express from "express";
import routes from "./routes/routes.js";
import cors from "cors";
import { corsOptions } from "./configs/cors.js";

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

routes(app);

export default app;