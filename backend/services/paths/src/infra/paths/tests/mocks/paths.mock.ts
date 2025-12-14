import type { Path } from '@pathly-backend/contracts/paths/v1/paths.js';
import type { DbPath } from '../../types';

export const mockedPath: Path = {
	id: '4692163a-3f1e-46f1-abd2-8c47f05a469c',
	createdAt: '2025-12-10T20:00:00.000Z',
	updatedAt: '2025-12-10T20:00:00.000Z',
	description: '',
	name: 'Web development for begginers',
};
export const mockedUpdatedPath: Path = {
	...mockedPath,
	name: 'Web development for begginers [UPDATED]',
};

export const mockedDbPath: DbPath = {
	...mockedPath,
	createdAt: new Date(mockedPath.createdAt),
	updatedAt: new Date(mockedPath.updatedAt),
};
