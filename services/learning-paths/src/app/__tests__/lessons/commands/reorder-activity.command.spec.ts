import { ActivityId } from "@/domain/activities/value-objects/id.vo";
import { ActivityNotFoundException } from "../../../common/exceptions/activity-not-found.exception";
import { ReorderActivityHandler } from "../../../lessons/commands/reorder-activity.command";
import {
	makeArticle,
	makeLesson,
	mockActivityRepo,
	mockLessonRepo,
	TEST_IDS,
} from "../../common";

describe("ReorderActivityHandler", () => {
	it("reorders an activity within a lesson", async () => {
		const lesson = makeLesson();
		lesson.addActivity(ActivityId.create(TEST_IDS.ACTIVITY_ID));
		lesson.addActivity(ActivityId.create(TEST_IDS.ACTIVITY_ID2));

		const article = makeArticle({ id: TEST_IDS.ACTIVITY_ID });
		const lessonRepo = mockLessonRepo({
			load: jest.fn().mockResolvedValue(lesson),
		});
		const activityRepo = mockActivityRepo({
			load: jest.fn().mockResolvedValue(article),
		});
		const handler = new ReorderActivityHandler(lessonRepo, activityRepo);

		await handler.execute({ activityId: TEST_IDS.ACTIVITY_ID, order: 1 });

		expect(activityRepo.save).toHaveBeenCalledTimes(1);
		expect(lessonRepo.save).toHaveBeenCalledTimes(1);
	});

	it("throws ActivityNotFoundException when activity not found", async () => {
		const lessonRepo = mockLessonRepo();
		const activityRepo = mockActivityRepo();
		const handler = new ReorderActivityHandler(lessonRepo, activityRepo);

		await expect(
			handler.execute({ activityId: TEST_IDS.ACTIVITY_ID, order: 0 }),
		).rejects.toThrow(ActivityNotFoundException);
	});
});
