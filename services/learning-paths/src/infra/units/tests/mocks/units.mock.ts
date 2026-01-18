import { nullToEmptyString } from '@pathly-backend/common/index.js';
import type { Unit as ClientUnit } from '@pathly-backend/contracts/learning-paths/v1/units.js';
import { mockedUnit } from '@/app/common/mocks';
import type { DbUnit } from '../../types';

export const mockedDbUnit: DbUnit = {
	...mockedUnit,
	createdAt: new Date(mockedUnit.createdAt),
	updatedAt: new Date(mockedUnit.updatedAt),
};

export const mockedClientUnit: ClientUnit = {
	...mockedUnit,
	description: nullToEmptyString(mockedUnit.description),
};
