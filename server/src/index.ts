import path from "path";
import express from "express";
import next from "next";

import { sequelize } from "./config/db";

import routes from "./routes";

// this is the url where the client files are
const clientDir = path.join(__dirname, "../../client");
const dev = process.env.NODE_ENV !== "production";
const port = 3000;

const server = express();
const nextApp = next({ dev, dir: clientDir });
const nextHandle = nextApp.getRequestHandler();

(async function () {
  await nextApp.prepare();

  try {
    await sequelize.authenticate();
  } catch (err) {
    console.error("There was an error trying to connect to the database", err);
  }

  server.use(express.static(path.join(__dirname, "../../public")));

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
