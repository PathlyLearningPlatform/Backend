import { IEventHandler } from '@/app/common';
import { ExerciseCompletedEvent } from '@/domain/exercises';

export class OnExerciseCompletedHandler
	implements IEventHandler<ExerciseCompletedEvent>
{
	constructor() {}

	async handle(event: ExerciseCompletedEvent): Promise<void> {}
}
