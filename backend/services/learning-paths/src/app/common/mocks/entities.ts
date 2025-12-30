import type { LearningPath } from '@/domain/learning-paths/entities';
import type { Section } from '@/domain/sections/entities';
import type { Unit } from '@/domain/units/entities';

export const mockedLearningPath: LearningPath = {
	id: '4692163a-3f1e-46f1-abd2-8c47f05a469c',
	createdAt: '2025-12-10T20:00:00.000Z',
	updatedAt: '2025-12-10T20:00:00.000Z',
	description: null,
	name: 'Web development for begginers',
};

export const mockedSection: Section = {
	id: '9a399363-81f0-45a3-8afa-cc9745df3327',
	createdAt: '2025-12-10T20:00:00.000Z',
	updatedAt: '2025-12-10T20:00:00.000Z',
	description: null,
	name: 'Building blocks',
	learningPathId: mockedLearningPath.id,
	order: 0,
};

export const mockedUnit: Unit = {
	id: '3554808d-ba5e-4b20-bc75-25fdd30e6902',
	createdAt: '2025-12-10T20:00:00.000Z',
	updatedAt: '2025-12-10T20:00:00.000Z',
	description: null,
	name: 'HTML',
	sectionId: mockedSection.id,
	order: 0,
};
