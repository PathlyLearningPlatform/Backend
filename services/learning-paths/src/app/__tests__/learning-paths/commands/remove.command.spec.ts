import { LearningPathNotFoundException } from "../../../common/exceptions/learning-path-not-found.exception";
import { RemoveLearningPathHandler } from "../../../learning-paths/commands/remove.command";
import { makeLearningPath, mockLearningPathRepo, TEST_IDS } from "../../common";

describe("RemoveLearningPathHandler", () => {
	it("removes a learning path", async () => {
		const lp = makeLearningPath();
		const repo = mockLearningPathRepo({
			load: jest.fn().mockResolvedValue(lp),
		});
		const handler = new RemoveLearningPathHandler(repo);

		await handler.execute({ where: { id: TEST_IDS.LP_ID } });

		expect(repo.remove).toHaveBeenCalledTimes(1);
	});

	it("throws LearningPathNotFoundException when not found", async () => {
		const repo = mockLearningPathRepo();
		const handler = new RemoveLearningPathHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.LP_ID } }),
		).rejects.toThrow(LearningPathNotFoundException);
	});
});
