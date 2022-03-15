import path from "path";
import express from "express";
import next from "next";

// this is the url where the client files is
const clientDir = path.join(__dirname, "../../client");
const dev = process.env.NODE_ENV !== "production";
const port = 3000;

const server = express();
const nextApp = next({ dev, dir: clientDir });
const nextHandle = nextApp.getRequestHandler();

(async function () {
  await nextApp.prepare();

  server.use(express.static(path.join(__dirname, "../../public")));

  server.all("*", (req, res) => {
    return nextHandle(req, res);
  });

  server.listen(port, () => {
    console.log("Server running on: http://localhost:3000");
  });
})();
