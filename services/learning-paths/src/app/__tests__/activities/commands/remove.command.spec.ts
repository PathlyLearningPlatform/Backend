import { ActivityId } from "@/domain/activities/value-objects/id.vo";
import { RemoveActivityHandler } from "../../../activities/commands/remove.command";
import { ActivityNotFoundException } from "../../../common/exceptions/activity-not-found.exception";
import {
	makeArticle,
	makeLesson,
	mockActivityRepo,
	mockLessonRepo,
	TEST_IDS,
} from "../../common";

describe("RemoveActivityHandler", () => {
	it("removes an activity and updates the lesson", async () => {
		const article = makeArticle();
		const lesson = makeLesson();
		lesson.addActivity(ActivityId.create(TEST_IDS.ARTICLE_ID));

		const activityRepo = mockActivityRepo({
			load: jest.fn().mockResolvedValue(article),
		});
		const lessonRepo = mockLessonRepo({
			load: jest.fn().mockResolvedValue(lesson),
		});
		const handler = new RemoveActivityHandler(activityRepo, lessonRepo);

		await handler.execute({ activityId: TEST_IDS.ARTICLE_ID });

		expect(activityRepo.remove).toHaveBeenCalledTimes(1);
		expect(lessonRepo.save).toHaveBeenCalledTimes(1);
	});

	it("throws ActivityNotFoundException when activity not found", async () => {
		const activityRepo = mockActivityRepo();
		const lessonRepo = mockLessonRepo();
		const handler = new RemoveActivityHandler(activityRepo, lessonRepo);

		await expect(
			handler.execute({ activityId: TEST_IDS.ARTICLE_ID }),
		).rejects.toThrow(ActivityNotFoundException);
	});
});
