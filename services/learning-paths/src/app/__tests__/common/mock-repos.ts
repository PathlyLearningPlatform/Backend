import { ILearningPathRepository } from '@/domain/learning-paths/interfaces';
import { ISectionRepository } from '@/domain/sections/interfaces';
import { IUnitRepository } from '@/domain/units/interfaces';
import { ILessonRepository } from '@/domain/lessons/interfaces';
import { IActivityRepository } from '@/domain/activities/interfaces';
import { ILearningPathReadRepository } from '../../learning-paths/interfaces';
import { ISectionReadRepository } from '../../sections/interfaces';
import { IUnitReadRepository } from '../../units/interfaces';
import { ILessonReadRepository } from '../../lessons/interfaces';
import { IActivityReadRepository } from '../../activities/interfaces';

export function mockLearningPathRepo(
	overrides: Partial<ILearningPathRepository> = {},
): ILearningPathRepository {
	return {
		load: jest.fn().mockResolvedValue(null),
		save: jest.fn().mockResolvedValue(undefined),
		remove: jest.fn().mockResolvedValue(true),
		...overrides,
	};
}

export function mockSectionRepo(
	overrides: Partial<ISectionRepository> = {},
): ISectionRepository {
	return {
		load: jest.fn().mockResolvedValue(null),
		save: jest.fn().mockResolvedValue(undefined),
		remove: jest.fn().mockResolvedValue(true),
		...overrides,
	};
}

export function mockUnitRepo(
	overrides: Partial<IUnitRepository> = {},
): IUnitRepository {
	return {
		load: jest.fn().mockResolvedValue(null),
		save: jest.fn().mockResolvedValue(undefined),
		remove: jest.fn().mockResolvedValue(true),
		...overrides,
	};
}

export function mockLessonRepo(
	overrides: Partial<ILessonRepository> = {},
): ILessonRepository {
	return {
		load: jest.fn().mockResolvedValue(null),
		save: jest.fn().mockResolvedValue(undefined),
		remove: jest.fn().mockResolvedValue(true),
		...overrides,
	};
}

export function mockActivityRepo(
	overrides: Partial<IActivityRepository> = {},
): IActivityRepository {
	return {
		load: jest.fn().mockResolvedValue(null),
		save: jest.fn().mockResolvedValue(undefined),
		remove: jest.fn().mockResolvedValue(true),
		...overrides,
	};
}

export function mockLearningPathReadRepo(
	overrides: Partial<ILearningPathReadRepository> = {},
): ILearningPathReadRepository {
	return {
		findById: jest.fn().mockResolvedValue(null),
		list: jest.fn().mockResolvedValue([]),
		...overrides,
	};
}

export function mockSectionReadRepo(
	overrides: Partial<ISectionReadRepository> = {},
): ISectionReadRepository {
	return {
		findById: jest.fn().mockResolvedValue(null),
		list: jest.fn().mockResolvedValue([]),
		...overrides,
	};
}

export function mockUnitReadRepo(
	overrides: Partial<IUnitReadRepository> = {},
): IUnitReadRepository {
	return {
		findById: jest.fn().mockResolvedValue(null),
		list: jest.fn().mockResolvedValue([]),
		...overrides,
	};
}

export function mockLessonReadRepo(
	overrides: Partial<ILessonReadRepository> = {},
): ILessonReadRepository {
	return {
		findById: jest.fn().mockResolvedValue(null),
		list: jest.fn().mockResolvedValue([]),
		...overrides,
	};
}

export function mockActivityReadRepo(
	overrides: Partial<IActivityReadRepository> = {},
): IActivityReadRepository {
	return {
		findById: jest.fn().mockResolvedValue(null),
		findArticleById: jest.fn().mockResolvedValue(null),
		findExerciseById: jest.fn().mockResolvedValue(null),
		findQuizById: jest.fn().mockResolvedValue(null),
		list: jest.fn().mockResolvedValue([]),
		listArticles: jest.fn().mockResolvedValue([]),
		listExercises: jest.fn().mockResolvedValue([]),
		listQuizzes: jest.fn().mockResolvedValue([]),
		...overrides,
	};
}
