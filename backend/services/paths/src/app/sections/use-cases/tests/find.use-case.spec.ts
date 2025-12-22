import type { Section } from '@/domain/sections/entities';
import { FindSectionsUseCase } from '../use-cases';
import { mockedSection } from './mocks/sections.mock';
import { mockedSectionsRepository } from './mocks/sections.repository.mock';

describe('FindSectionsUseCase', () => {
	let findSectionsUseCase: FindSectionsUseCase;

	beforeEach(() => {
		findSectionsUseCase = new FindSectionsUseCase(mockedSectionsRepository);
	});

	describe('execute', () => {
		it('should return an array of sections', async () => {
			const expectedResult: Section[] = [mockedSection];

			mockedSectionsRepository.find.mockResolvedValueOnce([mockedSection]);

			const result = await findSectionsUseCase.execute({});

			expect(result).toEqual(expectedResult);
		});
	});
});
