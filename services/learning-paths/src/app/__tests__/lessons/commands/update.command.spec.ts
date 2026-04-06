import { LessonNotFoundException } from "../../../common/exceptions/lesson-not-found.exception";
import { UpdateLessonHandler } from "../../../lessons/commands/update.command";
import { makeLesson, mockLessonRepo, TEST_IDS } from "../../common";

describe("UpdateLessonHandler", () => {
	it("updates a lesson and saves it", async () => {
		const lesson = makeLesson();
		const repo = mockLessonRepo({ load: jest.fn().mockResolvedValue(lesson) });
		const handler = new UpdateLessonHandler(repo);

		const result = await handler.execute({
			where: { id: TEST_IDS.LESSON_ID },
			props: { name: "Updated Lesson", description: "New desc" },
		});

		expect(result.name).toBe("Updated Lesson");
		expect(result.description).toBe("New desc");
		expect(result.updatedAt).toBeInstanceOf(Date);
		expect(repo.save).toHaveBeenCalledTimes(1);
	});

	it("throws LessonNotFoundException when not found", async () => {
		const repo = mockLessonRepo();
		const handler = new UpdateLessonHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.LESSON_ID } }),
		).rejects.toThrow(LessonNotFoundException);
	});
});
