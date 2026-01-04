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
		'^@app/(.*)$': '<rootDir>/$1/app',
		'^@domain/(.*)$': '<rootDir>/$1/domain',
		'^@infra/(.*)$': '<rootDir>/$1/infra',
		'^@/(.*)$': '<rootDir>/$1',
	},
};

export default config;
