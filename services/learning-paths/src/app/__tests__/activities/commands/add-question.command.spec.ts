import { AddQuestionHandler } from "../../../activities/commands/add-question.command";
import { ActivityNotFoundException } from "../../../common/exceptions/activity-not-found.exception";
import {
	makeArticle,
	makeQuiz,
	mockActivityRepo,
	TEST_IDS,
} from "../../common";

describe("AddQuestionHandler", () => {
	it("adds a question to a quiz", async () => {
		const quiz = makeQuiz();
		const repo = mockActivityRepo({ load: jest.fn().mockResolvedValue(quiz) });
		const handler = new AddQuestionHandler(repo);

		const result = await handler.execute({
			quizId: TEST_IDS.QUIZ_ID,
			content: "What is 2+2?",
			correctAnswer: "4",
		});

		expect(result.content).toBe("What is 2+2?");
		expect(result.correctAnswer).toBe("4");
		expect(result.quizId).toBe(TEST_IDS.QUIZ_ID);
		expect(result.id).toBeDefined();
		expect(repo.save).toHaveBeenCalledTimes(1);
	});

	it("throws ActivityNotFoundException when quiz not found", async () => {
		const repo = mockActivityRepo();
		const handler = new AddQuestionHandler(repo);

		await expect(
			handler.execute({
				quizId: TEST_IDS.QUIZ_ID,
				content: "Q",
				correctAnswer: "A",
			}),
		).rejects.toThrow(ActivityNotFoundException);
	});

	it("throws ActivityNotFoundException when activity is not a Quiz", async () => {
		const article = makeArticle();
		const repo = mockActivityRepo({
			load: jest.fn().mockResolvedValue(article),
		});
		const handler = new AddQuestionHandler(repo);

		await expect(
			handler.execute({
				quizId: TEST_IDS.ARTICLE_ID,
				content: "Q",
				correctAnswer: "A",
			}),
		).rejects.toThrow(ActivityNotFoundException);
	});
});
