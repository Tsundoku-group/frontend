const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>/'],
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy',
    },
    testMatch: [
        '<rootDir>/__tests__/**/*.test.{js,jsx,ts,tsx}',
    ],
};

module.exports = createJestConfig(customJestConfig);