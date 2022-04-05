import { sequelize } from "@config/db";

jest.mock("@config/db", () => {
  const { config } = jest.requireActual("dotenv");
  config();

  const { Sequelize } = jest.requireActual("sequelize");

  const database = process.env.DB_TEST_NAME;
  const username = process.env.DB_TEST_USERNAME;
  const password = process.env.DB_TEST_PASSWORD;
  const host = process.env.DB_TEST_HOST;
  const port = process.env.DB_TEST_PORT;

  const sequelize = new Sequelize({
    dialect: "mysql",
    database,
    username,
    password,
    host,
    port,
    logging: false,
  });

  return { sequelize };
});

afterAll(async () => {
  await sequelize.close();
});
