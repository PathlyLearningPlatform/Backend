import type { Path as ClientPath } from '@pathly-backend/contracts/paths/v1/paths.js';
import type { DbPath } from '../../types';
import { nullToEmptyString } from '@pathly-backend/common/index.js';
import { mockedPath } from '@/app/common/mocks';

export const mockedDbPath: DbPath = {
	...mockedPath,
	createdAt: new Date(mockedPath.createdAt),
	updatedAt: new Date(mockedPath.updatedAt),
};

export const mockedClientPath: ClientPath = {
	...mockedPath,
	description: nullToEmptyString(mockedPath.description),
};
