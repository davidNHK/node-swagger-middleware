module.exports = {
  testEnvironment: "node",
  testRegex: "__tests__/.*.test.js$",
  coverageThreshold: {
    global: {
      statements: 99,
      branches: 97,
      lines: 100,
      functions: 100
    }
  },
  collectCoverageFrom: ["lib/**/*.js"]
}
