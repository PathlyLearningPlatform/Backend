import { Exercise } from "../../activities/exercises/exercise.aggregate";
import { ExerciseDifficulty } from "../../activities/exercises/value-objects/difficulty.vo";
import { ActivityDescription } from "../../activities/value-objects/description.vo";
import { ActivityId } from "../../activities/value-objects/id.vo";
import { ActivityName } from "../../activities/value-objects/name.vo";
import { ActivityType } from "../../activities/value-objects/type.vo";
import { Order } from "../../common/value-objects/order.vo";
import { UUID } from "../../common/value-objects/uuid.vo";
import { LessonId } from "../../lessons/value-objects/id.vo";

const makeUuid = (value: string) => new UUID({ value });

const makeActivityId = (value = "123e4567-e89b-42d3-a456-426614174000") =>
	new ActivityId({ value: makeUuid(value) });

const makeLessonId = (value = "223e4567-e89b-42d3-a456-426614174000") =>
	new LessonId({ value: makeUuid(value) });

describe("Exercise aggregate", () => {
	describe("create", () => {
		it("creates an exercise with all props", () => {
			const createdAt = new Date("2026-03-10T12:00:00.000Z");
			const id = makeActivityId();
			const lessonId = makeLessonId();

			const exercise = Exercise.create(id, {
				lessonId,
				name: ActivityName.create("My Exercise"),
				description: ActivityDescription.create("A description"),
				createdAt,
				order: Order.create(0),
				difficulty: ExerciseDifficulty.MEDIUM,
			});

			expect(exercise.id).toBe(id);
			expect(exercise.lessonId).toBe(lessonId);
			expect(exercise.name.value).toBe("My Exercise");
			expect(exercise.description?.value).toBe("A description");
			expect(exercise.createdAt).toBe(createdAt);
			expect(exercise.updatedAt).toBeNull();
			expect(exercise.order.value).toBe(0);
			expect(exercise.type).toBe(ActivityType.EXERCISE);
			expect(exercise.difficulty).toBe(ExerciseDifficulty.MEDIUM);
		});

		it("sets description to null when not provided", () => {
			const exercise = Exercise.create(makeActivityId(), {
				lessonId: makeLessonId(),
				name: ActivityName.create("Exercise"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
				difficulty: ExerciseDifficulty.EASY,
			});

			expect(exercise.description).toBeNull();
		});

		it("sets type to EXERCISE regardless of input", () => {
			const exercise = Exercise.create(makeActivityId(), {
				lessonId: makeLessonId(),
				name: ActivityName.create("Exercise"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
				difficulty: ExerciseDifficulty.HARD,
			});

			expect(exercise.type).toBe(ActivityType.EXERCISE);
		});
	});

	describe("fromDataSource", () => {
		it("reconstructs an exercise from raw data", () => {
			const createdAt = new Date("2026-03-10T12:00:00.000Z");
			const updatedAt = new Date("2026-03-10T13:00:00.000Z");
			const id = makeActivityId();
			const lessonId = makeLessonId();

			const exercise = Exercise.fromDataSource({
				id: id.value,
				lessonId: lessonId.value,
				name: "My Exercise",
				description: "A description",
				createdAt,
				updatedAt,
				order: 2,
				difficulty: ExerciseDifficulty.HARD,
			});

			expect(exercise.id.value).toBe(id.value);
			expect(exercise.lessonId.value).toBe(lessonId.value);
			expect(exercise.name.value).toBe("My Exercise");
			expect(exercise.description?.value).toBe("A description");
			expect(exercise.createdAt).toBe(createdAt);
			expect(exercise.updatedAt).toBe(updatedAt);
			expect(exercise.order.value).toBe(2);
			expect(exercise.type).toBe(ActivityType.EXERCISE);
			expect(exercise.difficulty).toBe(ExerciseDifficulty.HARD);
		});

		it("sets description to null when null is provided", () => {
			const exercise = Exercise.fromDataSource({
				id: makeActivityId().value,
				lessonId: makeLessonId().value,
				name: "Exercise",
				description: null,
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				updatedAt: null,
				order: 0,
				difficulty: ExerciseDifficulty.EASY,
			});

			expect(exercise.description).toBeNull();
		});
	});

	describe("update", () => {
		it("updates name, description, difficulty and sets updatedAt", () => {
			const now = new Date("2026-03-10T12:05:00.000Z");
			const exercise = Exercise.create(makeActivityId(), {
				lessonId: makeLessonId(),
				name: ActivityName.create("Old Name"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
				difficulty: ExerciseDifficulty.EASY,
			});

			exercise.update(now, {
				name: ActivityName.create("New Name"),
				description: ActivityDescription.create("New Desc"),
				difficulty: ExerciseDifficulty.HARD,
			});

			expect(exercise.name.value).toBe("New Name");
			expect(exercise.description?.value).toBe("New Desc");
			expect(exercise.difficulty).toBe(ExerciseDifficulty.HARD);
			expect(exercise.updatedAt).toBe(now);
		});

		it("sets updatedAt even when no props provided", () => {
			const exercise = Exercise.create(makeActivityId(), {
				lessonId: makeLessonId(),
				name: ActivityName.create("Exercise"),
				createdAt: new Date("2026-03-10T12:00:00.000Z"),
				order: Order.create(0),
				difficulty: ExerciseDifficulty.MEDIUM,
			});
			const now = new Date("2026-03-10T12:05:00.000Z");

			exercise.update(now);

			expect(exercise.updatedAt).toBe(now);
		});
	});
});
