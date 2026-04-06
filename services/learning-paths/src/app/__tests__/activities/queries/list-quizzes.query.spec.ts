import { ActivityType } from "@/domain/activities/value-objects/type.vo";
import type { QuizWithoutQuestionsDto } from "../../../activities/dtos";
import { ListQuizzesHandler } from "../../../activities/queries/list-quizzes.query";
import { DEFAULT_DATE, mockActivityReadRepo, TEST_IDS } from "../../common";

const sampleDto: QuizWithoutQuestionsDto = {
	id: TEST_IDS.QUIZ_ID,
	lessonId: TEST_IDS.LESSON_ID,
	name: "Test Quiz",
	description: null,
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	type: ActivityType.QUIZ,
	order: 0,
	questionCount: 0,
};

describe("ListQuizzesHandler", () => {
	it("returns a list of quizzes", async () => {
		const dtos = [sampleDto];
		const repo = mockActivityReadRepo({
			listQuizzes: jest.fn().mockResolvedValue(dtos),
		});
		const handler = new ListQuizzesHandler(repo);

		const result = await handler.execute({});

		expect(result).toEqual(dtos);
	});

	it("passes filter and pagination to the repository", async () => {
		const repo = mockActivityReadRepo({
			listQuizzes: jest.fn().mockResolvedValue([]),
		});
		const handler = new ListQuizzesHandler(repo);

		await handler.execute({
			where: { lessonId: TEST_IDS.LESSON_ID },
			options: { limit: 10, page: 2 },
		});

		expect(repo.listQuizzes).toHaveBeenCalledWith({
			where: { lessonId: TEST_IDS.LESSON_ID },
			options: { limit: 10, page: 2 },
		});
	});
});
