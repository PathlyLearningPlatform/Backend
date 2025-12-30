import { mockedSection, mockedSectionsRepository } from '@/app/common/mocks';
import { FindSectionsUseCase } from '../find.use-case';

describe('FindSectionsUseCase', () => {
	let findSectionsUseCase: FindSectionsUseCase;

	beforeEach(() => {
		findSectionsUseCase = new FindSectionsUseCase(mockedSectionsRepository);
	});

	describe('execute', () => {
		it('should return an array of sections', async () => {
			mockedSectionsRepository.find.mockResolvedValueOnce([mockedSection]);

			const result = await findSectionsUseCase.execute({});

			expect(result).toEqual([mockedSection]);
		});
	});
});
