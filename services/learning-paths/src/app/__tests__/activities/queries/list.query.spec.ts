import { ActivityType } from "@/domain/activities/value-objects/type.vo";
import type { ActivityDto } from "../../../activities/dtos";
import { ListActivitiesHandler } from "../../../activities/queries/list.query";
import { DEFAULT_DATE, mockActivityReadRepo, TEST_IDS } from "../../common";

const sampleDto: ActivityDto = {
	id: TEST_IDS.ACTIVITY_ID,
	lessonId: TEST_IDS.LESSON_ID,
	name: "Test Activity",
	description: null,
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	type: ActivityType.ARTICLE,
	order: 0,
};

describe("ListActivitiesHandler", () => {
	it("returns a list of activities", async () => {
		const dtos = [sampleDto];
		const repo = mockActivityReadRepo({
			list: jest.fn().mockResolvedValue(dtos),
		});
		const handler = new ListActivitiesHandler(repo);

		const result = await handler.execute({});

		expect(result).toEqual(dtos);
	});

	it("passes filter and pagination to the repository", async () => {
		const repo = mockActivityReadRepo({
			list: jest.fn().mockResolvedValue([]),
		});
		const handler = new ListActivitiesHandler(repo);

		await handler.execute({
			where: { lessonId: TEST_IDS.LESSON_ID },
			options: { limit: 5, page: 1 },
		});

		expect(repo.list).toHaveBeenCalledWith({
			where: { lessonId: TEST_IDS.LESSON_ID },
			options: { limit: 5, page: 1 },
		});
	});
});
