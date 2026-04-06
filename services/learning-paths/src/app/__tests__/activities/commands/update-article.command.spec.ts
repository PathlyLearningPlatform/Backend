import { ActivityType } from "@/domain/activities/value-objects/type.vo";
import { UpdateArticleHandler } from "../../../activities/commands/update-article.command";
import { ActivityNotFoundException } from "../../../common/exceptions/activity-not-found.exception";
import {
	makeArticle,
	makeExercise,
	mockActivityRepo,
	TEST_IDS,
} from "../../common";

describe("UpdateArticleHandler", () => {
	it("updates an article and saves it", async () => {
		const article = makeArticle();
		const repo = mockActivityRepo({
			load: jest.fn().mockResolvedValue(article),
		});
		const handler = new UpdateArticleHandler(repo);

		const result = await handler.execute({
			where: { id: TEST_IDS.ARTICLE_ID },
			props: {
				name: "Updated Article",
				description: "New desc",
				ref: "https://example.com/updated",
			},
		});

		expect(result.name).toBe("Updated Article");
		expect(result.description).toBe("New desc");
		expect(result.ref).toBe("https://example.com/updated");
		expect(result.type).toBe(ActivityType.ARTICLE);
		expect(result.updatedAt).toBeInstanceOf(Date);
		expect(repo.save).toHaveBeenCalledTimes(1);
	});

	it("throws ActivityNotFoundException when not found", async () => {
		const repo = mockActivityRepo();
		const handler = new UpdateArticleHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.ARTICLE_ID } }),
		).rejects.toThrow(ActivityNotFoundException);
	});

	it("throws ActivityNotFoundException when activity is not an Article", async () => {
		const exercise = makeExercise();
		const repo = mockActivityRepo({
			load: jest.fn().mockResolvedValue(exercise),
		});
		const handler = new UpdateArticleHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.EXERCISE_ID } }),
		).rejects.toThrow(ActivityNotFoundException);
	});
});
