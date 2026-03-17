import type { Config } from 'jest';

const config: Config = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
		'^@domain/(.*)$': '<rootDir>/domain/$1',
		'^@app/(.*)$': '<rootDir>/app/$1',
		'^@infra/(.*)$': '<rootDir>/infra/$1',
	},
};

export default config;
