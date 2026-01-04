import { nullToEmptyString } from '@pathly-backend/common/index.js';
import type { Section as ClientSection } from '@pathly-backend/contracts/learning-paths/v1/sections.js';
import { mockedSection } from '@/app/common/mocks';
import type { DbSection } from '../../types';

export const mockedDbSection: DbSection = {
	...mockedSection,
	createdAt: new Date(mockedSection.createdAt),
	updatedAt: new Date(mockedSection.updatedAt),
};

export const mockedClientSection: ClientSection = {
	...mockedSection,
	description: nullToEmptyString(mockedSection.description),
};
