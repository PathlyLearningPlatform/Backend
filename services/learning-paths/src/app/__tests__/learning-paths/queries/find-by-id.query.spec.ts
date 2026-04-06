import { LearningPathNotFoundException } from "../../../common/exceptions/learning-path-not-found.exception";
import type { LearningPathDto } from "../../../learning-paths/dtos";
import { FindLearningPathByIdHandler } from "../../../learning-paths/queries/find-by-id.query";
import { DEFAULT_DATE, mockLearningPathReadRepo, TEST_IDS } from "../../common";

const sampleDto: LearningPathDto = {
	id: TEST_IDS.LP_ID,
	name: "Test Path",
	description: "A description",
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	sectionCount: 0,
};

describe("FindLearningPathByIdHandler", () => {
	it("returns the learning path when found", async () => {
		const repo = mockLearningPathReadRepo({
			findById: jest.fn().mockResolvedValue(sampleDto),
		});
		const handler = new FindLearningPathByIdHandler(repo);

		const result = await handler.execute({ where: { id: TEST_IDS.LP_ID } });

		expect(result).toEqual(sampleDto);
		expect(repo.findById).toHaveBeenCalledWith(TEST_IDS.LP_ID);
	});

	it("throws LearningPathNotFoundException when not found", async () => {
		const repo = mockLearningPathReadRepo();
		const handler = new FindLearningPathByIdHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.LP_ID } }),
		).rejects.toThrow(LearningPathNotFoundException);
	});
});
