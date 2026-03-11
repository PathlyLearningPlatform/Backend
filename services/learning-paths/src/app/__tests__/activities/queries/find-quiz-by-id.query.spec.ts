import { FindQuizByIdHandler } from '../../../activities/queries/find-quiz-by-id';
import { ActivityNotFoundException } from '../../../common/exceptions/activity-not-found.exception';
import { QuizDto } from '../../../activities/dtos';
import { ActivityType } from '@/domain/activities/value-objects/type.vo';
import { mockActivityReadRepo, TEST_IDS, DEFAULT_DATE } from '../../common';

const sampleDto: QuizDto = {
	id: TEST_IDS.QUIZ_ID,
	lessonId: TEST_IDS.LESSON_ID,
	name: 'Test Quiz',
	description: null,
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	type: ActivityType.QUIZ,
	order: 0,
	questionCount: 1,
	questions: [{ id: '333', quizId: TEST_IDS.QUIZ_ID, content: 'Q?', correctAnswer: 'A' }],
};

describe('FindQuizByIdHandler', () => {
	it('returns the quiz when found', async () => {
		const repo = mockActivityReadRepo({
			findQuizById: jest.fn().mockResolvedValue(sampleDto),
		});
		const handler = new FindQuizByIdHandler(repo);

		const result = await handler.execute({ where: { id: TEST_IDS.QUIZ_ID } });

		expect(result).toEqual(sampleDto);
		expect(repo.findQuizById).toHaveBeenCalledWith(TEST_IDS.QUIZ_ID);
	});

	it('throws ActivityNotFoundException when not found', async () => {
		const repo = mockActivityReadRepo();
		const handler = new FindQuizByIdHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.QUIZ_ID } }),
		).rejects.toThrow(ActivityNotFoundException);
	});
});
