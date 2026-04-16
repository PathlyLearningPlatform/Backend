import { type ICommandHandler, LessonNotFoundException } from '@/app/common';
import type { ILessonRepository } from '@/domain/lessons/repositories';
import { LessonDescription, LessonName } from '@/domain/lessons/value-objects';
import { LessonId } from '@/domain/lessons/value-objects/id.vo';
import type { LessonDto } from '../dtos';

type UpdateLessonCommand = {
	where: {
		id: string;
	};
	props?: {
		name?: string;
		description?: string | null;
	};
};
type UpdateLessonResult = LessonDto;

export class UpdateLessonHandler
	implements ICommandHandler<UpdateLessonCommand, UpdateLessonResult>
{
	constructor(private readonly lessonRepository: ILessonRepository) {}

	async execute(command: UpdateLessonCommand): Promise<UpdateLessonResult> {
		const id = LessonId.create(command.where.id);
		const lesson = await this.lessonRepository.findById(id);

		if (!lesson) {
			throw new LessonNotFoundException(id.value);
		}

		const name = command.props?.name
			? LessonName.create(command.props.name)
			: undefined;

		const description = command.props?.description
			? LessonDescription.create(command.props.description)
			: command.props?.description === null
				? null
				: undefined;

		lesson.update(new Date(), { name, description });

		await this.lessonRepository.save(lesson);

		return {
			id: lesson.id.value,
			unitId: lesson.unitId.value,
			name: lesson.name.value,
			description: lesson.description?.value ?? null,
			createdAt: lesson.createdAt,
			updatedAt: lesson.updatedAt ?? null,
			order: lesson.order.value,
			activityCount: lesson.activityCount,
		};
	}
}
