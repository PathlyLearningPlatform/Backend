import { ExerciseNotFoundException, type ICommandHandler } from '@/app/common';
import type { ExerciseDifficulty } from '@/domain/exercises/value-objects';
import {
	ActivityDescription,
	ActivityName,
	ActivityType,
} from '@/domain/activities/value-objects';
import { ActivityId } from '@/domain/activities/value-objects/id.vo';
import type { ExerciseDto } from '../dtos';
import { IExerciseRepository } from '@/domain/exercises/repositories';

type UpdateExerciseCommand = {
	where: {
		id: string;
	};
	props?: {
		name?: string;
		description?: string | null;
		difficulty?: ExerciseDifficulty;
	};
};
type UpdateExerciseResult = ExerciseDto;

export class UpdateExerciseHandler
	implements ICommandHandler<UpdateExerciseCommand, UpdateExerciseResult>
{
	constructor(private readonly exerciseRepository: IExerciseRepository) {}

	async execute(command: UpdateExerciseCommand): Promise<UpdateExerciseResult> {
		const id = ActivityId.create(command.where.id);
		const exercise = await this.exerciseRepository.findById(id);

		if (!exercise) {
			throw new ExerciseNotFoundException(id.value);
		}

		const name = command.props?.name
			? ActivityName.create(command.props.name)
			: undefined;

		const description = command.props?.description
			? ActivityDescription.create(command.props.description)
			: command.props?.description === null
				? null
				: undefined;

		exercise.update(new Date(), {
			name,
			description,
			difficulty: command.props?.difficulty,
		});

		await this.exerciseRepository.save(exercise);

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
