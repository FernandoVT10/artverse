import getEnvFile from "../getEnvFile";

describe("utils/getEnvFile", () => {
  it("should return '.env' when we pass 'production'", async () => {
    expect(getEnvFile("production")).toBe(".env");
  });

  it("should return '.env.dev' when we pass 'development'", async () => {
    expect(getEnvFile("development")).toBe(".env.dev");
  });

  it("should return '.env.test' when we pass 'test'", async () => {
    expect(getEnvFile("test")).toBe(".env.test");
  });
});
