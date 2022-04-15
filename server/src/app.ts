import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import errorHandler from "@middlewares/errorHandler";

import { PUBLIC_DIR } from "./config/constants";

const app = express();

app.use(express.static(PUBLIC_DIR));
app.use(bodyParser.json());

app.use(routes);
app.use(errorHandler());

export default app;
