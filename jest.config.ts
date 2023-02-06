import type { Config } from 'jest'

const config: Config = {
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  roots: [
    '<rootDir>/src'
  ],
  testEnvironment: 'jest-environment-node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}', '<rootDir>/tests/**/*.{spec,test}.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}

export default config
