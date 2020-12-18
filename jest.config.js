module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test/"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    "^@root/(.*)$": "<rootDir>/src/$1",
    "^@api/(.*)$": "<rootDir>/src/api/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@data/(.*)$": "<rootDir>/src/data/$1",
    "^@loaders/(.*)$": "<rootDir>/src/loaders/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
  },
};
