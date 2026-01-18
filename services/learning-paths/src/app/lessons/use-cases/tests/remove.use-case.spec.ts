import { mockedLesson, mockedLessonsRepository } from '@/app/common/mocks';
import {
	LessonCannotBeRemovedException,
	LessonNotFoundException,
} from '@/domain/lessons/exceptions';
import { InvalidReferenceException } from '@pathly-backend/common/index.js';
import { RemoveLessonUseCase } from '../remove.use-case';

describe('RemoveLessonUseCase', () => {
	let removeLessonUseCase: RemoveLessonUseCase;

	beforeEach(() => {
		removeLessonUseCase = new RemoveLessonUseCase(mockedLessonsRepository);
	});

	describe('execute', () => {
		it('should return a lesson', async () => {
			mockedLessonsRepository.remove.mockResolvedValueOnce(mockedLesson);

			const result = await removeLessonUseCase.execute({
				where: { id: mockedLesson.id },
			});

			expect(result).toEqual(mockedLesson);
		});

		it('should throw LessonNotFoundException', async () => {
			mockedLessonsRepository.remove.mockResolvedValueOnce(null);

			await expect(
				removeLessonUseCase.execute({ where: { id: mockedLesson.id } }),
			).rejects.toThrow(LessonNotFoundException);
		});

		it('should throw LessonCannotBeRemovedException when InvalidReferenceException is thrown', async () => {
			mockedLessonsRepository.remove.mockRejectedValueOnce(
				new InvalidReferenceException(''),
			);

			await expect(
				removeLessonUseCase.execute({ where: { id: mockedLesson.id } }),
			).rejects.toThrow(LessonCannotBeRemovedException);
		});
	});
});
