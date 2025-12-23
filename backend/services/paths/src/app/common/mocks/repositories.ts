import type { IPathsRepository } from '@/app/paths/interfaces';
import type { ISectionsRepository } from '@/app/sections/interfaces';
import type { IUnitsRepository } from '@/app/units/interfaces';

export const mockedPathsRepository: jest.Mocked<IPathsRepository> = {
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
