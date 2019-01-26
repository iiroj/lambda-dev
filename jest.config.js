module.exports = {
  collectCoverage: true,
  coverageReporters: process.env.CI ? ["text-summary"] : ["lcov"],
  preset: "ts-jest"
};
