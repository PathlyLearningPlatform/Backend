import { mockedLesson, mockedLessonsRepository } from '@/app/common/mocks';
import { LessonNotFoundException } from '@/domain/lessons/exceptions';
import { UpdateLessonUseCase } from '../update.use-case';

describe('UpdateLessonUseCase', () => {
	let updateLessonUseCase: UpdateLessonUseCase;

	beforeEach(() => {
		updateLessonUseCase = new UpdateLessonUseCase(mockedLessonsRepository);
	});

	describe('execute', () => {
		it('should return a lesson', async () => {
			mockedLessonsRepository.update.mockResolvedValueOnce(mockedLesson);

			const result = await updateLessonUseCase.execute({
				where: { id: mockedLesson.id },
				fields: { name: mockedLesson.name },
			});

			expect(result).toEqual(mockedLesson);
		});

		it('should throw LessonNotFoundException', async () => {
			mockedLessonsRepository.update.mockResolvedValueOnce(null);

			await expect(
				updateLessonUseCase.execute({
					where: { id: mockedLesson.id },
					fields: { name: mockedLesson.name },
				}),
			).rejects.toThrow(LessonNotFoundException);
		});
	});
});
