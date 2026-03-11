import { AddArticleHandler } from '../../../lessons/commands/add-article.command';
import { LessonNotFoundException } from '../../../common/exceptions/lesson-not-found.exception';
import { ActivityType } from '@/domain/activities/value-objects/type.vo';
import { mockLessonRepo, mockActivityRepo, makeLesson, TEST_IDS } from '../../common';

describe('AddArticleHandler', () => {
	it('adds an article to a lesson', async () => {
		const lesson = makeLesson();
		const lessonRepo = mockLessonRepo({ load: jest.fn().mockResolvedValue(lesson) });
		const activityRepo = mockActivityRepo();
		const handler = new AddArticleHandler(lessonRepo, activityRepo);

		const result = await handler.execute({
			lessonId: TEST_IDS.LESSON_ID,
			name: 'New Article',
			description: 'Article desc',
			ref: 'https://example.com/new',
		});

		expect(result.name).toBe('New Article');
		expect(result.description).toBe('Article desc');
		expect(result.lessonId).toBe(TEST_IDS.LESSON_ID);
		expect(result.type).toBe(ActivityType.ARTICLE);
		expect(result.ref).toBe('https://example.com/new');
		expect(result.order).toBe(0);
		expect(activityRepo.save).toHaveBeenCalledTimes(1);
		expect(lessonRepo.save).toHaveBeenCalledTimes(1);
	});

	it('throws LessonNotFoundException when lesson not found', async () => {
		const lessonRepo = mockLessonRepo();
		const activityRepo = mockActivityRepo();
		const handler = new AddArticleHandler(lessonRepo, activityRepo);

		await expect(
			handler.execute({ lessonId: TEST_IDS.LESSON_ID, name: 'A', ref: 'https://example.com' }),
		).rejects.toThrow(LessonNotFoundException);
	});
});
