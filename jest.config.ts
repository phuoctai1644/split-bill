import type { Config } from 'jest';
const config: Config = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: 'tsconfig.app.json' }] },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};
export default config;
