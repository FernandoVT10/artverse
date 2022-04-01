import express from "express";
import next from "next";
import bodyParser from "body-parser";

import { sequelize } from "./config/db";
import { CLIENT_DIR, PUBLIC_DIR } from "./config/constants";

import logger from "./config/logger";

import routes from "./routes";

const port = 3000;

const server = express();

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: CLIENT_DIR });
const nextHandle = nextApp.getRequestHandler();

(async function () {
  await nextApp.prepare();

  try {
    await sequelize.authenticate();
  } catch (err) {
    return logger.error(err);
  }

  server.use(express.static(PUBLIC_DIR));
  server.use(bodyParser.json());

  server.use(routes);

  server.all("*", (req, res) => {
    return nextHandle(req, res);
  });

  server.listen(port, () => {
    console.log(
      "Server running on:",
      "\x1b[34m",
      `http://localhost:${port}`,
      "\x1b[0m"
    );
  });
})();
