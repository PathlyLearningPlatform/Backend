import { UpdateQuestionHandler } from '../../../activities/commands/update-question.command';
import { ActivityNotFoundException } from '../../../common/exceptions/activity-not-found.exception';
import { QuestionNotFoundException } from '../../../common/exceptions/question-not-found.exception';
import { mockActivityRepo, makeQuiz, makeQuestion, TEST_IDS } from '../../common';

describe('UpdateQuestionHandler', () => {
	it('updates a question and saves the quiz', async () => {
		const quiz = makeQuiz();
		quiz.addQuestion(makeQuestion());

		const repo = mockActivityRepo({ load: jest.fn().mockResolvedValue(quiz) });
		const handler = new UpdateQuestionHandler(repo);

		const result = await handler.execute({
			quizId: TEST_IDS.QUIZ_ID,
			questionId: TEST_IDS.QUESTION_ID,
			props: { content: 'Updated?', correctAnswer: 'Yes' },
		});

		expect(result.content).toBe('Updated?');
		expect(result.correctAnswer).toBe('Yes');
		expect(result.quizId).toBe(TEST_IDS.QUIZ_ID);
		expect(repo.save).toHaveBeenCalledTimes(1);
	});

	it('throws ActivityNotFoundException when quiz not found', async () => {
		const repo = mockActivityRepo();
		const handler = new UpdateQuestionHandler(repo);

		await expect(
			handler.execute({ quizId: TEST_IDS.QUIZ_ID, questionId: TEST_IDS.QUESTION_ID }),
		).rejects.toThrow(ActivityNotFoundException);
	});

	it('throws QuestionNotFoundException when question not found', async () => {
		const quiz = makeQuiz();
		const repo = mockActivityRepo({ load: jest.fn().mockResolvedValue(quiz) });
		const handler = new UpdateQuestionHandler(repo);

		await expect(
			handler.execute({ quizId: TEST_IDS.QUIZ_ID, questionId: TEST_IDS.QUESTION_ID }),
		).rejects.toThrow(QuestionNotFoundException);
	});
});
