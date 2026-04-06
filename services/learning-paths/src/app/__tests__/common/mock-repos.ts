import type { IActivityRepository } from "@/domain/activities/repositories";
import type { ILearningPathRepository } from "@/domain/learning-paths";
import type { ILessonRepository } from "@/domain/lessons/repositories";
import type { ISectionRepository } from "@/domain/sections/repositories";
import type { IUnitRepository } from "@/domain/units/repositories";
import type { IActivityReadRepository } from "../../activities/interfaces";
import type { ILearningPathReadRepository } from "../../learning-paths/interfaces";
import type { ILessonReadRepository } from "../../lessons/interfaces";
import type { ISectionReadRepository } from "../../sections/interfaces";
import type { IUnitReadRepository } from "../../units/interfaces";

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
