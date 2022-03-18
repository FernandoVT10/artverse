import { Sequelize } from "sequelize";

import { DB_CONFIG } from "./constants";

export const sequelize = new Sequelize({
  dialect: "mysql",
  database: DB_CONFIG.databaseName,
  username: DB_CONFIG.username,
  password: DB_CONFIG.password,
  host: DB_CONFIG.host,
  port: DB_CONFIG.port,
});
