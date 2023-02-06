import type { Config } from 'jest'
import jestConfig from './jest.config'

const config: Config = jestConfig
config.collectCoverage = false
config.roots = [
  '<rootDir>/src'
]
config.testMatch = ['<rootDir>/src/**/__tests__/**/*.spec.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.spec.{js,jsx,ts,tsx}']

export default config
