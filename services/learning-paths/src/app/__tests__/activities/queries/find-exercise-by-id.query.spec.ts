import { ExerciseDifficulty } from "@/domain/activities/exercises/value-objects";
import { ActivityType } from "@/domain/activities/value-objects/type.vo";
import type { ExerciseDto } from "../../../activities/dtos";
import { FindExerciseByIdHandler } from "../../../activities/queries/find-exercise-by-id.query";
import { ActivityNotFoundException } from "../../../common/exceptions/activity-not-found.exception";
import { DEFAULT_DATE, mockActivityReadRepo, TEST_IDS } from "../../common";

const sampleDto: ExerciseDto = {
	id: TEST_IDS.EXERCISE_ID,
	lessonId: TEST_IDS.LESSON_ID,
	name: "Test Exercise",
	description: null,
	createdAt: DEFAULT_DATE,
	updatedAt: null,
	type: ActivityType.EXERCISE,
	order: 0,
	difficulty: ExerciseDifficulty.MEDIUM,
};

describe("FindExerciseByIdHandler", () => {
	it("returns the exercise when found", async () => {
		const repo = mockActivityReadRepo({
			findExerciseById: jest.fn().mockResolvedValue(sampleDto),
		});
		const handler = new FindExerciseByIdHandler(repo);

		const result = await handler.execute({
			where: { id: TEST_IDS.EXERCISE_ID },
		});

		expect(result).toEqual(sampleDto);
		expect(repo.findExerciseById).toHaveBeenCalledWith(TEST_IDS.EXERCISE_ID);
	});

	it("throws ActivityNotFoundException when not found", async () => {
		const repo = mockActivityReadRepo();
		const handler = new FindExerciseByIdHandler(repo);

		await expect(
			handler.execute({ where: { id: TEST_IDS.EXERCISE_ID } }),
		).rejects.toThrow(ActivityNotFoundException);
	});
});
