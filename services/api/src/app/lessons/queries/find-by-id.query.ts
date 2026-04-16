import { type IQueryHandler, LessonNotFoundException } from '@/app/common';
import type { LessonDto } from '../dtos';
import { ILessonRepository, LessonId } from '@/domain/lessons';
import { aggregateToDto } from '../helpers';

type FindLessonByIdQuery = {
	where: {
		id: string;
	};
};
type FindLessonByIdResult = LessonDto;

export class FindLessonByIdHandler
	implements IQueryHandler<FindLessonByIdQuery, FindLessonByIdResult>
{
	constructor(private readonly lessonRepository: ILessonRepository) {}

	async execute(query: FindLessonByIdQuery): Promise<FindLessonByIdResult> {
		const lessonId = LessonId.create(query.where.id);
		const lesson = await this.lessonRepository.findById(lessonId);

		if (!lesson) {
			throw new LessonNotFoundException(query.where.id);
		}

		return aggregateToDto(lesson);
	}
}
