import type { Section as ClientSection } from '@pathly-backend/contracts/learning-paths/v1/sections.js';
import type { DbSection } from '../../types';
import { nullToEmptyString } from '@pathly-backend/common/index.js';
import { mockedSection } from '@/app/common/mocks';

export const mockedDbSection: DbSection = {
	...mockedSection,
	createdAt: new Date(mockedSection.createdAt),
	updatedAt: new Date(mockedSection.updatedAt),
};

export const mockedClientSection: ClientSection = {
	...mockedSection,
	description: nullToEmptyString(mockedSection.description),
};
