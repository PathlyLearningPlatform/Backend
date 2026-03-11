import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

const config: Config = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleNameMapper: pathsToModuleNameMapper(
		{
			'@/*': ['./src/*'],
			'@domain/*': ['./src/domain/*'],
			'@app/*': ['./src/app/*'],
			'@infra/*': ['./src/infra/*'],
		},
		{ prefix: '<rootDir>/' },
	),
};

export default config;
