import type { ILearningPathsRepository } from '@/app/learning-paths/interfaces';
import type { ILessonsRepository } from '@/app/lessons/interfaces';
import type { ISectionsRepository } from '@/app/sections/interfaces';
import type { IUnitsRepository } from '@/app/units/interfaces';

export const mockedLearningPathsRepository: jest.Mocked<ILearningPathsRepository> =
	{
		find: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
	};

export const mockedSectionsRepository: jest.Mocked<ISectionsRepository> = {
	find: jest.fn(),
	findOne: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
};

export const mockedUnitsRepository: jest.Mocked<IUnitsRepository> = {
	find: jest.fn(),
	findOne: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
};

export const mockedLessonsRepository: jest.Mocked<ILessonsRepository> = {
	find: jest.fn(),
	findOne: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
};
