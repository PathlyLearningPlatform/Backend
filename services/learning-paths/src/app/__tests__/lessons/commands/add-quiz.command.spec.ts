import { AddQuizHandler } from '../../../lessons/commands/add-quiz.command';
import { LessonNotFoundException } from '../../../common/exceptions/lesson-not-found.exception';
import { ActivityType } from '@/domain/activities/value-objects/type.vo';
import { mockLessonRepo, mockActivityRepo, makeLesson, TEST_IDS } from '../../common';

describe('AddQuizHandler', () => {
	it('adds a quiz to a lesson', async () => {
		const lesson = makeLesson();
		const lessonRepo = mockLessonRepo({ load: jest.fn().mockResolvedValue(lesson) });
		const activityRepo = mockActivityRepo();
		const handler = new AddQuizHandler(lessonRepo, activityRepo);

		const result = await handler.execute({
			lessonId: TEST_IDS.LESSON_ID,
			name: 'New Quiz',
			description: 'Quiz desc',
		});

		expect(result.name).toBe('New Quiz');
		expect(result.description).toBe('Quiz desc');
		expect(result.lessonId).toBe(TEST_IDS.LESSON_ID);
		expect(result.type).toBe(ActivityType.QUIZ);
		expect(result.questionCount).toBe(0);
		expect(result.order).toBe(0);
		expect(activityRepo.save).toHaveBeenCalledTimes(1);
		expect(lessonRepo.save).toHaveBeenCalledTimes(1);
	});

	it('throws LessonNotFoundException when lesson not found', async () => {
		const lessonRepo = mockLessonRepo();
		const activityRepo = mockActivityRepo();
		const handler = new AddQuizHandler(lessonRepo, activityRepo);

		await expect(
			handler.execute({ lessonId: TEST_IDS.LESSON_ID, name: 'Q' }),
		).rejects.toThrow(LessonNotFoundException);
	});
});
