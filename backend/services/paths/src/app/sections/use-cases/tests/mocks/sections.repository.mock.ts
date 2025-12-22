import type { ISectionsRepository } from '@/domain/sections/interfaces';

export const mockedSectionsRepository: jest.Mocked<ISectionsRepository> = {
	find: jest.fn(),
	findOne: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
};
