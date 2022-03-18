import { config } from "dotenv";
// set all variables from ".env" file in the "process.env"
config();

type DBConfig = {
  host: string;
  username: string;
  password: string;
  databaseName: string;
  port: number;
};

const dbPort = parseInt(process.env.PORT || "") || 3306;

export const DB_CONFIG: DBConfig = {
  host: process.env.DB_HOST || "",
  username: process.env.DB_USERNAME || "",
  password: process.env.DB_PASSWORD || "",
  databaseName: process.env.DB_NAME || "",
  port: dbPort,
};
