import { sequelize } from "@config/db";

beforeAll(async () => {
  // preventing sequelize to log
  (sequelize as any).options.logging = false;
});

afterAll(async () => {
  await sequelize.close();
});

export const clearDB = () => sequelize.sync({ force: true });
