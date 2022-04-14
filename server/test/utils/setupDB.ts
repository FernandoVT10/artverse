import { sequelize } from "@config/db";

beforeAll(() => {
  // preventing sequelize to log
  (sequelize as any).options.logging = false;
});

afterAll(async () => {
  await sequelize.close();
});
