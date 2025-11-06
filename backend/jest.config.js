module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '*.js',
    '!coverage/**'
  ],
  testMatch: ['**/tests/**/*.test.js']
};
