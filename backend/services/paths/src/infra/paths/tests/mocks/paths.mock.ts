import type { Path as ClientPath } from '@pathly-backend/contracts/paths/v1/paths.js';
import type { DbPath } from '../../types';
import { Path } from '@/domain/paths/entities';
import { nullToEmptyString } from '@pathly-backend/common/index.js';

export const mockedPath: Path = {
	id: '4692163a-3f1e-46f1-abd2-8c47f05a469c',
	createdAt: '2025-12-10T20:00:00.000Z',
	updatedAt: '2025-12-10T20:00:00.000Z',
	description: null,
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

export const mockedClientPath: ClientPath = {
	...mockedPath,
	description: nullToEmptyString(mockedPath.description),
};
