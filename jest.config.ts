import type { Config } from "jest"

const config: Config = {
  // Use ts-jest to process TypeScript files
  preset: "ts-jest",

  // The test environment that will be used for testing
  testEnvironment: "node",

  // Look for test files ending in .test.ts or .spec.ts
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],

  // Only use src as the root for tests (our tests live under src)
  roots: ["<rootDir>/src"],

  // Optional: collect coverage from source files
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],

  // Mapping to resolve paths defined in tsconfig.json (optional but useful)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
}

export default config
