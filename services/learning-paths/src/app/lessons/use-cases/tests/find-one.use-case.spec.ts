import { mockedLesson, mockedLessonsRepository } from '@/app/common/mocks';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';
import { FindOneLessonUseCase } from '../find-one.use-case';

describe('FindOneLessonUseCase', () => {
	let findOneLessonUseCase: FindOneLessonUseCase;

	beforeEach(() => {
		findOneLessonUseCase = new FindOneLessonUseCase(mockedLessonsRepository);
	});

	describe('execute', () => {
		it('should return a lesson', async () => {
			mockedLessonsRepository.findOne.mockResolvedValueOnce(mockedLesson);

			const result = await findOneLessonUseCase.execute({
				where: { id: mockedLesson.id },
			});

			expect(result).toEqual(mockedLesson);
		});

		it('should throw LessonNotFoundException', async () => {
			mockedLessonsRepository.findOne.mockResolvedValueOnce(null);

			await expect(
				findOneLessonUseCase.execute({ where: { id: mockedLesson.id } }),
			).rejects.toThrow(LessonNotFoundException);
		});
	});
});
