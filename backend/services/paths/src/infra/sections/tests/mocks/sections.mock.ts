import type { Section as ClientSection } from '@pathly-backend/contracts/paths/v1/sections.js';
import type { DbSection } from '../../types';
import { Section } from '@/domain/sections/entities';
import { nullToEmptyString } from '@pathly-backend/common/index.js';

export const mockedSection: Section = {
	id: '4692163a-3f1e-46f1-abd2-8c47f05a469c',
	pathId: '1bff1698-5d7e-40b3-b12a-6200ef5bbaf4',
	createdAt: '2025-12-10T20:00:00.000Z',
	updatedAt: '2025-12-10T20:00:00.000Z',
	description: null,
	name: 'Web development for begginers',
	order: 0,
};
export const mockedUpdatedSection: Section = {
	...mockedSection,
	name: 'Web development for begginers [UPDATED]',
};

export const mockedDbSection: DbSection = {
	...mockedSection,
	createdAt: new Date(mockedSection.createdAt),
	updatedAt: new Date(mockedSection.updatedAt),
};

export const mockedClientSection: ClientSection = {
	...mockedSection,
	description: nullToEmptyString(mockedSection.description),
};
