import type { LearningPathDto } from "../../../learning-paths/dtos";
import { ListLearningPathsHandler } from "../../../learning-paths/queries/list.query";
import { DEFAULT_DATE, mockLearningPathReadRepo, TEST_IDS } from "../../common";

const sampleDto: LearningPathDto = {
	id: TEST_IDS.LP_ID,
	name: "Test Path",
	description: "A description",
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	sectionCount: 0,
};

describe("ListLearningPathsHandler", () => {
	it("returns a list of learning paths", async () => {
		const dtos = [sampleDto];
		const repo = mockLearningPathReadRepo({
			list: jest.fn().mockResolvedValue(dtos),
		});
		const handler = new ListLearningPathsHandler(repo);

		const result = await handler.execute({});

		expect(result).toEqual(dtos);
	});

	it("passes pagination options to the repository", async () => {
		const repo = mockLearningPathReadRepo({
			list: jest.fn().mockResolvedValue([]),
		});
		const handler = new ListLearningPathsHandler(repo);

		await handler.execute({ options: { limit: 10, page: 2 } });

		expect(repo.list).toHaveBeenCalledWith({
			options: { limit: 10, page: 2 },
		});
	});
});
