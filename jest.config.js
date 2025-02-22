module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./prisma/jest.setup.ts'],
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};