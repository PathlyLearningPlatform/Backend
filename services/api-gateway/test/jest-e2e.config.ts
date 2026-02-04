import { Config } from 'jest'
import { pathsToModuleNameMapper } from 'ts-jest'
const { compilerOptions } = require('../tsconfig.json')

export const config: Config = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '..',
	testRegex: '.e2e-spec.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	testEnvironment: 'node',
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>/',
	}),
}

export default config
