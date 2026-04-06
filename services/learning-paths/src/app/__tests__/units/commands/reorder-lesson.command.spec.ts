import { LessonId } from "@/domain/lessons/value-objects/id.vo";
import { LessonNotFoundException } from "../../../common/exceptions/lesson-not-found.exception";
import { ReorderLessonHandler } from "../../../units/commands/reorder-lesson.command";
import {
	makeLesson,
	makeUnit,
	mockLessonRepo,
	mockUnitRepo,
	TEST_IDS,
} from "../../common";

describe("ReorderLessonHandler", () => {
	it("reorders a lesson within a unit", async () => {
		const unit = makeUnit();
		unit.addLesson(LessonId.create(TEST_IDS.LESSON_ID));
		unit.addLesson(LessonId.create(TEST_IDS.LESSON_ID2));

		const lesson = makeLesson();
		const unitRepo = mockUnitRepo({ load: jest.fn().mockResolvedValue(unit) });
		const lessonRepo = mockLessonRepo({
			load: jest.fn().mockResolvedValue(lesson),
		});
		const handler = new ReorderLessonHandler(unitRepo, lessonRepo);

		await handler.execute({ lessonId: TEST_IDS.LESSON_ID, order: 1 });

		expect(lessonRepo.save).toHaveBeenCalledTimes(1);
		expect(unitRepo.save).toHaveBeenCalledTimes(1);
	});

	it("throws LessonNotFoundException when lesson not found", async () => {
		const unitRepo = mockUnitRepo();
		const lessonRepo = mockLessonRepo();
		const handler = new ReorderLessonHandler(unitRepo, lessonRepo);

		await expect(
			handler.execute({ lessonId: TEST_IDS.LESSON_ID, order: 0 }),
		).rejects.toThrow(LessonNotFoundException);
	});
});
