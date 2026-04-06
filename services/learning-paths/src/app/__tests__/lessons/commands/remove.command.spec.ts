import { LessonId } from "@/domain/lessons/value-objects/id.vo";
import { LessonNotFoundException } from "../../../common/exceptions/lesson-not-found.exception";
import { RemoveLessonHandler } from "../../../lessons/commands/remove.command";
import {
	makeLesson,
	makeUnit,
	mockLessonRepo,
	mockUnitRepo,
	TEST_IDS,
} from "../../common";

describe("RemoveLessonHandler", () => {
	it("removes a lesson and updates the unit", async () => {
		const lesson = makeLesson();
		const unit = makeUnit();
		unit.addLesson(LessonId.create(TEST_IDS.LESSON_ID));

		const lessonRepo = mockLessonRepo({
			load: jest.fn().mockResolvedValue(lesson),
		});
		const unitRepo = mockUnitRepo({ load: jest.fn().mockResolvedValue(unit) });
		const handler = new RemoveLessonHandler(unitRepo, lessonRepo);

		await handler.execute({ lessonId: TEST_IDS.LESSON_ID });

		expect(lessonRepo.remove).toHaveBeenCalledTimes(1);
		expect(unitRepo.save).toHaveBeenCalledTimes(1);
	});

	it("throws LessonNotFoundException when lesson not found", async () => {
		const lessonRepo = mockLessonRepo();
		const unitRepo = mockUnitRepo();
		const handler = new RemoveLessonHandler(unitRepo, lessonRepo);

		await expect(
			handler.execute({ lessonId: TEST_IDS.LESSON_ID }),
		).rejects.toThrow(LessonNotFoundException);
	});
});
