import path from "path";
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

const ROOT_DIR = path.resolve(__dirname, "../../../");

export const LOGS_DIR = path.resolve(ROOT_DIR, "./logs/");
// the path where our frontend is
export const CLIENT_DIR = path.resolve(ROOT_DIR, "./client");
// the path where our static files are
export const PUBLIC_DIR = path.resolve(ROOT_DIR, "./public");
