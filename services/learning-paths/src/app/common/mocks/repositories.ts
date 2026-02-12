import type { ILearningPathsRepository } from '@/domain/learning-paths/interfaces';
import type { ILessonsRepository } from '@/domain/lessons/interfaces';
import type { ISectionsRepository } from '@/domain/sections/interfaces';
import type { IUnitsRepository } from '@/domain/units/interfaces';

export const mockedLearningPathsRepository: jest.Mocked<ILearningPathsRepository> =
	{
		find: jest.fn(),
		findOne: jest.fn(),
		save: jest.fn(),
		remove: jest.fn(),
	};

export const mockedSectionsRepository: jest.Mocked<ISectionsRepository> = {
	find: jest.fn(),
	findOne: jest.fn(),
	save: jest.fn(),
	remove: jest.fn(),
};

export const mockedUnitsRepository: jest.Mocked<IUnitsRepository> = {
	find: jest.fn(),
	findOne: jest.fn(),
	save: jest.fn(),
	remove: jest.fn(),
};

export const mockedLessonsRepository: jest.Mocked<ILessonsRepository> = {
	find: jest.fn(),
	findOne: jest.fn(),
	save: jest.fn(),
	remove: jest.fn(),
};
