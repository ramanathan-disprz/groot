module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^axios$': '<rootDir>/src/__mocks__/axios.ts'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios/)',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    "!src/**/dtos/**/*",
    "!src/**/types/**/*",
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/__mocks__/**',
    '!src/**/constants/**',
    '!src/**/index.{ts,tsx}',
    '!src/**/Logo.{tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
