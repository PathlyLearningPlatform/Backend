import { ReorderQuestionHandler } from '../../../activities/commands/reorder-question.command';
import { ActivityNotFoundException } from '../../../common/exceptions/activity-not-found.exception';
import { QuestionNotFoundException } from '../../../common/exceptions/question-not-found.exception';
import { mockActivityRepo, makeQuiz, makeQuestion, TEST_IDS } from '../../common';

describe('ReorderQuestionHandler', () => {
	it('reorders a question within a quiz', async () => {
		const quiz = makeQuiz();
		quiz.addQuestion(makeQuestion());
		quiz.addQuestion(makeQuestion({ id: TEST_IDS.QUESTION_ID2, order: 1 }));

		const repo = mockActivityRepo({ load: jest.fn().mockResolvedValue(quiz) });
		const handler = new ReorderQuestionHandler(repo);

		await handler.execute({ quizId: TEST_IDS.QUIZ_ID, questionId: TEST_IDS.QUESTION_ID, order: 1 });

		expect(repo.save).toHaveBeenCalledTimes(1);
	});

	it('throws ActivityNotFoundException when quiz not found', async () => {
		const repo = mockActivityRepo();
		const handler = new ReorderQuestionHandler(repo);

		await expect(
			handler.execute({ quizId: TEST_IDS.QUIZ_ID, questionId: TEST_IDS.QUESTION_ID, order: 0 }),
		).rejects.toThrow(ActivityNotFoundException);
	});

	it('throws QuestionNotFoundException when question not found', async () => {
		const quiz = makeQuiz();
		const repo = mockActivityRepo({ load: jest.fn().mockResolvedValue(quiz) });
		const handler = new ReorderQuestionHandler(repo);

		await expect(
			handler.execute({ quizId: TEST_IDS.QUIZ_ID, questionId: TEST_IDS.QUESTION_ID, order: 0 }),
		).rejects.toThrow(QuestionNotFoundException);
	});
});
