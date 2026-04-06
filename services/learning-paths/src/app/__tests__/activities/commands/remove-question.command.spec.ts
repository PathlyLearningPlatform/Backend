import { RemoveQuestionHandler } from "../../../activities/commands/remove-question.command";
import { ActivityNotFoundException } from "../../../common/exceptions/activity-not-found.exception";
import { QuestionNotFoundException } from "../../../common/exceptions/question-not-found.exception";
import {
	makeQuestion,
	makeQuiz,
	mockActivityRepo,
	TEST_IDS,
} from "../../common";

describe("RemoveQuestionHandler", () => {
	it("removes a question from a quiz", async () => {
		const quiz = makeQuiz();
		quiz.addQuestion(makeQuestion());

		const repo = mockActivityRepo({ load: jest.fn().mockResolvedValue(quiz) });
		const handler = new RemoveQuestionHandler(repo);

		await handler.execute({
			quizId: TEST_IDS.QUIZ_ID,
			questionId: TEST_IDS.QUESTION_ID,
		});

		expect(repo.save).toHaveBeenCalledTimes(1);
		expect(quiz.questionCount).toBe(0);
	});

	it("throws ActivityNotFoundException when quiz not found", async () => {
		const repo = mockActivityRepo();
		const handler = new RemoveQuestionHandler(repo);

		await expect(
			handler.execute({
				quizId: TEST_IDS.QUIZ_ID,
				questionId: TEST_IDS.QUESTION_ID,
			}),
		).rejects.toThrow(ActivityNotFoundException);
	});

	it("throws QuestionNotFoundException when question not found", async () => {
		const quiz = makeQuiz();
		const repo = mockActivityRepo({ load: jest.fn().mockResolvedValue(quiz) });
		const handler = new RemoveQuestionHandler(repo);

		await expect(
			handler.execute({
				quizId: TEST_IDS.QUIZ_ID,
				questionId: TEST_IDS.QUESTION_ID,
			}),
		).rejects.toThrow(QuestionNotFoundException);
	});
});
