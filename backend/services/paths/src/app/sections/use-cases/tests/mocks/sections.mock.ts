import type { Section } from '@/domain/sections/entities';

export const mockedSection: Section = {
	id: '4692163a-3f1e-46f1-abd2-8c47f05a469c',
	createdAt: '2025-12-10T20:00:00Z',
	updatedAt: '2025-12-10T20:00:00Z',
	description: null,
	name: 'Web development for begginers',
	pathId: '1bff1698-5d7e-40b3-b12a-6200ef5bbaf4',
	order: 0,
};
export const mockedUpdatedSection: Section = {
	...mockedSection,
	name: 'Web development for begginers [UPDATED]',
};
