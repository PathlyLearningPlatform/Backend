import type { Config } from 'jest'
import { pathsToModuleNameMapper } from 'ts-jest'
const { compilerOptions } = require('./tsconfig.json')

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
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
}

export default config
