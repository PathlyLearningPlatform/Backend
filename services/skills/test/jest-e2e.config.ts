import type { Config } from 'jest'
import { pathsToModuleNameMapper } from 'ts-jest'

import tsconfig from '../tsconfig.json' with { type: 'json' }

export const config: Config = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '..',
	testRegex: '.e2e-spec.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	testEnvironment: 'node',
	moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
		prefix: '<rootDir>/',
	}),
}

export default config
