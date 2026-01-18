import { mockedLesson, mockedLessonsRepository } from '@/app/common/mocks';
import { FindLessonsUseCase } from '../find.use-case';

describe('FindLessonsUseCase', () => {
	let findLessonsUseCase: FindLessonsUseCase;

	beforeEach(() => {
		findLessonsUseCase = new FindLessonsUseCase(mockedLessonsRepository);
	});

	describe('execute', () => {
		it('should return an array of lessons', async () => {
			mockedLessonsRepository.find.mockResolvedValueOnce([mockedLesson]);

			const result = await findLessonsUseCase.execute({});

			expect(result).toEqual([mockedLesson]);
		});
	});
});
