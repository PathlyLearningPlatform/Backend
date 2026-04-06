import type { LessonDto } from "../../../lessons/dtos";
import { ListLessonsHandler } from "../../../lessons/queries/list.query";
import { DEFAULT_DATE, mockLessonReadRepo, TEST_IDS } from "../../common";

const sampleDto: LessonDto = {
	id: TEST_IDS.LESSON_ID,
	unitId: TEST_IDS.UNIT_ID,
	name: "Test Lesson",
	description: null,
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	order: 0,
	activityCount: 0,
};

describe("ListLessonsHandler", () => {
	it("returns a list of lessons", async () => {
		const dtos = [sampleDto];
		const repo = mockLessonReadRepo({
			list: jest.fn().mockResolvedValue(dtos),
		});
		const handler = new ListLessonsHandler(repo);

		const result = await handler.execute({});

		expect(result).toEqual(dtos);
	});

	it("passes filter and pagination to the repository", async () => {
		const repo = mockLessonReadRepo({
			list: jest.fn().mockResolvedValue([]),
		});
		const handler = new ListLessonsHandler(repo);

		await handler.execute({
			where: { unitId: "123" },
			options: { limit: 5, page: 1 },
		});

		expect(repo.list).toHaveBeenCalledWith({
			where: { unitId: "123" },
			options: { limit: 5, page: 1 },
		});
	});
});
