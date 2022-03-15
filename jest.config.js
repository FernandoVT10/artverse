module.exports = {
  projects: [
    {
      preset: "ts-jest",
      testEnvironment: "node",
      displayName: "server",
      rootDir: "<rootDir>/server/"
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
