export default {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js'],
  testMatch: ['**/tests/unit/**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [],
  setupFiles: ['./tests/setup.js'],
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/main.js',
    '!js/componentLoader.js',
    '!js/metaprojectLoader.js',
  ],
};
