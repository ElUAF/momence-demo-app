import type { Config } from "jest"

const config: Config = {
  // Use ts-jest to process TypeScript files
  preset: "ts-jest",

  globals: {
    "ts-jest": {
      // Point ts-jest to your application's tsconfig file
      tsconfig: "tsconfig.test.json",
    },
  },

  // The test environment that will be used for testing
  testEnvironment: "jsdom",

  // Look for test files ending in .test.ts or .spec.ts
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],

  // Only use src as the root for tests (our tests live under src)
  roots: ["<rootDir>/src"],

  // Optional: collect coverage from source files
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],

  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {
    // Generic alias mapping for all other @/ imports
    "^@/(.*)$": "<rootDir>/src/$1",
  },
}

export default config
