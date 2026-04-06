import { ExerciseDifficulty } from "@/domain/activities/exercises/value-objects";
import { ActivityType } from "@/domain/activities/value-objects/type.vo";
import type { ExerciseDto } from "../../../activities/dtos";
import { ListExercisesHandler } from "../../../activities/queries/list-exercises.query";
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

describe("ListExercisesHandler", () => {
	it("returns a list of exercises", async () => {
		const dtos = [sampleDto];
		const repo = mockActivityReadRepo({
			listExercises: jest.fn().mockResolvedValue(dtos),
		});
		const handler = new ListExercisesHandler(repo);

		const result = await handler.execute({});

		expect(result).toEqual(dtos);
	});

	it("passes filter and pagination to the repository", async () => {
		const repo = mockActivityReadRepo({
			listExercises: jest.fn().mockResolvedValue([]),
		});
		const handler = new ListExercisesHandler(repo);

		await handler.execute({
			where: { lessonId: TEST_IDS.LESSON_ID },
			options: { limit: 10, page: 2 },
		});

		expect(repo.listExercises).toHaveBeenCalledWith({
			where: { lessonId: TEST_IDS.LESSON_ID },
			options: { limit: 10, page: 2 },
		});
	});
});
