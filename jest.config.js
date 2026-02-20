export default {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js'],
  testMatch: ['**/tests/unit/**/*.test.js'],
  transform: {},
  setupFilesAfterEnv: ['./tests/setup.js'],
};
