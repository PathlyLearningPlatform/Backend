import { randomUUID } from "node:crypto";
import type { ExerciseDto } from "@/app/activities/dtos";
import { type ICommandHandler, LessonNotFoundException } from "@/app/common";
import { Exercise } from "@/domain/activities/exercises/exercise.aggregate";
import type { ExerciseDifficulty } from "@/domain/activities/exercises/value-objects";
import type { IActivityRepository } from "@/domain/activities/repositories";
import {
	ActivityDescription,
	ActivityName,
	ActivityType,
} from "@/domain/activities/value-objects";
import { ActivityId } from "@/domain/activities/value-objects/id.vo";
import type { ILessonRepository } from "@/domain/lessons/repositories";
import { LessonId } from "@/domain/lessons/value-objects/id.vo";

type AddExerciseCommand = {
	lessonId: string;
	name: string;
	description?: string | null;
	difficulty: ExerciseDifficulty;
};
type AddExerciseResult = ExerciseDto;

export class AddExerciseHandler
	implements ICommandHandler<AddExerciseCommand, AddExerciseResult>
{
	constructor(
		private readonly lessonRepository: ILessonRepository,
		private readonly activityRepository: IActivityRepository,
	) {}

	async execute(command: AddExerciseCommand): Promise<AddExerciseResult> {
		const lessonId = LessonId.create(command.lessonId);
		const lesson = await this.lessonRepository.load(lessonId);

		if (!lesson) {
			throw new LessonNotFoundException(lessonId.value);
		}

		const activityId = ActivityId.create(randomUUID());
		const activityRef = lesson.addActivity(activityId);

		const exercise = Exercise.create(activityRef.activityId, {
			createdAt: new Date(),
			lessonId,
			name: ActivityName.create(command.name),
			description:
				command.description != null
					? ActivityDescription.create(command.description)
					: null,
			order: activityRef.order,
			difficulty: command.difficulty,
		});

		lesson.update(new Date());

		await this.activityRepository.save(exercise);
		await this.lessonRepository.save(lesson);

		return {
			type: ActivityType.EXERCISE,
			id: exercise.id.value,
			lessonId: exercise.lessonId.value,
			name: exercise.name.value,
			description: exercise.description?.value ?? null,
			createdAt: exercise.createdAt,
			updatedAt: exercise.updatedAt ?? null,
			order: exercise.order.value,
			difficulty: exercise.difficulty,
		};
	}
}
