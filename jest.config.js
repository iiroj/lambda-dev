module.exports = {
  collectCoverageFrom: ["lib/**/*.{js}"],
  collectCoverage: true,
  coverageReporters: process.env.CI ? ["text-summary"] : ["lcov"],
  coverageThreshold: {
    global: {
      statements: 1,
      branches: 1,
      functions: 1,
      lines: 1
    }
  },
  testEnvironment: "node",
  testRegex: "test/.*\\.test\\.js$"
};
