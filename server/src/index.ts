import next from "next";
import logger from "./config/logger";
import app from "./app";

import { sequelize } from "./config/db";
import { CLIENT_DIR } from "./config/constants";

const port = 3000;

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

  app.all("*", (req, res) => {
    return nextHandle(req, res);
  });

  app.listen(port, () => {
    console.log(
      "Server running on:",
      "\x1b[34m",
      `http://localhost:${port}`,
      "\x1b[0m"
    );
  });
})();
