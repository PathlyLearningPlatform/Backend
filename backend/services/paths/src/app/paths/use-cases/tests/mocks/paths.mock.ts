import type { Path } from '@/domain/paths/entities';

export const mockedPath: Path = {
	id: '4692163a-3f1e-46f1-abd2-8c47f05a469c',
	createdAt: '2025-12-10T20:00:00Z',
	updatedAt: '2025-12-10T20:00:00Z',
	description: null,
	name: 'Web development for begginers',
};
export const mockedUpdatedPath: Path = {
	...mockedPath,
	name: 'Web development for begginers [UPDATED]',
};
