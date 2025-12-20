import { mockedPathsRepository } from '@/app/paths/tests/mocks/paths.repository.mock';
import { CreateSectionUseCase } from '../use-cases';
import { mockedCreateCommand } from './mocks/commands.mock';
import { mockedSection } from './mocks/sections.mock';
import { mockedSectionsRepository } from './mocks/sections.repository.mock';
import { PathNotFoundException } from '@/domain/paths/exceptions';
import { mockedPath } from '@/app/paths/tests/mocks/paths.mock';

describe('CreateSectionUseCase', () => {
	let createSectionUseCase: CreateSectionUseCase;

	beforeEach(() => {
		createSectionUseCase = new CreateSectionUseCase(
			mockedSectionsRepository,
			mockedPathsRepository,
		);
	});

	describe('execute', () => {
		it('should return a section', async () => {
			const section = mockedSection;

			mockedPathsRepository.findOne.mockResolvedValueOnce(mockedPath);

			mockedSectionsRepository.create.mockResolvedValueOnce(mockedSection);

			const result = await createSectionUseCase.execute(mockedCreateCommand);

			expect(result).toEqual(section);
		});

		it('should throw PathNotFoundException', async () => {
			mockedSectionsRepository.findOne.mockResolvedValueOnce(null);

			const promise = createSectionUseCase.execute(mockedCreateCommand);

			await expect(promise).rejects.toThrow(PathNotFoundException);
		});
	});
});
