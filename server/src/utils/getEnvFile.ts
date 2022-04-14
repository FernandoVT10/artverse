export default function getEnvFile(
  nodeEnv: typeof process.env.NODE_ENV
): string {
  switch (nodeEnv) {
    case "development":
      return ".env.dev";
    case "test":
      return ".env.test";
    default:
      return ".env";
  }
}
