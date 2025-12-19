import { CreateSectionUseCase } from '../use-cases';
import { mockedCreateCommand } from './mocks/commands.mock';
import { mockedSection } from './mocks/sections.mock';
import { mockedSectionsRepository } from './mocks/sections.repository.mock';

describe('CreateSectionUseCase', () => {
	let createSectionUseCase: CreateSectionUseCase;

	beforeEach(() => {
		createSectionUseCase = new CreateSectionUseCase(mockedSectionsRepository);
	});

	describe('execute', () => {
		it('should return a section', async () => {
			const section = mockedSection;

			mockedSectionsRepository.create.mockResolvedValueOnce(mockedSection);

			const result = await createSectionUseCase.execute(mockedCreateCommand);

			expect(result).toEqual(section);
		});
	});
});
