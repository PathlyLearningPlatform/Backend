import { LearningPath } from '@/domain/learning-paths/entities';
import { Lesson } from '@/domain/lessons/entities';
import { Section } from '@/domain/sections/entities';
import { Unit } from '@/domain/units/entities';

export const mockedLearningPath = new LearningPath({
	id: '4692163a-3f1e-46f1-abd2-8c47f05a469c',
	createdAt: new Date('2025-12-10T20:00:00.000Z'),
	updatedAt: null,
	description: null,
	name: 'Web development for begginers',
});

export const mockedSection = new Section({
	id: '9a399363-81f0-45a3-8afa-cc9745df3327',
	createdAt: new Date('2025-12-10T20:00:00.000Z'),
	updatedAt: null,
	description: null,
	name: 'Building blocks',
	learningPathId: mockedLearningPath.id,
	order: 0,
});

export const mockedUnit = new Unit({
	id: '9a399363-81f0-45a3-8afa-cc9745df3327',
	createdAt: new Date('2025-12-10T20:00:00.000Z'),
	updatedAt: null,
	description: null,
	name: 'Building blocks',
	sectionId: mockedSection.id,
	order: 0,
});

export const mockedLesson = new Lesson({
	id: '9a399363-81f0-45a3-8afa-cc9745df3327',
	createdAt: new Date('2025-12-10T20:00:00.000Z'),
	updatedAt: null,
	description: null,
	name: 'Building blocks',
	unitId: mockedUnit.id,
	order: 0,
});
