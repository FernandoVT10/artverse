module.exports = {
  projects: [
    {
      preset: "ts-jest",
      testEnvironment: "node",
      displayName: "server",
      rootDir: "<rootDir>/server/",
      moduleNameMapper: {
        "^@config/(.*)$": "<rootDir>/src/config/$1",
        "^@utils/(.*)$": "<rootDir>/src/utils/$1",
        "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
        "^@app$": "<rootDir>/src/app.ts",
        "^@routes/(.*)$": "<rootDir>/src/routes/$1",
        "^@test-utils/(.*)$": "<rootDir>/test/utils/$1"
      }
    },
    {
      preset: "ts-jest",
      testEnvironment: "jsdom",
      displayName: "client",
      rootDir: "<rootDir>/client/",
      moduleNameMapper: {
        "^.+\\.(css|less|scss)$": "identity-obj-proxy"
      },
      globals: {
        "ts-jest": {
          tsconfig: "<rootDir>/tsconfig.test.json"
        }
      }
    }
  ]
};
